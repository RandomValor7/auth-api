import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";

// Contraseñas convertidas a hash para guardarlas en la BD
export async function encriptarPassword(password) {
    return bcrypt.hash(password, 10);
}

// Compara la contraseña escrita con el hash guardado en la BD
export async function compararPassword(password, hash) {
    return bcrypt.compare(password, hash);
}

// Tokens JWT 
// crea un token con los datos del usuario y lo firma con la clave secreta

export function generarToken(usuario) {
    return jwt.sign(
        { id: usuario.id, email: usuario.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

// Devuelve los datos del usuario o null si no hay token o no es válido.

export function obtenerUsuarioDelToken(request) {
    const authHeader = request.headers.get("authorization") ?? "";
    const [tipo, token] = authHeader.split(" ");
    if (tipo !== "Bearer" || !token) return null;
    try {
        return jwt.verify(token, JWT_SECRET); // { id, email, iat, exp }
    } catch {
        return null; // token vencido, alterado o mal formado, no se puede decodificar
    }
}

// Respuesta reutilizable para rutas protegidas sin token o con token inválido

export function noAutorizado(mensaje = "Token no enviado o inválido") {
    return NextResponse.json({ ok: false, mensaje }, { status: 401 });
}
