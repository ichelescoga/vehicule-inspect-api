const PDFDocument = require('pdfkit')
const path = require('path')

const HEADER_IMG = path.join(__dirname, '..', 'assets', 'HeaderKorea.png')
const FOOTER_IMG = path.join(__dirname, '..', 'assets', 'FooterKorea.png')
const FONT_REGULAR = path.join(__dirname, '..', 'assets', 'fonts', 'Montserrat-Regular.ttf')
const FONT_BOLD = path.join(__dirname, '..', 'assets', 'fonts', 'Montserrat-Bold.ttf')
const FONT_ITALIC = path.join(__dirname, '..', 'assets', 'fonts', 'Montserrat-Italic.ttf')

// Letter size in points
const PAGE_W = 612
const PAGE_H = 792
const MARGIN = 36 // 0.5 inch

// Header/footer proportional heights based on image aspect ratios
const HEADER_H = (PAGE_W / 2562) * 433  // ~103
const FOOTER_H = (PAGE_W / 2575) * 637  // ~151

const CONTENT_TOP = HEADER_H + 10
const CONTENT_BOTTOM = PAGE_H - FOOTER_H - 10
const CONTENT_W = PAGE_W - MARGIN * 2

function addHeaderFooter(doc) {
    doc.image(HEADER_IMG, 0, 0, { width: PAGE_W })
    doc.image(FOOTER_IMG, 0, PAGE_H - FOOTER_H, { width: PAGE_W })
}

/**
 * Generates the "Comentarios del Cliente" PDF
 * @returns {Promise<Buffer>}
 */
