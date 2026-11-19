// En desarrollo Next recarga los archivos muchas veces.
// se guarda el pool en globalThis para no abrir conexiones nuevas en cada recarga. Ya que pool es pool es un conjunto de conexiones reutilizables.

import { createPool } from "mysql2/promise";

const globalForDb = globalThis;
export const pool =
    globalForDb.mysqlPool ??
    createPool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT ?? 3306),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
    });
if (process.env.NODE_ENV !== "production") globalForDb.mysqlPool = pool;

