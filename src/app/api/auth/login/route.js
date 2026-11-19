// Este post valida los datos de inicio de sesión, busca el usuario en la BD y devuelve un token JWT si las credenciales son correctas.

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { compararPassword, generarToken } from "@/lib/auth";
import { leerJson, validarLogin } from "@/lib/validaciones";

export async function POST(request) {
    try {
        const body = await leerJson(request);
        const errores = validarLogin(body);
        if (errores.length > 0) {
            return NextResponse.json(
                { ok: false, mensaje: "Datos inválidos", errores },
                { status: 400 }
            );
        }
        const { email, password } = body;
        const [rows] = await pool.query(
            "SELECT * FROM usuarios WHERE email = ?",
            [email]
        );
        const usuario = rows[0];
        const passwordValida =
            usuario && (await compararPassword(password, usuario.password));
        if (!passwordValida) {
            return NextResponse.json(
                { ok: false, mensaje: "Credenciales incorrectas" },
                { status: 401 }
            );
        }
        const token = generarToken(usuario);
        return NextResponse.json({
            ok: true,
            mensaje: "Inicio de sesión exitoso",
            token,
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { ok: false, mensaje: "Error en el servidor" },
            { status: 500 }
        );
    }
}