function generateCommentsPdf({ order, comment, signatureBuffer }) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'LETTER', margin: 0 })
        const chunks = []
        doc.on('data', c => chunks.push(c))
        doc.on('end', () => resolve(Buffer.concat(chunks)))
        doc.on('error', reject)

        addHeaderFooter(doc)

        let y = CONTENT_TOP

        // Title centered
        doc.font(FONT_BOLD).fontSize(14)
        doc.text('COMENTARIOS', MARGIN, y, { width: CONTENT_W, align: 'center' })
        y += 20

        // Subtitle
        doc.font(FONT_REGULAR).fontSize(8).fillColor('#999999')
        doc.text('GRUPO KOREA AUTOS', MARGIN, y)
        y += 12
        doc.fillColor('#000000')

        // Description header
        doc.font(FONT_BOLD).fontSize(13)
        doc.text('DESCRIPCIÓN DE FALLA REPORTADA POR EL CLIENTE', MARGIN, y)
        y += 20

        // Client info
        const clientName = order.client?.name || 'N/A'
        const clientNit = order.client?.nit || 'N/A'
        const vehicleBrand = order.vehicule?.vehicule_brand?.name || ''
        const vehicleLinea = order.vehicule?.linea || ''
        const vehiclePlate = order.vehicule?.plate_id || 'N/A'
        const vehicleModel = order.vehicule?.model || 'N/A'
        const numberPass = order.number_pass || order.id

        doc.font(FONT_REGULAR).fontSize(9)
        doc.text(`Cliente: ${clientName}    NIT: ${clientNit}    Placa: ${vehiclePlate}    Pase: #${numberPass}`, MARGIN, y)
        y += 16

        // Symptom
        doc.font(FONT_BOLD).fontSize(12)
        doc.text('SINTOMA PRINCIPAL', MARGIN, y)
        y += 16

        // Symptom box
        const symptomText = comment.main_symptom || ''
        doc.rect(MARGIN, y, CONTENT_W, 50).stroke()
        doc.font(FONT_REGULAR).fontSize(11)
        doc.text(symptomText, MARGIN + 6, y + 6, { width: CONTENT_W - 12 })
        y += 56

        // When occurs
        doc.font(FONT_BOLD).fontSize(12)
        doc.text('* ¿CUÁNDO OCURRE LA FALLA?', MARGIN, y)
        y += 16

        const whenOptions = [
            ['En frio', comment.when_cold],
            ['En caliente', comment.when_hot],
            ['En marcha', comment.when_running],
            ['En ralenti', comment.when_idle],
            ['Intermitente', comment.when_intermittent],
        ]
        doc.font(FONT_REGULAR).fontSize(11)
        for (const [label, checked] of whenOptions) {
            drawCheck(doc, MARGIN + 10, y, label, checked)
            y += 14
        }
        y += 6

        // Since when
        doc.font(FONT_BOLD).fontSize(12)
        doc.text('* ¿DESDE CUÁNDO PRESENTA LA FALLA?', MARGIN, y)
        y += 16
        doc.rect(MARGIN, y, CONTENT_W, 22).stroke()
        doc.font(FONT_REGULAR).fontSize(11)
        doc.text(comment.since_when || '', MARGIN + 6, y + 6, { width: CONTENT_W - 12 })
        y += 28

        // Previously repaired
        doc.font(FONT_BOLD).fontSize(12)
        doc.text('* ¿SE HA INTERVENIDO ANTERIORMENTE?', MARGIN, y)
        y += 16
        doc.font(FONT_REGULAR).fontSize(11)
        drawCheck(doc, MARGIN, y, 'SI', comment.previously_repaired == 1)
        drawCheck(doc, MARGIN + 60, y, 'NO', comment.previously_repaired != 1)
        y += 16

        if (comment.previously_repaired == 1) {
            doc.font(FONT_BOLD).fontSize(11)
            doc.text('DETALLE:', MARGIN, y)
            y += 14
            doc.rect(MARGIN, y, CONTENT_W, 40).stroke()
            doc.font(FONT_REGULAR).fontSize(11)
            doc.text(comment.repair_detail || '', MARGIN + 6, y + 6, { width: CONTENT_W - 12 })
            y += 46
        }

        // Dashboard light
        doc.font(FONT_BOLD).fontSize(12)
        doc.text('* ¿SE ENCIENDE ALGUNA LUZ EN EL TABLERO?', MARGIN, y)
        y += 16
        doc.font(FONT_REGULAR).fontSize(11)
        drawCheck(doc, MARGIN, y, 'SI', comment.dashboard_light == 1)
        drawCheck(doc, MARGIN + 60, y, 'NO', comment.dashboard_light != 1)
        y += 16

        if (comment.dashboard_light == 1) {
            doc.font(FONT_BOLD).fontSize(11)
            doc.text('¿CUÁL?:', MARGIN, y)
            y += 14
            doc.rect(MARGIN, y, CONTENT_W, 22).stroke()
            doc.font(FONT_REGULAR).fontSize(11)
            doc.text(comment.dashboard_light_which || '', MARGIN + 6, y + 6, { width: CONTENT_W - 12 })
            y += 28
        }

        // Urgency
        doc.font(FONT_BOLD).fontSize(12)
        doc.text('* NIVEL DE URGENCIA PERCIBIDO POR EL CLIENTE', MARGIN, y)
        y += 16
        doc.font(FONT_REGULAR).fontSize(11)
        drawCheck(doc, MARGIN, y, 'BAJO', comment.urgency_level === 'BAJO')
        drawCheck(doc, MARGIN + 80, y, 'MEDIO', comment.urgency_level === 'MEDIO')
        drawCheck(doc, MARGIN + 170, y, 'ALTO', comment.urgency_level === 'ALTO')
        y += 20

        // Check if we need a new page
        if (y > CONTENT_BOTTOM - 100) {
            doc.addPage()
            addHeaderFooter(doc)
            y = CONTENT_TOP
        }

        // Disclaimer
        y += 10
        doc.font(FONT_BOLD).fontSize(11)
        doc.text('Nota: ', MARGIN, y, { continued: true })
        doc.font(FONT_REGULAR).fontSize(11)
        doc.text('La descripción anterior corresponde exclusivamente a la información proporcionada por EL CLIENTE y tiene carácter referencial. EL TALLER realizará un diagnóstico técnico para determinar la causa real de la falla, la cual puede diferir de lo descrito.', {
            width: CONTENT_W,
            align: 'justify'
        })
        y = doc.y + 20

        // Signature
        if (signatureBuffer) {
            if (y > CONTENT_BOTTOM - 100) {
                doc.addPage()
                addHeaderFooter(doc)
                y = CONTENT_TOP
            }
            doc.font(FONT_BOLD).fontSize(11)
            doc.text('FIRMA DEL CLIENTE:', MARGIN, y)
            y += 14
            doc.image(signatureBuffer, MARGIN, y, { fit: [250, 80] })
            y += 82
            doc.moveTo(MARGIN, y).lineTo(MARGIN + 250, y).stroke()
            y += 4
            doc.font(FONT_REGULAR).fontSize(9)
            doc.text(clientName, MARGIN, y)
            y += 12
            doc.fontSize(8).fillColor('#999999')
            doc.text(`NIT: ${clientNit}`, MARGIN, y)
        }

        doc.end()
    })
}

