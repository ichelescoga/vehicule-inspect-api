/**
 * Validators for Guatemala — NIT and Vehicle Plates
 */

/**
 * Validate NIT guatemalteco (Módulo 11)
 * Format: 6-9 digits + check digit (0-9 or K)
 * Special case: "CF" (Consumidor Final)
 */
function validateNIT(nit) {
    if (!nit) return { valid: false, message: 'NIT es requerido' }

    const clean = nit.replace(/[-\s]/g, '').toUpperCase()

    // Special case: Consumidor Final
    if (clean === 'CF') return { valid: true, message: null }

    // Basic format check
    if (!/^\d{6,9}[\dK]$/.test(clean)) {
        return { valid: false, message: 'Formato de NIT invalido. Debe ser 6-9 digitos + digito verificador (ej: 576937-K)' }
    }

    // Separate body and check digit
    const body = clean.substring(0, clean.length - 1)
    const checkChar = clean[clean.length - 1]

    // Calculate check digit (Módulo 11)
    let sum = 0
    for (let i = 0; i < body.length; i++) {
        const weight = body.length - i + 1
        sum += parseInt(body[i]) * weight
    }

    const remainder = sum % 11
    const calculated = (11 - remainder) % 11

    const expectedChar = calculated === 10 ? 'K' : calculated.toString()

    if (checkChar !== expectedChar) {
        return { valid: false, message: 'Digito verificador del NIT incorrecto' }
    }

    return { valid: true, message: null }
}

/**
 * Validate Guatemala vehicle plate
 * Types: P (particular), C (comercial), O (oficial), M (moto),
 *        CC (consular), CD (diplomatico), TC (transito)
 * Letters I, O, Q are excluded
 */
function validatePlate(plate) {
    if (!plate) return { valid: false, message: 'Placa es requerida' }

    const clean = plate.toUpperCase().replace(/[\s]/g, '')

    // Particular: P-123-BBB
    if (/^P-?\d{3}-?[A-HJ-NP-Z]{3}$/.test(clean)) return { valid: true, message: null }

    // Comercial: C-123-BBB
    if (/^C-?\d{3}-?[A-HJ-NP-Z]{3}$/.test(clean)) return { valid: true, message: null }

    // Oficial: O-123-BBB
    if (/^O-?\d{3}-?[A-HJ-NP-Z]{3}$/.test(clean)) return { valid: true, message: null }

    // Motocicleta: M-123-BBB or M-1234-BB
    if (/^M-?\d{3,4}-?[A-HJ-NP-Z]{2,3}$/.test(clean)) return { valid: true, message: null }

    // Cuerpo Diplomatico: CD-12-BBB
    if (/^CD-?\d{2,3}-?[A-HJ-NP-Z]{2,3}$/.test(clean)) return { valid: true, message: null }

    // Cuerpo Consular: CC-12-BBB
    if (/^CC-?\d{2,3}-?[A-HJ-NP-Z]{2,3}$/.test(clean)) return { valid: true, message: null }

    // Transito/Temporal: TC-123-BBB
    if (/^TC-?\d{3,4}-?[A-HJ-NP-Z]{2,3}$/.test(clean)) return { valid: true, message: null }

    return { valid: false, message: 'Formato de placa invalido. Ejemplos validos: P-123-BBB, C-456-DFG, M-789-HJ' }
}

module.exports = { validateNIT, validatePlate }
