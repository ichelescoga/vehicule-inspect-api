const PDFDocument = require('pdfkit')
const {
    FONT_REGULAR, FONT_BOLD, FONT_ITALIC,
    MARGIN, CONTENT_TOP, CONTENT_BOTTOM, CONTENT_W,
    SECTION_COLORS,
    addHeaderFooter, checkNewPage,
    drawCheck, drawSectionHeader, drawFieldBox, drawChip, drawYesNo, drawChecklistSection,
} = require('./pdfHelpers')

// ═══════════════════════════════════════════════
// LEGACY — Comentarios del Cliente (tipo 3)
// Se mantiene por compatibilidad. Usar generateReceptionUnifiedPdf para nuevos flujos.
// ═══════════════════════════════════════════════
function generateCommentsPdf({ order, comment, signatureBuffer }) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'LETTER', margin: 0 })
        const chunks = []
        doc.on('data', c => chunks.push(c))
        doc.on('end', () => resolve(Buffer.concat(chunks)))
        doc.on('error', reject)

        addHeaderFooter(doc)
        let y = CONTENT_TOP

        doc.font(FONT_BOLD).fontSize(14)
        doc.text('COMENTARIOS', MARGIN, y, { width: CONTENT_W, align: 'center' })
        y += 20
        doc.font(FONT_REGULAR).fontSize(8).fillColor('#999999')
        doc.text('GRUPO KOREA AUTOS', MARGIN, y)
        y += 12
        doc.fillColor('#000000')
        doc.font(FONT_BOLD).fontSize(13)
        doc.text('DESCRIPCIÓN DE FALLA REPORTADA POR EL CLIENTE', MARGIN, y)
        y += 20

        const clientName = order.client?.name || 'N/A'
        const clientNit = order.client?.nit || 'N/A'
        const vehiclePlate = order.vehicule?.plate_id || 'N/A'
        const numberPass = order.number_pass || order.id

        doc.font(FONT_REGULAR).fontSize(9)
        doc.text(`Cliente: ${clientName}    NIT: ${clientNit}    Placa: ${vehiclePlate}    Pase: #${numberPass}`, MARGIN, y)
        y += 16

        doc.font(FONT_BOLD).fontSize(12)
        doc.text('SINTOMA PRINCIPAL', MARGIN, y)
        y += 16
        doc.rect(MARGIN, y, CONTENT_W, 50).stroke()
        doc.font(FONT_REGULAR).fontSize(11)
        doc.text(comment.main_symptom || '', MARGIN + 6, y + 6, { width: CONTENT_W - 12 })
        y += 56

        doc.font(FONT_BOLD).fontSize(12)
        doc.text('* ¿CUÁNDO OCURRE LA FALLA?', MARGIN, y)
        y += 16
        const whenOptions = [
            ['En frio', comment.when_cold], ['En caliente', comment.when_hot],
            ['En marcha', comment.when_running], ['En ralenti', comment.when_idle],
            ['Intermitente', comment.when_intermittent],
        ]
        doc.font(FONT_REGULAR).fontSize(11)
        for (const [label, checked] of whenOptions) { drawCheck(doc, MARGIN + 10, y, label, checked); y += 14 }
        y += 6

        doc.font(FONT_BOLD).fontSize(12)
        doc.text('* ¿DESDE CUÁNDO PRESENTA LA FALLA?', MARGIN, y)
        y += 16
        doc.rect(MARGIN, y, CONTENT_W, 22).stroke()
        doc.font(FONT_REGULAR).fontSize(11)
        doc.text(comment.since_when || '', MARGIN + 6, y + 6, { width: CONTENT_W - 12 })
        y += 28

        doc.font(FONT_BOLD).fontSize(12)
        doc.text('* ¿SE HA INTERVENIDO ANTERIORMENTE?', MARGIN, y)
        y += 16
        doc.font(FONT_REGULAR).fontSize(11)
        drawCheck(doc, MARGIN, y, 'SI', comment.previously_repaired == 1)
        drawCheck(doc, MARGIN + 60, y, 'NO', comment.previously_repaired != 1)
        y += 16
        if (comment.previously_repaired == 1) {
            doc.font(FONT_BOLD).fontSize(11); doc.text('DETALLE:', MARGIN, y); y += 14
            doc.rect(MARGIN, y, CONTENT_W, 40).stroke()
            doc.font(FONT_REGULAR).fontSize(11)
            doc.text(comment.repair_detail || '', MARGIN + 6, y + 6, { width: CONTENT_W - 12 }); y += 46
        }

        doc.font(FONT_BOLD).fontSize(12)
        doc.text('* ¿SE ENCIENDE ALGUNA LUZ EN EL TABLERO?', MARGIN, y)
        y += 16
        doc.font(FONT_REGULAR).fontSize(11)
        drawCheck(doc, MARGIN, y, 'SI', comment.dashboard_light == 1)
        drawCheck(doc, MARGIN + 60, y, 'NO', comment.dashboard_light != 1)
        y += 16
        if (comment.dashboard_light == 1) {
            doc.font(FONT_BOLD).fontSize(11); doc.text('¿CUÁL?:', MARGIN, y); y += 14
            doc.rect(MARGIN, y, CONTENT_W, 22).stroke()
            doc.font(FONT_REGULAR).fontSize(11)
            doc.text(comment.dashboard_light_which || '', MARGIN + 6, y + 6, { width: CONTENT_W - 12 }); y += 28
        }

        doc.font(FONT_BOLD).fontSize(12)
        doc.text('* NIVEL DE URGENCIA PERCIBIDO POR EL CLIENTE', MARGIN, y)
        y += 16
        doc.font(FONT_REGULAR).fontSize(11)
        drawCheck(doc, MARGIN, y, 'BAJO', comment.urgency_level === 'BAJO')
        drawCheck(doc, MARGIN + 80, y, 'MEDIO', comment.urgency_level === 'MEDIO')
        drawCheck(doc, MARGIN + 170, y, 'ALTO', comment.urgency_level === 'ALTO')
        y += 20

        y = checkNewPage(doc, y, 100)
        y += 10
        doc.font(FONT_BOLD).fontSize(11)
        doc.text('Nota: ', MARGIN, y, { continued: true })
        doc.font(FONT_REGULAR).fontSize(11)
        doc.text('La descripción anterior corresponde exclusivamente a la información proporcionada por EL CLIENTE y tiene carácter referencial. EL TALLER realizará un diagnóstico técnico para determinar la causa real de la falla, la cual puede diferir de lo descrito.', { width: CONTENT_W, align: 'justify' })
        y = doc.y + 20

        if (signatureBuffer) {
            y = checkNewPage(doc, y, 100)
            doc.font(FONT_BOLD).fontSize(11); doc.text('FIRMA DEL CLIENTE:', MARGIN, y); y += 14
            doc.image(signatureBuffer, MARGIN, y, { fit: [250, 80] }); y += 82
            doc.moveTo(MARGIN, y).lineTo(MARGIN + 250, y).stroke(); y += 4
            doc.font(FONT_REGULAR).fontSize(9); doc.text(clientName, MARGIN, y); y += 12
            doc.fontSize(8).fillColor('#999999'); doc.text(`NIT: ${clientNit}`, MARGIN, y)
        }
        doc.end()
    })
}