/**
 * Generates the "Terminos y Condiciones" PDF
 * @returns {Promise<Buffer>}
 */
function generateTermsPdf({ order, signatureBuffer }) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'LETTER', margin: 0 })
        const chunks = []
        doc.on('data', c => chunks.push(c))
        doc.on('end', () => resolve(Buffer.concat(chunks)))
        doc.on('error', reject)

        addHeaderFooter(doc)

        let y = CONTENT_TOP

        // Title
        doc.font(FONT_BOLD).fontSize(22)
        doc.text('TÉRMINOS Y CONDICIONES DE RECEPCIÓN Y SERVICIO DE VEHÍCULOS', MARGIN, y, {
            width: CONTENT_W,
            align: 'center'
        })
        y = doc.y + 8

        doc.font(FONT_REGULAR).fontSize(8).fillColor('#999999')
        doc.text('GRUPO KOREA AUTOS', MARGIN, y)
        y += 16
        doc.fillColor('#000000')

        const terms = [
            ['I. IDENTIFICACIÓN DE LAS PARTES', 'Entre Korea Autos, en adelante "EL TALLER", y el propietario o responsable del vehículo, en adelante "EL CLIENTE", se celebra el presente acuerdo de prestación de servicios automotrices.'],
            ['II. OBJETO', 'Regular la recepción, diagnóstico, reparación, custodia y entrega de vehículos ingresados a las instalaciones de EL TALLER.'],
            ['III. RECEPCIÓN DEL VEHÍCULO', 'EL CLIENTE declara que el vehículo ha sido entregado voluntariamente y que su estado ha sido documentado mediante orden de trabajo, checklist y registro fotográfico.'],
            ['IV. INSPECCIÓN Y DIAGNÓSTICO', 'El cliente acepta que el diagnóstico es preliminar y pueden surgir fallas adicionales no detectadas inicialmente.'],
            ['V. AUTORIZACIÓN DE TRABAJOS', 'Todo trabajo adicional será autorizado por el cliente mediante firma, correo electrónico o mensajería electrónica (WhatsApp).'],
            ['VI. PRUEBAS DE MANEJO', 'EL CLIENTE autoriza pruebas de manejo hasta un máximo de 25 kilómetros a la redonda, según sea necesario para diagnóstico o validación de reparación.'],
            ['VII. OBJETOS PERSONALES', 'Korea Autos no se responsabiliza por objetos personales no declarados dentro del vehículo.'],
            ['VIII. RESPONSABILIDAD', 'El taller será responsable únicamente por daños comprobables derivados de negligencia directa.'],
            ['IX. COMBUSTIBLE', 'El cliente deberá entregar el vehículo con combustible suficiente o autoriza su cargo en factura.'],
            ['X. TIEMPOS DE ENTREGA', 'Los tiempos de entrega son estimados y pueden variar.'],
            ['XI. VEHÍCULOS NO RETIRADOS', 'Después de 5 días se notificará, 15 días se cobrará parqueo y 30 días se iniciarán acciones legales.'],
            ['XII. GARANTÍA', 'La garantía cubre exclusivamente los trabajos realizados y repuestos instalados por Korea Autos. No cubre fallas distintas o no relacionadas con la reparación efectuada, aun cuando se presenten posteriormente. El tiempo de garantía de los trabajos es de 30 días calendario.'],
            ['XIII. ACEPTACIÓN', 'Declaro que he leído y acepto los Términos y Condiciones de Servicio de Korea Autos.'],
        ]

        for (const [heading, body] of terms) {
            if (y > CONTENT_BOTTOM - 50) {
                doc.addPage()
                addHeaderFooter(doc)
                y = CONTENT_TOP
            }
            doc.font(FONT_BOLD).fontSize(12)
            doc.text(heading, MARGIN, y, { width: CONTENT_W })
            y = doc.y + 2
            doc.font(FONT_REGULAR).fontSize(11)
            doc.text(body, MARGIN, y, { width: CONTENT_W, align: 'justify' })
            y = doc.y + 10
        }

        // Signature
        if (signatureBuffer) {
            if (y > CONTENT_BOTTOM - 100) {
                doc.addPage()
                addHeaderFooter(doc)
                y = CONTENT_TOP
            }
            y += 10
            const clientName = order.client?.name || ''
            const clientNit = order.client?.nit || 'N/A'

            doc.font(FONT_BOLD).fontSize(11)
            doc.text('FIRMA DE ACEPTACIÓN:', MARGIN, y)
            y += 14
            doc.image(signatureBuffer, MARGIN, y, { fit: [250, 80] })
            y += 82
            doc.moveTo(MARGIN, y).lineTo(MARGIN + 250, y).stroke()
            y += 4
            doc.font(FONT_REGULAR).fontSize(9)
            doc.text(clientName, MARGIN, y)
            y += 12
            doc.fontSize(8).fillColor('#999999')
            doc.text(`NIT: ${clientNit}`, MARGIN, y)
            y += 12
            doc.text(`Fecha: ${new Date().toLocaleDateString('es-GT')}`, MARGIN, y)
        }

        doc.end()
    })
}

