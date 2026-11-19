// GET /api/db-test -> prueba la conexión con MySQL

import { NextResponse, connection } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
    await connection();
    try {
        const [rows] = await pool.query("SELECT 1 + 2 AS suma");
        return NextResponse.json({ ok: true, resultado: rows[0] });
    } catch (error) {
        console.error("Error de base de datos:", error.message);
        return NextResponse.json(
            {
                ok: false,
                mensaje: "No se pudo conectar a la base de datos",
                detalle: error.message,
            },
            { status: 500 }
        );
    }
}
