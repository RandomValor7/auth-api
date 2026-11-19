import { NextResponse, connection } from "next/server";
// GET comprueba que la API responde
export async function GET() {
    await connection(); // fuerza a que se ejecute en cada petición (no en el build)
    return NextResponse.json({
        ok: true,
        mensaje: "API de Next.js funcionando",
        fecha: new Date().toISOString(),
    });
}