function drawCheck(doc, x, y, label, checked) {
    doc.rect(x, y, 10, 10).stroke()
    if (checked) {
        doc.font(FONT_BOLD).fontSize(8)
        doc.text('X', x + 2, y + 1, { width: 10 })
    }
    doc.font(FONT_REGULAR).fontSize(11)
    doc.text(label, x + 14, y - 1, { width: 200 })
}

/**
 * Generates the "Checklist de Salida" PDF
 * @returns {Promise<Buffer>}
 */
function generateChecklistPdf({ order, checklist, signatureBuffer }) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'LETTER', margin: 0 })
        const chunks = []
        doc.on('data', c => chunks.push(c))
        doc.on('end', () => resolve(Buffer.concat(chunks)))
        doc.on('error', reject)

        addHeaderFooter(doc)

        let y = CONTENT_TOP

        // Title
        doc.font(FONT_BOLD).fontSize(14)
        doc.text('CHECKLIST DE ENTREGA', MARGIN, y, { width: CONTENT_W, align: 'center' })
        y += 20

        doc.font(FONT_REGULAR).fontSize(8).fillColor('#999999')
        doc.text('GRUPO KOREA AUTOS', MARGIN, y)
        y += 14
        doc.fillColor('#000000')

        // Order info
        const clientName = order.client?.name || 'N/A'
        const clientNit = order.client?.nit || 'N/A'
        const clientPhone = order.client?.authorization_cel || order.client?.office_cel || 'N/A'
        const vehicleBrand = order.vehicule?.vehicule_brand?.name || ''
        const vehicleLinea = order.vehicule?.linea || ''
        const vehiclePlate = order.vehicule?.plate_id || 'N/A'
        const vehicleModel = order.vehicule?.model || 'N/A'
        const vehicleFuel = order.vehicule?.fuel || 'N/A'
        const vehicleKm = order.vehicule?.km || 'N/A'
        const numberPass = order.number_pass || order.id
        const technicalName = order.technical?.name || 'N/A'
        const invoiceNumber = checklist.invoice_number || 'N/A'
        const deliveryTime = checklist.delivery_time || ''

        // Info box
        const boxH = 70
        doc.rect(MARGIN, y, CONTENT_W, boxH).stroke()

        doc.font(FONT_BOLD).fontSize(9)
        doc.text('GUATEMALA', MARGIN + 6, y + 4)
        const dateStr = new Date().toLocaleDateString('es-GT', { day: '2-digit', month: '2-digit', year: 'numeric' })
        doc.font(FONT_REGULAR).fontSize(9)
        doc.text(`Fecha: ${dateStr}`, MARGIN + 100, y + 4)
        doc.text(`Hora de entrega: ${deliveryTime}`, MARGIN + 280, y + 4)

        doc.font(FONT_BOLD).fontSize(9)
        doc.text('Cliente:', MARGIN + 6, y + 18)
        doc.font(FONT_REGULAR)
        doc.text(clientName, MARGIN + 60, y + 18)
        doc.text(`Tel\u00e9fono: ${clientPhone}`, MARGIN + 280, y + 18)
        doc.text(`NIT: ${clientNit}`, MARGIN + 430, y + 18)

        doc.font(FONT_BOLD).fontSize(9)
        doc.text('Veh\u00edculo:', MARGIN + 6, y + 32)
        doc.font(FONT_REGULAR)
        doc.text(`${vehicleBrand} ${vehicleLinea}`, MARGIN + 60, y + 32)
        doc.text(`Modelo: ${vehicleModel}`, MARGIN + 220, y + 32)
        doc.text(`Placa: ${vehiclePlate}`, MARGIN + 330, y + 32)
        doc.text(`Combustible: ${vehicleFuel}`, MARGIN + 430, y + 32)

        doc.font(FONT_BOLD).fontSize(9)
        doc.text('Pase:', MARGIN + 6, y + 46)
        doc.font(FONT_REGULAR)
        doc.text(`#${numberPass}`, MARGIN + 60, y + 46)
        doc.text(`T\u00e9cnico: ${technicalName}`, MARGIN + 220, y + 46)
        doc.text(`No. Factura: ${invoiceNumber}`, MARGIN + 430, y + 46)

        y += boxH + 14

        // ─── SECTION: NIVELES GENERALES ───
        y = drawChecklistSection(doc, MARGIN, y, 'NIVELES GENERALES', [
            ['Aceite para motor', checklist.oil_motor],
            ['Aceite para caja de motor', checklist.oil_gearbox],
            ['Aceite para caja mec\u00e1nica', checklist.oil_mechanical],
            ['Aceite para tim\u00f3n', checklist.oil_steering],
            ['Aceite de diferencial', checklist.oil_differential],
            ['Refrigerante', checklist.coolant],
            ['L\u00edquido de parabrisas', checklist.windshield_fluid],
            ['L\u00edquido para frenos', checklist.brake_fluid],
            ['Car wash', checklist.car_wash],
        ])

        y += 8

        // ─── SECTION: AROS Y NEUMATICOS ───
        if (y > CONTENT_BOTTOM - 160) {
            doc.addPage()
            addHeaderFooter(doc)
            y = CONTENT_TOP
        }

        y = drawChecklistSection(doc, MARGIN, y, 'AROS Y NEUM\u00c1TICOS', [
            ['Pernos', checklist.bolts],
            ['Esp\u00e1rragos', checklist.studs],
            ['Pernos torqueados', checklist.bolts_torqued],
            ['Tap\u00f3n de aros', checklist.rim_caps],
            ['Estado de aros', checklist.rim_condition],
            ['Estado de neum\u00e1ticos', checklist.tire_condition],
            ['Llanta de repuesto', checklist.spare_tire],
            ['Herramienta', checklist.tools],
        ])

        y += 8

        // ─── SECTION: ACCESORIOS Y TESTIGOS ───
        if (y > CONTENT_BOTTOM - 160) {
            doc.addPage()
            addHeaderFooter(doc)
            y = CONTENT_TOP
        }

        y = drawChecklistSection(doc, MARGIN, y, 'ACCESORIOS Y TESTIGOS', [
            ['Check engine', checklist.check_engine],
            ['ABS', checklist.abs_light],
            ['Air bag', checklist.airbag_light],
            ['TPMS', checklist.tpms_light],
            ['Antiderrape', checklist.anti_skid],
            ['Otros testigos', checklist.other_lights],
        ])

        if (checklist.other_lights_detail) {
            doc.font(FONT_ITALIC).fontSize(9).fillColor('#666666')
            doc.text(`Especifique: ${checklist.other_lights_detail}`, MARGIN + 10, y, { width: CONTENT_W - 20 })
            y = doc.y + 6
            doc.fillColor('#000000')
        }

        y += 8

        // ─── ENTREGA DE REPUESTOS ───
        if (y > CONTENT_BOTTOM - 80) {
            doc.addPage()
            addHeaderFooter(doc)
            y = CONTENT_TOP
        }

        doc.font(FONT_BOLD).fontSize(11).fillColor('#283346')
        doc.text('ENTREGA DE REPUESTOS REEMPLAZADOS', MARGIN, y)
        y += 16
        doc.fillColor('#000000')
        doc.font(FONT_REGULAR).fontSize(10)
        drawCheck(doc, MARGIN + 10, y, 'S\u00cd', checklist.spare_parts_delivered == 1)
        drawCheck(doc, MARGIN + 80, y, 'NO', checklist.spare_parts_delivered != 1)
        y += 18

        // ─── OBSERVACIONES ───
        if (checklist.observations) {
            if (y > CONTENT_BOTTOM - 60) {
                doc.addPage()
                addHeaderFooter(doc)
                y = CONTENT_TOP
            }
            doc.font(FONT_BOLD).fontSize(11).fillColor('#283346')
            doc.text('OBSERVACIONES', MARGIN, y)
            y += 14
            doc.fillColor('#000000')
            doc.rect(MARGIN, y, CONTENT_W, 40).stroke()
            doc.font(FONT_REGULAR).fontSize(10)
            doc.text(checklist.observations, MARGIN + 6, y + 6, { width: CONTENT_W - 12 })
            y += 46
        }

        // ─── FIRMA DE ENTREGA ───
        if (signatureBuffer) {
            if (y > CONTENT_BOTTOM - 110) {
                doc.addPage()
                addHeaderFooter(doc)
                y = CONTENT_TOP
            }
            y += 10
            doc.font(FONT_BOLD).fontSize(11)
            doc.text('FIRMA DE ENTREGA:', MARGIN, y)
            y += 14
            doc.image(signatureBuffer, MARGIN, y, { fit: [250, 80] })
            y += 82
            doc.moveTo(MARGIN, y).lineTo(MARGIN + 250, y).stroke()
            y += 4
            doc.font(FONT_REGULAR).fontSize(9)
            doc.text(clientName, MARGIN, y)
            y += 12
            doc.fontSize(8).fillColor('#999999')
            doc.text(`NIT: ${clientNit}`, MARGIN, y)
            y += 12
            doc.text(`Fecha: ${dateStr}`, MARGIN, y)
        }

        doc.end()
    })
}

