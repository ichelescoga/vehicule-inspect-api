const qaRepository = require('../repository/QARepository')
const s3Service = require('../services/s3Service')
const waNotifier = require('../services/whatsappNotifier')
const sequelize = require('../components/conn_sqlz')
const initModels = require('../src/modelKorea/init-models')
const models = initModels(sequelize)
const { generateQAPdf } = require('../services/pdfGenerator')

exports.createOrderQA = async (req, res, next) => {
    try {
        const params = {
            order_id: req.body.order_id,
            tech_comments: req.body.tech_comments,
            client_comments: req.body.client_comments,
            qa_manager_name: req.body.qa_manager_name,
            technician_name: req.body.technician_name,
        }
        const result = await qaRepository.createQA(params)
        res.json({ success: true, payload: result })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.getOrderQA = async (req, res, next) => {
    try {
        const result = await qaRepository.getQAByOrderId(req.params.orderId)
        res.json({ success: true, payload: result })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.updateOrderQA = async (req, res, next) => {
    try {
        const result = await qaRepository.updateQA(req.params.id, req.body)
        res.json({ success: true, payload: result })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.uploadQAFile = async (req, res, next) => {
    try {
        const { order_id, qa_id, file_label } = req.body
        const file = req.file

        const s3Result = await s3Service.uploadFile(file.buffer, file.originalname, file.mimetype, order_id)

        const qaFile = await models.QA_File.create({
            order_id: parseInt(order_id),
            qa_id: parseInt(qa_id),
            file_label: file_label || null,
            original_name: s3Result.originalName,
            stored_name: s3Result.storedName,
            file_type: file.mimetype,
            s3_path: s3Result.s3Path,
            create_date: new Date(),
            status: 1
        })

        res.json({ success: true, payload: qaFile })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.getQAFiles = async (req, res, next) => {
    try {
        const result = await qaRepository.getQAFiles(req.params.orderId)
        res.json({ success: true, payload: result })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.deleteQAFile = async (req, res, next) => {
    try {
        const result = await qaRepository.deleteQAFile(req.params.id)
        res.json({ success: true, payload: result })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.approveQA = async (req, res, next) => {
    try {
        const orderId = parseInt(req.params.orderId)
        const qa = await qaRepository.getQAByOrderId(orderId)
        if (!qa) return res.json({ success: false, payload: 'No QA record found' })

        // Upload signature if provided
        let signaturePath = qa.signature_s3_path
        if (req.file) {
            const s3Result = await s3Service.uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype, orderId)
            signaturePath = s3Result.s3Path
        }

        await qaRepository.updateQA(qa.id, {
            ...qa.toJSON(),
            decision: 'approved',
            signature_s3_path: signaturePath,
        })

        // Advance order to stage 9 (Cierre de Proceso)
        const order = await models.Order_Header.findByPk(orderId)
        if (order && order.status === 8) {
            // Close current status log
            await models.Order_Status_Log.update(
                { end_date: new Date() },
                { where: { order_id: orderId, status: 8, end_date: null } }
            )
            // Create new status log
            await models.Order_Status_Log.create({
                order_id: orderId, status: 9,
                start_date: new Date(), create_date: new Date(),
                description: 'Aprobado por Control de Calidad'
            })
            await models.Order_Header.update({ status: 9, update_date: new Date() }, { where: { id: orderId } })

            // WhatsApp notification (non-blocking)
            const orderRepository = require('../repository/OrderRepository')
            orderRepository.getOrderById(orderId).then(fullOrder => {
                if (fullOrder) {
                    waNotifier.notifyVehicleExit(fullOrder, fullOrder.client, fullOrder.vehicule)
                        .catch(err => console.error('[WA] notifyVehicleExit QA error:', err.message))
                }
            }).catch(() => {})
        }

        res.json({ success: true, payload: 'QA approved, order advanced to stage 9' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.rejectQA = async (req, res, next) => {
    try {
        const orderId = parseInt(req.params.orderId)
        const { reject_observations } = req.body
        const qa = await qaRepository.getQAByOrderId(orderId)
        if (!qa) return res.json({ success: false, payload: 'No QA record found' })

        // Upload signature if provided
        let signaturePath = qa.signature_s3_path
        if (req.file) {
            const s3Result = await s3Service.uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype, orderId)
            signaturePath = s3Result.s3Path
        }

        await qaRepository.updateQA(qa.id, {
            ...qa.toJSON(),
            decision: 'rejected',
            reject_observations: reject_observations,
            signature_s3_path: signaturePath,
        })

        // Return order to stage 5 (Inicio de Proceso) with new cycle
        const order = await models.Order_Header.findByPk(orderId)
        if (order) {
            // Get current max cycle for this order
            const maxCycleResult = await models.Order_Status_Log.max('cycle', { where: { order_id: orderId } })
            const newCycle = (maxCycleResult || 1) + 1

            // Close current status log
            await models.Order_Status_Log.update(
                { end_date: new Date(), description: `Rechazado QA: ${reject_observations}` },
                { where: { order_id: orderId, status: order.status, end_date: null } }
            )
            // Create new status log at stage 5 with incremented cycle
            await models.Order_Status_Log.create({
                order_id: orderId, status: 5,
                start_date: new Date(), create_date: new Date(),
                description: `Regresado desde QA: ${reject_observations}`,
                cycle: newCycle
            })
            await models.Order_Header.update({ status: 5, update_date: new Date() }, { where: { id: orderId } })

            // WhatsApp notification (non-blocking)
            const orderRepository = require('../repository/OrderRepository')
            orderRepository.getOrderById(orderId).then(fullOrder => {
                if (fullOrder) {
                    const plate = fullOrder.vehicule?.plate_id || "Sin placa"
                    const clientName = fullOrder.client?.name || "Sin cliente"
                    const gtmNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Guatemala' }))
                    const fecha = `${gtmNow.getDate().toString().padStart(2,'0')}/${(gtmNow.getMonth()+1).toString().padStart(2,'0')}/${gtmNow.getFullYear()}`
                    const h = gtmNow.getHours(), m = gtmNow.getMinutes(), ampm = h >= 12 ? 'PM' : 'AM'
                    const hora = `${h % 12 || 12}:${m.toString().padStart(2,'0')} ${ampm}`
                    const msg = `⚠️ *QA RECHAZADO*\n\n` +
                        `📋 Orden: #${fullOrder.number_pass || orderId}\n` +
                        `👤 Cliente: ${clientName}\n` +
                        `🔢 Placa: ${plate}\n` +
                        `🔄 Regresado a: Inicio de Proceso (ciclo ${newCycle})\n` +
                        `📝 Motivo: ${reject_observations || 'Sin observaciones'}\n` +
                        `📅 Fecha: ${fecha}\n` +
                        `⏰ Hora: ${hora}`
                    waNotifier.notifyAll(msg)
                        .catch(err => console.error('[WA] notifyQAReject error:', err.message))
                }
            }).catch(() => {})
        }

        res.json({ success: true, payload: 'QA rejected, order returned to stage 5' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.generateQAPdf = async (req, res, next) => {
    try {
        const orderId = parseInt(req.params.orderId)

        const order = await models.Order_Header.findOne({
            where: { id: orderId },
            include: [
                { model: models.Client, as: 'client' },
                { model: models.Vehicle, as: 'vehicule', include: [{ model: models.Vehicle_Brand, as: 'vehicule_brand' }] },
                { model: models.Technical, as: 'technical' },
            ]
        })
        if (!order) return res.json({ success: false, payload: 'Orden no encontrada' })

        const qa = await qaRepository.getQAByOrderId(orderId)
        if (!qa) return res.json({ success: false, payload: 'No QA record found' })

        // Load signature
        let signatureBuffer = null
        if (qa.signature_s3_path) {
            try {
                const https = require('https')
                signatureBuffer = await new Promise((resolve, reject) => {
                    https.get(qa.signature_s3_path, (response) => {
                        const chunks = []
                        response.on('data', c => chunks.push(c))
                        response.on('end', () => resolve(Buffer.concat(chunks)))
                        response.on('error', reject)
                    }).on('error', reject)
                })
            } catch (e) { console.log('Could not load QA signature:', e.message) }
        }

        const qaFiles = await qaRepository.getQAFiles(orderId)

        // Soft-delete existing QA PDF (type 10)
        await models.Order_Document.update(
            { status: 0 },
            { where: { order_id: orderId, document_type_id: 10, status: 1 } }
        )

        const pdfBuffer = await generateQAPdf({
            order: order.toJSON(),
            qa: qa.toJSON(),
            qaFiles: qaFiles.map(f => f.toJSON()),
            signatureBuffer
        })

        const s3Result = await s3Service.uploadFile(pdfBuffer, `control_calidad_${orderId}.pdf`, 'application/pdf', orderId)

        const doc = await models.Order_Document.create({
            order_id: orderId, document_type_id: 10,
            original_name: s3Result.originalName, stored_name: s3Result.storedName,
            file_type: 'application/pdf', s3_path: s3Result.s3Path, create_date: new Date()
        })

        res.json({ success: true, payload: doc })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}
