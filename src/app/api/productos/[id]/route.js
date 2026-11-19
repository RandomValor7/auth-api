import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { obtenerUsuarioDelToken, noAutorizado } from "@/lib/auth";
import { leerJson, validarProducto, idValido } from "@/lib/validaciones";

function idInvalido() {
    return NextResponse.json(
        { ok: false, mensaje: "El id debe ser un número entero positivo" },
        { status: 400 }
    );
}

function noEncontrado() {
    return NextResponse.json(
        { ok: false, mensaje: "Producto no encontrado" },
        { status: 404 }
    );
}

function errorServidor(error) {
    console.error(error);
    return NextResponse.json(
        { ok: false, mensaje: "Error en el servidor" },
        { status: 500 }
    );
}

// get id devuelve un producto por id (RUTA PROTEGIDA)

export async function GET(request, { params }) {
    const datosToken = obtenerUsuarioDelToken(request);
    if (!datosToken) return noAutorizado();
    const { id } = await params; // en Next 15+ params es una promesa
    if (!idValido(id)) return idInvalido();
    try {
        const [rows] = await pool.query(
            `SELECT id, nombre, descripcion, precio, stock, creado_en
 FROM productos
 WHERE id = ?`,
            [id]
        );
        if (rows.length === 0) return noEncontrado();
        return NextResponse.json({ ok: true, producto: rows[0] });
    } catch (error) {
        return errorServidor(error);
    }
}

// este put actualiza un producto por id (RUTA PROTEGIDA)

export async function PUT(request, { params }) {
    const datosToken = obtenerUsuarioDelToken(request);
    if (!datosToken) return noAutorizado();
    const { id } = await params;
    if (!idValido(id)) return idInvalido();
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
            `UPDATE productos
 SET nombre = ?, descripcion = ?, precio = ?, stock = ?
 WHERE id = ?`,
            [nombre.trim(), descripcion ?? null, precio, stock, id]
        );
        if (resultado.affectedRows === 0) return noEncontrado();
        return NextResponse.json({ ok: true, mensaje: "Producto actualizado" });
    } catch (error) {
        return errorServidor(error);
    }
}

// delete id elimina un producto por id (RUTA PROTEGIDA)

export async function DELETE(request, { params }) {
    const datosToken = obtenerUsuarioDelToken(request);
    if (!datosToken) return noAutorizado();
    const { id } = await params;
    if (!idValido(id)) return idInvalido();
    try {
        const [resultado] = await pool.query(
            "DELETE FROM productos WHERE id = ?",
            [id]
        );
        if (resultado.affectedRows === 0) return noEncontrado();
        return NextResponse.json({ ok: true, mensaje: "Producto eliminado" });
    } catch (error) {
        return errorServidor(error);
    }
}