// ═══════════════════════════════════════════════
// LEGACY — Términos y Condiciones (tipo 4)
// Se mantiene por compatibilidad. Usar generateReceptionUnifiedPdf para nuevos flujos.
// ═══════════════════════════════════════════════
function generateTermsPdf({ order, signatureBuffer }) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'LETTER', margin: 0 })
        const chunks = []
        doc.on('data', c => chunks.push(c))
        doc.on('end', () => resolve(Buffer.concat(chunks)))
        doc.on('error', reject)

        addHeaderFooter(doc)
        let y = CONTENT_TOP

        doc.font(FONT_BOLD).fontSize(22)
        doc.text('TÉRMINOS Y CONDICIONES DE RECEPCIÓN Y SERVICIO DE VEHÍCULOS', MARGIN, y, { width: CONTENT_W, align: 'center' })
        y = doc.y + 8
        doc.font(FONT_REGULAR).fontSize(8).fillColor('#999999')
        doc.text('GRUPO KOREA AUTOS', MARGIN, y); y += 16
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
            ['XIII. TRASLADO POST-ENTREGA', 'Cualquier falla que presente el vehículo luego de haber sido entregado, el cliente asume la responsabilidad de trasladarlo a nuestras instalaciones para evaluación y diagnóstico.'],
            ['XIV. ACEPTACIÓN', 'Declaro que he leído y acepto los Términos y Condiciones de Servicio de Korea Autos.'],
        ]

        for (const [heading, body] of terms) {
            y = checkNewPage(doc, y, 50)
            doc.font(FONT_BOLD).fontSize(12)
            doc.text(heading, MARGIN, y, { width: CONTENT_W }); y = doc.y + 2
            doc.font(FONT_REGULAR).fontSize(11)
            doc.text(body, MARGIN, y, { width: CONTENT_W, align: 'justify' }); y = doc.y + 10
        }

        if (signatureBuffer) {
            y = checkNewPage(doc, y, 100)
            y += 10
            const clientName = order.client?.name || ''
            const clientNit = order.client?.nit || 'N/A'
            doc.font(FONT_BOLD).fontSize(11); doc.text('FIRMA DE ACEPTACIÓN:', MARGIN, y); y += 14
            doc.image(signatureBuffer, MARGIN, y, { fit: [250, 80] }); y += 82
            doc.moveTo(MARGIN, y).lineTo(MARGIN + 250, y).stroke(); y += 4
            doc.font(FONT_REGULAR).fontSize(9); doc.text(clientName, MARGIN, y); y += 12
            doc.fontSize(8).fillColor('#999999'); doc.text(`NIT: ${clientNit}`, MARGIN, y); y += 12
            doc.text(`Fecha: ${new Date().toLocaleDateString('es-GT')}`, MARGIN, y)
        }
        doc.end()
    })
}

