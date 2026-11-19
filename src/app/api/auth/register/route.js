// crea un nuevo usuario en la base de datos, con validación de datos y encriptación de contraseña

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { encriptarPassword } from "@/lib/auth";
import { leerJson, validarRegistro } from "@/lib/validaciones";

export async function POST(request) {
    try {
        const body = await leerJson(request);
        const errores = validarRegistro(body);
        if (errores.length > 0) {
            return NextResponse.json(
                { ok: false, mensaje: "Datos inválidos", errores },
                { status: 400 }
            );
        }
        const { nombre, email, password } = body;
        const [existe] = await pool.query("SELECT id FROM usuarios WHERE email = ?",
            [email]
        );
        if (existe.length > 0) {
            return NextResponse.json(
                { ok: false, mensaje: "El email ya está registrado" },
                { status: 409 }
            );
        }
        const hash = await encriptarPassword(password);
        const [resultado] = await pool.query(
            "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
            [nombre.trim(), email, hash]
        );
        return NextResponse.json(
            {
                ok: true,
                mensaje: "Usuario registrado correctamente",
                usuario: { id: resultado.insertId, nombre: nombre.trim(), email },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { ok: false, mensaje: "Error en el servidor" },
            { status: 500 }
        );
    }
}