/**
 * Draws a checklist section with header + rows of BIEN/NO/N/A
 * Returns the new Y position
 */
function drawChecklistSection(doc, x, y, title, items) {
    const colDesc = 220
    const colBien = 80
    const colNo = 80
    const colNa = 80
    const rowH = 16
    const tableW = colDesc + colBien + colNo + colNa

    // Section header
    doc.font(FONT_BOLD).fontSize(11).fillColor('#283346')
    doc.text(title, x, y)
    y += 16
    doc.fillColor('#000000')

    // Table header
    doc.rect(x, y, tableW, rowH).fill('#283346')
    doc.font(FONT_BOLD).fontSize(9).fillColor('#FFFFFF')
    doc.text('DESCRIPCI\u00d3N', x + 6, y + 3, { width: colDesc })
    doc.text('BIEN', x + colDesc, y + 3, { width: colBien, align: 'center' })
    doc.text('NO', x + colDesc + colBien, y + 3, { width: colNo, align: 'center' })
    doc.text('N/A', x + colDesc + colBien + colNo, y + 3, { width: colNa, align: 'center' })
    y += rowH
    doc.fillColor('#000000')

    // Rows
    for (let i = 0; i < items.length; i++) {
        const [label, value] = items[i]
        const bg = i % 2 === 0 ? '#F6F7F7' : '#FFFFFF'
        doc.rect(x, y, tableW, rowH).fill(bg)
        doc.rect(x, y, tableW, rowH).stroke('#DDDDDD')

        doc.font(FONT_REGULAR).fontSize(9).fillColor('#000000')
        doc.text(label, x + 6, y + 3, { width: colDesc - 10 })

        // Checkmarks
        const checkY = y + 3
        if (value === 'BIEN') {
            doc.font(FONT_BOLD).fontSize(10).fillColor('#2E7D32')
            doc.text('\u2713', x + colDesc, checkY, { width: colBien, align: 'center' })
        } else if (value === 'NO') {
            doc.font(FONT_BOLD).fontSize(10).fillColor('#C62828')
            doc.text('\u2717', x + colDesc + colBien, checkY, { width: colNo, align: 'center' })
        } else if (value === 'NA') {
            doc.font(FONT_REGULAR).fontSize(9).fillColor('#999999')
            doc.text('N/A', x + colDesc + colBien + colNo, checkY, { width: colNa, align: 'center' })
        }
        doc.fillColor('#000000')
        y += rowH
    }

    return y
}

module.exports = { generateCommentsPdf, generateTermsPdf, generateChecklistPdf }