// ═══════════════════════════════════════════════
// UNIFIED RECEPTION PDF (comentarios + términos en 1)
// ═══════════════════════════════════════════════
function generateReceptionUnifiedPdf({ order, comment, signatureBuffer }) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'LETTER', margin: 0 })
        const chunks = []
        doc.on('data', c => chunks.push(c))
        doc.on('end', () => resolve(Buffer.concat(chunks)))
        doc.on('error', reject)

        addHeaderFooter(doc)
        let y = CONTENT_TOP

        const clientName = order.client?.name || 'N/A'
        const clientNit = order.client?.nit || 'N/A'
        const vehicleBrand = order.vehicule?.vehicule_brand?.name || ''
        const vehicleLinea = order.vehicule?.linea || ''
        const vehiclePlate = order.vehicule?.plate_id || 'N/A'
        const numberPass = order.number_pass || order.id

        // Title
        doc.font(FONT_BOLD).fontSize(16).fillColor('#283346')
        doc.text('RECEPCIÓN DE VEHÍCULO', MARGIN, y, { width: CONTENT_W, align: 'center' })
        y += 22
        doc.font(FONT_REGULAR).fontSize(8).fillColor('#999999')
        doc.text('GRUPO KOREA AUTOS', MARGIN, y, { width: CONTENT_W, align: 'center' })
        y += 16
        doc.fillColor('#000000')

        // Info box
        const boxH = 32
        doc.rect(MARGIN, y, CONTENT_W, boxH).lineWidth(0.5).stroke('#CCCCCC')
        doc.font(FONT_REGULAR).fontSize(9)
        doc.text(`Cliente: ${clientName}`, MARGIN + 6, y + 5)
        doc.text(`NIT: ${clientNit}`, MARGIN + 220, y + 5)
        doc.text(`Placa: ${vehiclePlate}`, MARGIN + 350, y + 5)
        doc.text(`Vehículo: ${vehicleBrand} ${vehicleLinea}`, MARGIN + 6, y + 18)
        doc.text(`Pase: #${numberPass}`, MARGIN + 350, y + 18)
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-GT')}`, MARGIN + 440, y + 18)
        y += boxH + 12

        // ─── SECCIÓN 1: COMENTARIOS ───
        y = drawSectionHeader(doc, MARGIN, y, 'COMENTARIOS DEL CLIENTE', '▸', SECTION_COLORS.comments)
        y = drawFieldBox(doc, MARGIN, y, 'SÍNTOMA PRINCIPAL', comment.main_symptom, 45)

        doc.font(FONT_BOLD).fontSize(9).fillColor('#283346')
        doc.text('¿CUÁNDO OCURRE LA FALLA?', MARGIN, y); y += 14
        doc.fillColor('#000000')
        let cx = MARGIN
        for (const [label, checked] of [['En frío', comment.when_cold], ['En caliente', comment.when_hot], ['En marcha', comment.when_running], ['En ralentí', comment.when_idle], ['Intermitente', comment.when_intermittent]]) {
            cx = drawChip(doc, cx, y, label, checked, '#C62828')
        }
        y += 24

        y = drawFieldBox(doc, MARGIN, y, '¿DESDE CUÁNDO PRESENTA LA FALLA?', comment.since_when, 22)
        y = drawYesNo(doc, MARGIN, y, '¿SE HA INTERVENIDO ANTERIORMENTE?', comment.previously_repaired)
        if (comment.previously_repaired == 1) { y = drawFieldBox(doc, MARGIN, y, 'DETALLE', comment.repair_detail, 35) }
        y = drawYesNo(doc, MARGIN, y, '¿SE ENCIENDE ALGUNA LUZ EN EL TABLERO?', comment.dashboard_light)
        if (comment.dashboard_light == 1) { y = drawFieldBox(doc, MARGIN, y, '¿CUÁL?', comment.dashboard_light_which, 22) }

        doc.font(FONT_BOLD).fontSize(9).fillColor('#283346')
        doc.text('NIVEL DE URGENCIA', MARGIN, y); y += 14
        doc.fillColor('#000000')
        cx = MARGIN
        cx = drawChip(doc, cx, y, 'BAJO', comment.urgency_level === 'BAJO', '#2E7D32')
        cx = drawChip(doc, cx, y, 'MEDIO', comment.urgency_level === 'MEDIO', '#FF9800')
        cx = drawChip(doc, cx, y, 'ALTO', comment.urgency_level === 'ALTO', '#C62828')
        y += 24

        doc.font(FONT_ITALIC).fontSize(8).fillColor('#999999')
        doc.text('Nota: La descripción anterior corresponde exclusivamente a la información proporcionada por EL CLIENTE y tiene carácter referencial.', MARGIN, y, { width: CONTENT_W, align: 'justify' })
        y = doc.y + 14
        doc.fillColor('#000000')

        // ─── SECCIÓN 2: TÉRMINOS ───
        y = checkNewPage(doc, y, 80)
        y = drawSectionHeader(doc, MARGIN, y, 'TÉRMINOS Y CONDICIONES', '▸', SECTION_COLORS.terms)

        const terms = [
            ['I. IDENTIFICACIÓN DE LAS PARTES', 'Entre Korea Autos ("EL TALLER") y el propietario o responsable del vehículo ("EL CLIENTE"), se celebra el presente acuerdo de prestación de servicios automotrices.'],
            ['II. OBJETO', 'Regular la recepción, diagnóstico, reparación, custodia y entrega de vehículos ingresados a las instalaciones de EL TALLER.'],
            ['III. RECEPCIÓN DEL VEHÍCULO', 'EL CLIENTE declara que el vehículo ha sido entregado voluntariamente y que su estado ha sido documentado mediante orden de trabajo, checklist y registro fotográfico.'],
            ['IV. INSPECCIÓN Y DIAGNÓSTICO', 'El cliente acepta que el diagnóstico es preliminar y pueden surgir fallas adicionales no detectadas inicialmente.'],
            ['V. AUTORIZACIÓN DE TRABAJOS', 'Todo trabajo adicional será autorizado por el cliente mediante firma, correo electrónico o mensajería electrónica (WhatsApp).'],
            ['VI. PRUEBAS DE MANEJO', 'EL CLIENTE autoriza pruebas de manejo hasta un máximo de 25 kilómetros, según sea necesario para diagnóstico o validación.'],
            ['VII. OBJETOS PERSONALES', 'Korea Autos no se responsabiliza por objetos personales no declarados dentro del vehículo.'],
            ['VIII. RESPONSABILIDAD', 'El taller será responsable únicamente por daños comprobables derivados de negligencia directa.'],
            ['IX. COMBUSTIBLE', 'El cliente deberá entregar el vehículo con combustible suficiente o autoriza su cargo en factura.'],
            ['X. TIEMPOS DE ENTREGA', 'Los tiempos de entrega son estimados y pueden variar.'],
            ['XI. VEHÍCULOS NO RETIRADOS', 'Después de 5 días se notificará, 15 días se cobrará parqueo y 30 días se iniciarán acciones legales.'],
            ['XII. GARANTÍA', 'La garantía cubre exclusivamente los trabajos realizados y repuestos instalados por Korea Autos. No cubre fallas distintas o no relacionadas. Tiempo de garantía: 30 días calendario.'],
            ['XIII. TRASLADO POST-ENTREGA', 'Cualquier falla posterior, el cliente asume la responsabilidad de trasladar el vehículo a nuestras instalaciones.'],
            ['XIV. ACEPTACIÓN', 'Declaro que he leído y acepto los Términos y Condiciones de Servicio de Korea Autos.'],
        ]

        for (const [heading, body] of terms) {
            y = checkNewPage(doc, y, 40)
            doc.font(FONT_BOLD).fontSize(9).fillColor('#283346')
            doc.text(heading, MARGIN, y, { width: CONTENT_W }); y = doc.y + 1
            doc.font(FONT_REGULAR).fontSize(8).fillColor('#000000')
            doc.text(body, MARGIN, y, { width: CONTENT_W, align: 'justify' }); y = doc.y + 6
        }

        // ─── FIRMA ───
        if (signatureBuffer) {
            y = checkNewPage(doc, y, 110)
            y += 6
            y = drawSectionHeader(doc, MARGIN, y, 'FIRMA DEL CLIENTE', '▸', SECTION_COLORS.signature)
            doc.image(signatureBuffer, MARGIN, y, { fit: [250, 80] }); y += 82
            doc.moveTo(MARGIN, y).lineTo(MARGIN + 250, y).stroke(); y += 4
            doc.font(FONT_REGULAR).fontSize(9); doc.text(clientName, MARGIN, y); y += 12
            doc.fontSize(8).fillColor('#999999')
            doc.text(`NIT: ${clientNit}`, MARGIN, y); y += 12
            doc.text(`Fecha: ${new Date().toLocaleDateString('es-GT')}`, MARGIN, y)
        }

        doc.end()
    })
}

