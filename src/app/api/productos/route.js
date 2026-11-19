import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { obtenerUsuarioDelToken, noAutorizado } from "@/lib/auth";
import { leerJson, validarProducto } from "@/lib/validaciones";

// POST /api/productos -> inserta un producto (RUTA PROTEGIDA)
export async function POST(request) {
    const datosToken = obtenerUsuarioDelToken(request);
    if (!datosToken) return noAutorizado();
    try {
        const body = await leerJson(request);
        const errores = validarProducto(body);
        if (errores.length > 0) {
            return NextResponse.json(
                { ok: false, mensaje: "Datos inválidos", errores },
                { status: 400 }
            );
        }
        const { nombre, descripcion, precio, stock } = body;
        const [resultado] = await pool.query(
            `INSERT INTO productos (nombre, descripcion, precio, stock, usuario_id)
 VALUES (?, ?, ?, ?, ?)`,
            [nombre.trim(), descripcion ?? null, precio, stock, datosToken.id]
        );
        return NextResponse.json(
            {
                ok: true,
                mensaje: "Producto creado",
                producto: {
                    id: resultado.insertId,
                    nombre: nombre.trim(),
                    descripcion: descripcion ?? null,
                    precio,
                    stock,
                },
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

// GET /api/productos -> lista los productos (RUTA PROTEGIDA)
export async function GET(request) {
    const datosToken = obtenerUsuarioDelToken(request);
    if (!datosToken) return noAutorizado();
    try {
        const [rows] = await pool.query(
            `SELECT id, nombre, descripcion, precio, stock, creado_en
 FROM productos
 ORDER BY id`
        );
        return NextResponse.json({ ok: true, total: rows.length, productos: rows });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { ok: false, mensaje: "Error en el servidor" },
            { status: 500 }
        );
    }
}
