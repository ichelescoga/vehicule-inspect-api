const PDFDocument = require('pdfkit')
const path = require('path')

const HEADER_IMG = path.join(__dirname, '..', 'assets', 'HeaderKorea.png')
const FOOTER_IMG = path.join(__dirname, '..', 'assets', 'FooterKorea.png')

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
        doc.font('Helvetica-Bold').fontSize(14)
        doc.text('COMENTARIOS', MARGIN, y, { width: CONTENT_W, align: 'center' })
        y += 20

        // Subtitle
        doc.font('Helvetica').fontSize(8).fillColor('#999999')
        doc.text('GRUPO KOREA AUTOS', MARGIN, y)
        y += 12
        doc.fillColor('#000000')

        // Description header
        doc.font('Helvetica-Bold').fontSize(13)
        doc.text('DESCRIPCION DE FALLA REPORTADA POR EL CLIENTE', MARGIN, y)
        y += 20

        // Client info
        const clientName = order.client?.name || 'N/A'
        const clientNit = order.client?.nit || 'N/A'
        const vehicleBrand = order.vehicule?.vehicule_brand?.name || ''
        const vehicleLinea = order.vehicule?.linea || ''
        const vehiclePlate = order.vehicule?.plate_id || 'N/A'
        const vehicleModel = order.vehicule?.model || 'N/A'
        const numberPass = order.number_pass || order.id

        doc.font('Helvetica').fontSize(9)
        doc.text(`Cliente: ${clientName}    NIT: ${clientNit}    Placa: ${vehiclePlate}    Pase: #${numberPass}`, MARGIN, y)
        y += 16

        // Symptom
        doc.font('Helvetica-Bold').fontSize(12)
        doc.text('SINTOMA PRINCIPAL', MARGIN, y)
        y += 16

        // Symptom box
        const symptomText = comment.main_symptom || ''
        doc.rect(MARGIN, y, CONTENT_W, 50).stroke()
        doc.font('Helvetica').fontSize(11)
        doc.text(symptomText, MARGIN + 6, y + 6, { width: CONTENT_W - 12 })
        y += 56

        // When occurs
        doc.font('Helvetica-Bold').fontSize(12)
        doc.text('* CUANDO OCURRE LA FALLA?', MARGIN, y)
        y += 16

        const whenOptions = [
            ['En frio', comment.when_cold],
            ['En caliente', comment.when_hot],
            ['En marcha', comment.when_running],
            ['En ralenti', comment.when_idle],
            ['Intermitente', comment.when_intermittent],
        ]
        doc.font('Helvetica').fontSize(11)
        for (const [label, checked] of whenOptions) {
            drawCheck(doc, MARGIN + 10, y, label, checked)
            y += 14
        }
        y += 6

        // Since when
        doc.font('Helvetica-Bold').fontSize(12)
        doc.text('* DESDE CUANDO PRESENTA LA FALLA?', MARGIN, y)
        y += 16
        doc.rect(MARGIN, y, CONTENT_W, 22).stroke()
        doc.font('Helvetica').fontSize(11)
        doc.text(comment.since_when || '', MARGIN + 6, y + 6, { width: CONTENT_W - 12 })
        y += 28

        // Previously repaired
        doc.font('Helvetica-Bold').fontSize(12)
        doc.text('* SE HA INTERVENIDO ANTERIORMENTE?', MARGIN, y)
        y += 16
        doc.font('Helvetica').fontSize(11)
        drawCheck(doc, MARGIN, y, 'SI', comment.previously_repaired == 1)
        drawCheck(doc, MARGIN + 60, y, 'NO', comment.previously_repaired != 1)
        y += 16

        if (comment.previously_repaired == 1) {
            doc.font('Helvetica-Bold').fontSize(11)
            doc.text('DETALLE:', MARGIN, y)
            y += 14
            doc.rect(MARGIN, y, CONTENT_W, 40).stroke()
            doc.font('Helvetica').fontSize(11)
            doc.text(comment.repair_detail || '', MARGIN + 6, y + 6, { width: CONTENT_W - 12 })
            y += 46
        }

        // Dashboard light
        doc.font('Helvetica-Bold').fontSize(12)
        doc.text('* SE ENCIENDE ALGUNA LUZ EN EL TABLERO?', MARGIN, y)
        y += 16
        doc.font('Helvetica').fontSize(11)
        drawCheck(doc, MARGIN, y, 'SI', comment.dashboard_light == 1)
        drawCheck(doc, MARGIN + 60, y, 'NO', comment.dashboard_light != 1)
        y += 16

        if (comment.dashboard_light == 1) {
            doc.font('Helvetica-Bold').fontSize(11)
            doc.text('CUAL?:', MARGIN, y)
            y += 14
            doc.rect(MARGIN, y, CONTENT_W, 22).stroke()
            doc.font('Helvetica').fontSize(11)
            doc.text(comment.dashboard_light_which || '', MARGIN + 6, y + 6, { width: CONTENT_W - 12 })
            y += 28
        }

        // Urgency
        doc.font('Helvetica-Bold').fontSize(12)
        doc.text('* NIVEL DE URGENCIA PERCIBIDO POR EL CLIENTE', MARGIN, y)
        y += 16
        doc.font('Helvetica').fontSize(11)
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
        doc.font('Helvetica-Bold').fontSize(11)
        doc.text('Nota: ', MARGIN, y, { continued: true })
        doc.font('Helvetica').fontSize(11)
        doc.text('La descripcion anterior corresponde exclusivamente a la informacion proporcionada por EL CLIENTE y tiene caracter referencial. EL TALLER realizara un diagnostico tecnico para determinar la causa real de la falla, la cual puede diferir de lo descrito.', {
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
            doc.font('Helvetica-Bold').fontSize(11)
            doc.text('FIRMA DEL CLIENTE:', MARGIN, y)
            y += 14
            doc.image(signatureBuffer, MARGIN, y, { fit: [250, 80] })
            y += 82
            doc.moveTo(MARGIN, y).lineTo(MARGIN + 250, y).stroke()
            y += 4
            doc.font('Helvetica').fontSize(9)
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
        doc.font('Helvetica-Bold').fontSize(22)
        doc.text('TERMINOS Y CONDICIONES DE RECEPCION Y SERVICIO DE VEHICULOS', MARGIN, y, {
            width: CONTENT_W,
            align: 'center'
        })
        y = doc.y + 8

        doc.font('Helvetica').fontSize(8).fillColor('#999999')
        doc.text('GRUPO KOREA AUTOS', MARGIN, y)
        y += 16
        doc.fillColor('#000000')

        const terms = [
            ['I. IDENTIFICACION DE LAS PARTES', 'Entre Korea Autos, en adelante "EL TALLER", y el propietario o responsable del vehiculo, en adelante "EL CLIENTE", se celebra el presente acuerdo de prestacion de servicios automotrices.'],
            ['II. OBJETO', 'Regular la recepcion, diagnostico, reparacion, custodia y entrega de vehiculos ingresados a las instalaciones de EL TALLER.'],
            ['III. RECEPCION DEL VEHICULO', 'EL CLIENTE declara que el vehiculo ha sido entregado voluntariamente y que su estado ha sido documentado mediante orden de trabajo, checklist y registro fotografico.'],
            ['IV. INSPECCION Y DIAGNOSTICO', 'El cliente acepta que el diagnostico es preliminar y pueden surgir fallas adicionales no detectadas inicialmente.'],
            ['V. AUTORIZACION DE TRABAJOS', 'Todo trabajo adicional sera autorizado por el cliente mediante firma, correo electronico o mensajeria electronica (WhatsApp).'],
            ['VI. PRUEBAS DE MANEJO', 'EL CLIENTE autoriza pruebas de manejo hasta un maximo de 25 kilometros a la redonda, segun sea necesario para diagnostico o validacion de reparacion.'],
            ['VII. OBJETOS PERSONALES', 'Korea Autos no se responsabiliza por objetos personales no declarados dentro del vehiculo.'],
            ['VIII. RESPONSABILIDAD', 'El taller sera responsable unicamente por danos comprobables derivados de negligencia directa.'],
            ['IX. COMBUSTIBLE', 'El cliente debera entregar el vehiculo con combustible suficiente o autoriza su cargo en factura.'],
            ['X. TIEMPOS DE ENTREGA', 'Los tiempos de entrega son estimados y pueden variar.'],
            ['XI. VEHICULOS NO RETIRADOS', 'Despues de 5 dias se notificara, 15 dias se cobrara parqueo y 30 dias se iniciaran acciones legales.'],
            ['XII. GARANTIA', 'La garantia cubre exclusivamente los trabajos realizados y repuestos instalados por Korea Autos. No cubre fallas distintas o no relacionadas con la reparacion efectuada, aun cuando se presenten posteriormente. El tiempo de garantia de los trabajos es de 30 dias calendario.'],
            ['XIII. ACEPTACION', 'Declaro que he leido y acepto los Terminos y Condiciones de Servicio de Korea Autos.'],
        ]

        for (const [heading, body] of terms) {
            if (y > CONTENT_BOTTOM - 50) {
                doc.addPage()
                addHeaderFooter(doc)
                y = CONTENT_TOP
            }
            doc.font('Helvetica-Bold').fontSize(12)
            doc.text(heading, MARGIN, y, { width: CONTENT_W })
            y = doc.y + 2
            doc.font('Helvetica').fontSize(11)
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

            doc.font('Helvetica-Bold').fontSize(11)
            doc.text('FIRMA DE ACEPTACION:', MARGIN, y)
            y += 14
            doc.image(signatureBuffer, MARGIN, y, { fit: [250, 80] })
            y += 82
            doc.moveTo(MARGIN, y).lineTo(MARGIN + 250, y).stroke()
            y += 4
            doc.font('Helvetica').fontSize(9)
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
        doc.font('Helvetica-Bold').fontSize(8)
        doc.text('X', x + 2, y + 1, { width: 10 })
    }
    doc.font('Helvetica').fontSize(11)
    doc.text(label, x + 14, y - 1, { width: 200 })
}

module.exports = { generateCommentsPdf, generateTermsPdf }