// ═══════════════════════════════════════════════
// CHECKLIST DE SALIDA (tipo 8)
// ═══════════════════════════════════════════════
function generateChecklistPdf({ order, checklist, signatureBuffer }) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'LETTER', margin: 0 })
        const chunks = []
        doc.on('data', c => chunks.push(c))
        doc.on('end', () => resolve(Buffer.concat(chunks)))
        doc.on('error', reject)

        addHeaderFooter(doc)
        let y = CONTENT_TOP

        doc.font(FONT_BOLD).fontSize(14)
        doc.text('CHECKLIST DE ENTREGA', MARGIN, y, { width: CONTENT_W, align: 'center' })
        y += 20
        doc.font(FONT_REGULAR).fontSize(8).fillColor('#999999')
        doc.text('GRUPO KOREA AUTOS', MARGIN, y); y += 14
        doc.fillColor('#000000')

        const clientName = order.client?.name || 'N/A'
        const clientNit = order.client?.nit || 'N/A'
        const clientPhone = order.client?.authorization_cel || order.client?.office_cel || 'N/A'
        const vehicleBrand = order.vehicule?.vehicule_brand?.name || ''
        const vehicleLinea = order.vehicule?.linea || ''
        const vehiclePlate = order.vehicule?.plate_id || 'N/A'
        const vehicleModel = order.vehicule?.model || 'N/A'
        const vehicleFuel = order.vehicule?.fuel || 'N/A'
        const numberPass = order.number_pass || order.id
        const technicalName = order.technical?.name || 'N/A'
        const invoiceNumber = checklist.invoice_number || 'N/A'
        const deliveryTime = checklist.delivery_time || ''
        const dateStr = new Date().toLocaleDateString('es-GT', { day: '2-digit', month: '2-digit', year: 'numeric' })

        // Info box
        const boxH = 70
        doc.rect(MARGIN, y, CONTENT_W, boxH).stroke()
        doc.font(FONT_BOLD).fontSize(9)
        doc.text('GUATEMALA', MARGIN + 6, y + 4)
        doc.font(FONT_REGULAR).fontSize(9)
        doc.text(`Fecha: ${dateStr}`, MARGIN + 100, y + 4)
        doc.text(`Hora de entrega: ${deliveryTime}`, MARGIN + 280, y + 4)
        doc.font(FONT_BOLD).fontSize(9); doc.text('Cliente:', MARGIN + 6, y + 18)
        doc.font(FONT_REGULAR); doc.text(clientName, MARGIN + 60, y + 18)
        doc.text(`Teléfono: ${clientPhone}`, MARGIN + 280, y + 18)
        doc.text(`NIT: ${clientNit}`, MARGIN + 430, y + 18)
        doc.font(FONT_BOLD).fontSize(9); doc.text('Vehículo:', MARGIN + 6, y + 32)
        doc.font(FONT_REGULAR); doc.text(`${vehicleBrand} ${vehicleLinea}`, MARGIN + 60, y + 32)
        doc.text(`Modelo: ${vehicleModel}`, MARGIN + 220, y + 32)
        doc.text(`Placa: ${vehiclePlate}`, MARGIN + 330, y + 32)
        doc.text(`Combustible: ${vehicleFuel}`, MARGIN + 430, y + 32)
        doc.font(FONT_BOLD).fontSize(9); doc.text('Pase:', MARGIN + 6, y + 46)
        doc.font(FONT_REGULAR); doc.text(`#${numberPass}`, MARGIN + 60, y + 46)
        doc.text(`Técnico: ${technicalName}`, MARGIN + 220, y + 46)
        doc.text(`No. Factura: ${invoiceNumber}`, MARGIN + 430, y + 46)
        y += boxH + 14

        y = drawChecklistSection(doc, MARGIN, y, 'NIVELES GENERALES', [
            ['Aceite para motor', checklist.oil_motor], ['Aceite para caja de motor', checklist.oil_gearbox],
            ['Aceite para caja mecánica', checklist.oil_mechanical], ['Aceite para timón', checklist.oil_steering],
            ['Aceite de diferencial', checklist.oil_differential], ['Refrigerante', checklist.coolant],
            ['Líquido de parabrisas', checklist.windshield_fluid], ['Líquido para frenos', checklist.brake_fluid],
            ['Car wash', checklist.car_wash],
        ], '#1565C0')
        y += 8

        y = checkNewPage(doc, y, 160)
        y = drawChecklistSection(doc, MARGIN, y, 'AROS Y NEUMÁTICOS', [
            ['Pernos', checklist.bolts], ['Espárragos', checklist.studs],
            ['Pernos torqueados', checklist.bolts_torqued], ['Tapón de aros', checklist.rim_caps],
            ['Estado de aros', checklist.rim_condition], ['Estado de neumáticos', checklist.tire_condition],
            ['Llanta de repuesto', checklist.spare_tire], ['Herramienta', checklist.tools],
        ], '#00897B')
        y += 8

        y = checkNewPage(doc, y, 160)
        y = drawChecklistSection(doc, MARGIN, y, 'ACCESORIOS Y TESTIGOS', [
            ['Check engine', checklist.check_engine], ['ABS', checklist.abs_light],
            ['Air bag', checklist.airbag_light], ['TPMS', checklist.tpms_light],
            ['Antiderrape', checklist.anti_skid], ['Otros testigos', checklist.other_lights],
        ], '#EF6C00')

        if (checklist.other_lights_detail) {
            doc.font(FONT_ITALIC).fontSize(9).fillColor('#666666')
            doc.text(`Especifique: ${checklist.other_lights_detail}`, MARGIN + 10, y, { width: CONTENT_W - 20 })
            y = doc.y + 6; doc.fillColor('#000000')
        }
        y += 8

        y = checkNewPage(doc, y, 80)
        doc.font(FONT_BOLD).fontSize(11).fillColor('#283346')
        doc.text('ENTREGA DE REPUESTOS REEMPLAZADOS', MARGIN, y); y += 16
        doc.fillColor('#000000'); doc.font(FONT_REGULAR).fontSize(10)
        drawCheck(doc, MARGIN + 10, y, 'SÍ', checklist.spare_parts_delivered == 1)
        drawCheck(doc, MARGIN + 80, y, 'NO', checklist.spare_parts_delivered != 1)
        y += 18

        if (checklist.observations) {
            y = checkNewPage(doc, y, 60)
            doc.font(FONT_BOLD).fontSize(11).fillColor('#283346')
            doc.text('OBSERVACIONES', MARGIN, y); y += 14
            doc.fillColor('#000000')
            doc.rect(MARGIN, y, CONTENT_W, 40).stroke()
            doc.font(FONT_REGULAR).fontSize(10)
            doc.text(checklist.observations, MARGIN + 6, y + 6, { width: CONTENT_W - 12 }); y += 46
        }

        if (signatureBuffer) {
            y = checkNewPage(doc, y, 110)
            y += 10
            doc.font(FONT_BOLD).fontSize(11); doc.text('FIRMA DE ENTREGA:', MARGIN, y); y += 14
            doc.image(signatureBuffer, MARGIN, y, { fit: [250, 80] }); y += 82
            doc.moveTo(MARGIN, y).lineTo(MARGIN + 250, y).stroke(); y += 4
            doc.font(FONT_REGULAR).fontSize(9); doc.text(clientName, MARGIN, y); y += 12
            doc.fontSize(8).fillColor('#999999'); doc.text(`NIT: ${clientNit}`, MARGIN, y); y += 12
            doc.text(`Fecha: ${dateStr}`, MARGIN, y)
        }

        doc.end()
    })
}

