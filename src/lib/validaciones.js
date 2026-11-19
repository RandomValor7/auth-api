// lee el cuerpo JSON de la petición; devuelve null si no es un JSON válido y contiene funciones de validación para registro, login y productos

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function leerJson(request) {
    try {
        return await request.json();
    } catch {
        return null;
    }
}

export function validarRegistro(body) {
    const errores = [];
    const { nombre, email, password } = body ?? {};
    if (typeof nombre !== "string" || nombre.trim().length < 2) {
        errores.push("nombre es obligatorio (mínimo 2 caracteres)");
    }
    if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
        errores.push("email es obligatorio y debe tener un formato válido");
    }
    if (typeof password !== "string" || password.length < 6) {
        errores.push("password es obligatorio (mínimo 6 caracteres)");
    }
    return errores;
}

export function validarLogin(body) {
    const errores = [];
    const { email, password } = body ?? {};
    if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
        errores.push("email es obligatorio y debe tener un formato válido");
    }
    if (typeof password !== "string" || password.length === 0) {
        errores.push("password es obligatorio");
    }
    return errores;
}

export function validarProducto(body) {
    const errores = [];
    const { nombre, descripcion, precio, stock } = body ?? {};
    if (typeof nombre !== "string" || nombre.trim().length < 2) {
        errores.push("nombre es obligatorio (mínimo 2 caracteres)");
    }
    if (typeof precio !== "number" || !(precio > 0)) {
        errores.push("precio debe ser un número mayor que 0");
    }
    if (!Number.isInteger(stock) || stock < 0) {
        errores.push("stock debe ser un entero mayor o igual a 0");
    }
    if (descripcion !== undefined && typeof descripcion !== "string") {
        errores.push("descripcion debe ser texto");
    }
    return errores;
}

export function idValido(id) {
    return Number.isInteger(Number(id)) && Number(id) > 0;
}