// ═══════════════════════════════════════════════
// QA / CONTROL DE CALIDAD PDF (tipo 10)
// ═══════════════════════════════════════════════
function generateQAPdf({ order, qa, qaFiles, signatureBuffer }) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'LETTER', margin: 0 })
        const chunks = []
        doc.on('data', c => chunks.push(c))
        doc.on('end', () => resolve(Buffer.concat(chunks)))
        doc.on('error', reject)

        addHeaderFooter(doc)
        let y = CONTENT_TOP

        const clientName = order.client?.name || 'N/A'
        const clientNit = order.client?.nit || 'N/A'
        const vehicleBrand = order.vehicule?.vehicule_brand?.name || ''
        const vehicleLinea = order.vehicule?.linea || ''
        const vehiclePlate = order.vehicule?.plate_id || 'N/A'
        const numberPass = order.number_pass || order.id
        const technicalName = order.technical?.name || 'N/A'

        // Title
        doc.font(FONT_BOLD).fontSize(16).fillColor('#283346')
        doc.text('CONTROL DE CALIDAD', MARGIN, y, { width: CONTENT_W, align: 'center' })
        y += 22
        doc.font(FONT_REGULAR).fontSize(8).fillColor('#999999')
        doc.text('GRUPO KOREA AUTOS', MARGIN, y, { width: CONTENT_W, align: 'center' })
        y += 16
        doc.fillColor('#000000')

        // Info box
        const boxH = 32
        doc.rect(MARGIN, y, CONTENT_W, boxH).lineWidth(0.5).stroke('#CCCCCC')
        doc.font(FONT_REGULAR).fontSize(9)
        doc.text(`Cliente: ${clientName}`, MARGIN + 6, y + 5)
        doc.text(`NIT: ${clientNit}`, MARGIN + 220, y + 5)
        doc.text(`Placa: ${vehiclePlate}`, MARGIN + 350, y + 5)
        doc.text(`Vehículo: ${vehicleBrand} ${vehicleLinea}`, MARGIN + 6, y + 18)
        doc.text(`Pase: #${numberPass}`, MARGIN + 280, y + 18)
        doc.text(`Técnico: ${technicalName}`, MARGIN + 400, y + 18)
        y += boxH + 12

        // ─── Comentarios del técnico ───
        y = drawSectionHeader(doc, MARGIN, y, 'COMENTARIOS DEL TÉCNICO', '▸', SECTION_COLORS.qa)
        y = drawFieldBox(doc, MARGIN, y, null, qa.tech_comments, 50)

        // ─── Comentarios del jefe de taller ───
        y = drawSectionHeader(doc, MARGIN, y, 'COMENTARIOS DEL JEFE DE TALLER', '▸', '#1565C0')
        y = drawFieldBox(doc, MARGIN, y, null, qa.client_comments, 50)

        // ─── Videos adjuntos ───
        y = checkNewPage(doc, y, 60)
        y = drawSectionHeader(doc, MARGIN, y, 'VIDEOS ADJUNTOS', '▸', '#00897B')
        if (qaFiles && qaFiles.length > 0) {
            for (const file of qaFiles) {
                const label = file.file_label === 'recorrido' ? 'Video de recorrido' : file.file_label === 'scanner' ? 'Video de scanner' : file.original_name
                doc.font(FONT_REGULAR).fontSize(9)
                doc.text(`• ${label}: ${file.s3_path}`, MARGIN + 6, y, { width: CONTENT_W - 12 })
                y = doc.y + 4
            }
        } else {
            doc.font(FONT_ITALIC).fontSize(9).fillColor('#999999')
            doc.text('No se adjuntaron videos', MARGIN + 6, y)
            y = doc.y + 4
            doc.fillColor('#000000')
        }
        y += 10

        // ─── Decisión ───
        y = checkNewPage(doc, y, 80)
        const decisionColor = qa.decision === 'approved' ? '#2E7D32' : qa.decision === 'rejected' ? '#C62828' : '#FF9800'
        const decisionLabel = qa.decision === 'approved' ? 'APROBADO' : qa.decision === 'rejected' ? 'RECHAZADO' : 'PENDIENTE'

        doc.font(FONT_BOLD).fontSize(9).fillColor('#283346')
        doc.text('DECISIÓN:', MARGIN, y)
        y += 14
        doc.fillColor('#000000')
        drawChip(doc, MARGIN, y, decisionLabel, true, decisionColor)
        y += 24

        if (qa.decision === 'rejected' && qa.reject_observations) {
            y = drawFieldBox(doc, MARGIN, y, 'OBSERVACIONES DE RECHAZO', qa.reject_observations, 45)
        }

        // ─── Jefe de taller ───
        if (qa.qa_manager_name) {
            doc.font(FONT_BOLD).fontSize(9).fillColor('#283346')
            doc.text('JEFE DE TALLER:', MARGIN, y)
            y += 14
            doc.font(FONT_REGULAR).fontSize(10).fillColor('#000000')
            doc.text(qa.qa_manager_name, MARGIN, y)
            y += 16
        }

        // ─── Técnico ───
        if (qa.technician_name) {
            doc.font(FONT_BOLD).fontSize(9).fillColor('#283346')
            doc.text('TÉCNICO:', MARGIN, y)
            y += 14
            doc.font(FONT_REGULAR).fontSize(10).fillColor('#000000')
            doc.text(qa.technician_name, MARGIN, y)
            y += 16
        }

        // ─── Firma ───
        if (signatureBuffer) {
            y = checkNewPage(doc, y, 110)
            y += 6
            y = drawSectionHeader(doc, MARGIN, y, 'FIRMA', '▸', SECTION_COLORS.signature)
            doc.image(signatureBuffer, MARGIN, y, { fit: [250, 80] }); y += 82
            doc.moveTo(MARGIN, y).lineTo(MARGIN + 250, y).stroke(); y += 4
            doc.font(FONT_REGULAR).fontSize(9)
            doc.text(qa.qa_manager_name || '', MARGIN, y); y += 12
            doc.fontSize(8).fillColor('#999999')
            doc.text(`Fecha: ${new Date().toLocaleDateString('es-GT')}`, MARGIN, y)
        }

        doc.end()
    })
}

// ═══════════════════════════════════════════════
// PDF Autorización de Servicios (tipo 5)
// Header + info cliente + cotización embebida + firma
// ═══════════════════════════════════════════════

function generateAuthorizationPdf({ order, signatureBuffer, quotationBuffer, quotationType }) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'LETTER', margin: 0 })
        const chunks = []
        doc.on('data', c => chunks.push(c))
        doc.on('end', () => resolve(Buffer.concat(chunks)))
        doc.on('error', reject)

        addHeaderFooter(doc)
        let y = CONTENT_TOP

        const clientName = order.client?.name || 'N/A'
        const clientNit = order.client?.nit || 'N/A'
        const clientPhone = order.client?.phone || 'N/A'
        const vehicleBrand = order.vehicule?.vehicule_brand?.name || ''
        const vehicleLinea = order.vehicule?.linea || ''
        const vehiclePlate = order.vehicule?.plate_id || 'N/A'
        const numberPass = order.number_pass || order.id

        // Title
        doc.font(FONT_BOLD).fontSize(16).fillColor('#283346')
        doc.text('AUTORIZACIÓN DE SERVICIOS', MARGIN, y, { width: CONTENT_W, align: 'center' })
        y += 22
        doc.font(FONT_REGULAR).fontSize(8).fillColor('#999999')
        doc.text('GRUPO KOREA AUTOS', MARGIN, y, { width: CONTENT_W, align: 'center' })
        y += 16
        doc.fillColor('#000000')

        // Info box
        const boxH = 32
        doc.rect(MARGIN, y, CONTENT_W, boxH).lineWidth(0.5).stroke('#CCCCCC')
        doc.font(FONT_REGULAR).fontSize(9)
        doc.text(`Cliente: ${clientName}`, MARGIN + 6, y + 5)
        doc.text(`NIT: ${clientNit}`, MARGIN + 220, y + 5)
        doc.text(`Tel: ${clientPhone}`, MARGIN + 350, y + 5)
        doc.text(`Vehículo: ${vehicleBrand} ${vehicleLinea}`, MARGIN + 6, y + 18)
        doc.text(`Placa: ${vehiclePlate}`, MARGIN + 350, y + 18)
        doc.text(`Pase: #${numberPass}`, MARGIN + 440, y + 18)
        y += boxH + 12

        // Authorization text
        doc.font(FONT_REGULAR).fontSize(9).fillColor('#283346')
        doc.text(
            'Por medio de la presente, autorizo a Grupo Korea Autos a realizar los servicios detallados en la cotización adjunta. ' +
            'Acepto los términos, precios y condiciones establecidos.',
            MARGIN, y, { width: CONTENT_W }
        )
        y += 36

        // Quotation section
        y = drawSectionHeader(doc, MARGIN, y, 'COTIZACIÓN ADJUNTA', '▸', '#7B1FA2')

        if (quotationBuffer && quotationType && quotationType.startsWith('image/')) {
            // Embed quotation image
            const imgMaxW = CONTENT_W
            const imgMaxH = 350
            try {
                const img = doc.openImage(quotationBuffer)
                const scale = Math.min(imgMaxW / img.width, imgMaxH / img.height, 1)
                const imgW = img.width * scale
                const imgH = img.height * scale

                y = checkNewPage(doc, y, imgH + 20)
                doc.image(quotationBuffer, MARGIN, y, { width: imgW, height: imgH })
                y += imgH + 12
            } catch (e) {
                doc.font(FONT_ITALIC).fontSize(9).fillColor('#999999')
                doc.text('No se pudo cargar la imagen de cotización.', MARGIN, y)
                y += 16
            }
        } else if (quotationBuffer) {
            doc.font(FONT_REGULAR).fontSize(9).fillColor('#666666')
            doc.text('Cotización adjunta en formato PDF (ver documento enviado por WhatsApp).', MARGIN, y)
            y += 16
        } else {
            doc.font(FONT_ITALIC).fontSize(9).fillColor('#999999')
            doc.text('No se adjuntó cotización.', MARGIN, y)
            y += 16
        }

        y += 8

        // Date
        doc.font(FONT_REGULAR).fontSize(9).fillColor('#283346')
        doc.text(`Fecha de autorización: ${new Date().toLocaleDateString('es-GT')}`, MARGIN, y)
        y += 20

        // Signature
        y = checkNewPage(doc, y, 100)
        y = drawSectionHeader(doc, MARGIN, y, 'FIRMA DEL CLIENTE', '▸', '#2E7D32')

        if (signatureBuffer) {
            try {
                doc.image(signatureBuffer, MARGIN, y, { width: 200, height: 80 })
                y += 85
            } catch (e) {
                doc.font(FONT_ITALIC).fontSize(9).fillColor('#999999')
                doc.text('Firma no disponible', MARGIN, y)
                y += 14
            }
        }

        doc.moveTo(MARGIN, y).lineTo(MARGIN + 250, y).lineWidth(0.5).stroke('#283346')
        y += 4
        doc.font(FONT_REGULAR).fontSize(8).fillColor('#666666')
        doc.text(clientName, MARGIN, y)
        y += 10
        doc.text(`NIT: ${clientNit}`, MARGIN, y)

        doc.end()
    })
}

module.exports = { generateCommentsPdf, generateTermsPdf, generateChecklistPdf, generateReceptionUnifiedPdf, generateQAPdf, generateAuthorizationPdf }
