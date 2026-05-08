const s3Service = require('../services/s3Service')
const crypto = require('crypto')
const sequelize = require('../components/conn_sqlz');
const initModels = require("../src/modelKorea/init-models");
const models = initModels(sequelize);
const { generateCommentsPdf, generateTermsPdf, generateChecklistPdf } = require('../services/pdfGenerator');

// ─── ORDER DOCUMENT ───

exports.uploadOrderDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            res.json({ success: false, payload: 'No se recibio archivo' })
            return
        }

        const orderId = parseInt(req.body.order_id)
        const documentTypeId = parseInt(req.body.document_type_id)

        if (!orderId || !documentTypeId) {
            res.json({ success: false, payload: 'order_id y document_type_id son requeridos' })
            return
        }

        const s3Result = await s3Service.uploadFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            orderId
        )

        const record = await models.Order_Document.create({
            order_id: orderId,
            document_type_id: documentTypeId,
            original_name: s3Result.originalName,
            stored_name: s3Result.storedName,
            file_type: s3Result.fileType,
            s3_path: s3Result.s3Path,
            create_date: new Date()
        })

        res.json({ success: true, payload: record })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.getOrderDocuments = async (req, res, next) => {
    try {
        const where = { order_id: req.params.orderId, status: 1 }

        if (req.query.type) {
            where.document_type_id = parseInt(req.query.type)
        }

        const result = await models.Order_Document.findAll({
            where,
            include: [
                { model: models.Order_Document_Type, as: 'document_type' }
            ],
            order: [['create_date', 'DESC']]
        })
        res.json({ success: true, payload: result })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.deleteOrderDocument = async (req, res, next) => {
    try {
        const result = await models.Order_Document.update(
            { status: 0 },
            { where: { id: req.params.id } }
        )
        res.json({ success: true, payload: result })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.getDocumentTypes = async (req, res, next) => {
    try {
        const result = await models.Order_Document_Type.findAll({
            where: { status: 1 },
            order: [['id', 'ASC']]
        })
        res.json({ success: true, payload: result })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

// ─── ORDER COMMENT ───

exports.createOrderComment = async (req, res, next) => {
    try {
        const record = await models.Order_Comment.create({
            order_id: req.body.order_id,
            main_symptom: req.body.main_symptom,
            when_cold: req.body.when_cold ? 1 : 0,
            when_hot: req.body.when_hot ? 1 : 0,
            when_running: req.body.when_running ? 1 : 0,
            when_idle: req.body.when_idle ? 1 : 0,
            when_intermittent: req.body.when_intermittent ? 1 : 0,
            since_when: req.body.since_when,
            previously_repaired: req.body.previously_repaired ? 1 : 0,
            repair_detail: req.body.repair_detail,
            dashboard_light: req.body.dashboard_light ? 1 : 0,
            dashboard_light_which: req.body.dashboard_light_which,
            urgency_level: req.body.urgency_level || 'BAJO',
            create_date: new Date()
        })
        res.json({ success: true, payload: record })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.getOrderComment = async (req, res, next) => {
    try {
        const result = await models.Order_Comment.findOne({
            where: { order_id: req.params.orderId, status: 1 },
            order: [['create_date', 'DESC']]
        })
        res.json({ success: true, payload: result })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.updateOrderComment = async (req, res, next) => {
    try {
        const result = await models.Order_Comment.update({
            main_symptom: req.body.main_symptom,
            when_cold: req.body.when_cold ? 1 : 0,
            when_hot: req.body.when_hot ? 1 : 0,
            when_running: req.body.when_running ? 1 : 0,
            when_idle: req.body.when_idle ? 1 : 0,
            when_intermittent: req.body.when_intermittent ? 1 : 0,
            since_when: req.body.since_when,
            previously_repaired: req.body.previously_repaired ? 1 : 0,
            repair_detail: req.body.repair_detail,
            dashboard_light: req.body.dashboard_light ? 1 : 0,
            dashboard_light_which: req.body.dashboard_light_which,
            urgency_level: req.body.urgency_level || 'BAJO',
        }, { where: { id: req.params.id } })
        res.json({ success: true, payload: result })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

// ─── PDF GENERATION ───

exports.generateReceptionPdfs = async (req, res, next) => {
    try {
        const orderId = parseInt(req.params.orderId)

        const order = await models.Order_Header.findOne({
            where: { id: orderId },
            include: [
                { model: models.Client, as: 'client' },
                { model: models.Vehicle, as: 'vehicule', include: [{ model: models.Vehicle_Brand, as: 'vehicule_brand' }] },
            ]
        })

        if (!order) {
            return res.json({ success: false, payload: 'Orden no encontrada' })
        }

        const comment = await models.Order_Comment.findOne({
            where: { order_id: orderId, status: 1 },
            order: [['create_date', 'DESC']]
        })

        if (!comment) {
            return res.json({ success: false, payload: 'No hay comentarios registrados para esta orden' })
        }

        // Load signature image from S3 (type 2)
        let signatureBuffer = null
        const sigDoc = await models.Order_Document.findOne({
            where: { order_id: orderId, document_type_id: 2, status: 1 },
            order: [['create_date', 'DESC']]
        })
        if (sigDoc) {
            try {
                const fetch = require('https')
                signatureBuffer = await new Promise((resolve, reject) => {
                    fetch.get(sigDoc.s3_path, (response) => {
                        const chunks = []
                        response.on('data', c => chunks.push(c))
                        response.on('end', () => resolve(Buffer.concat(chunks)))
                        response.on('error', reject)
                    }).on('error', reject)
                })
            } catch (e) {
                console.log('Could not load signature:', e.message)
            }
        }

        // Soft-delete existing PDFs (types 3, 4)
        await models.Order_Document.update(
            { status: 0 },
            { where: { order_id: orderId, document_type_id: [3, 4], status: 1 } }
        )

        const orderData = order.toJSON()
        const commentData = comment.toJSON()

        const [commentsPdf, termsPdf] = await Promise.all([
            generateCommentsPdf({ order: orderData, comment: commentData, signatureBuffer }),
            generateTermsPdf({ order: orderData, signatureBuffer }),
        ])

        const [commentsS3, termsS3] = await Promise.all([
            s3Service.uploadFile(commentsPdf, `comentarios_cliente_${orderId}.pdf`, 'application/pdf', orderId),
            s3Service.uploadFile(termsPdf, `terminos_condiciones_${orderId}.pdf`, 'application/pdf', orderId),
        ])

        const [commentsDoc, termsDoc] = await Promise.all([
            models.Order_Document.create({
                order_id: orderId, document_type_id: 3,
                original_name: commentsS3.originalName, stored_name: commentsS3.storedName,
                file_type: 'application/pdf', s3_path: commentsS3.s3Path, create_date: new Date()
            }),
            models.Order_Document.create({
                order_id: orderId, document_type_id: 4,
                original_name: termsS3.originalName, stored_name: termsS3.storedName,
                file_type: 'application/pdf', s3_path: termsS3.s3Path, create_date: new Date()
            }),
        ])

        res.json({ success: true, payload: { comments: commentsDoc, terms: termsDoc } })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

// ─── REMOTE SIGNATURE ───

exports.generateSignatureToken = async (req, res, next) => {
    try {
        const orderId = parseInt(req.params.orderId)
        const order = await models.Order_Header.findByPk(orderId)
        if (!order) return res.json({ success: false, payload: 'Orden no encontrada' })

        // Invalidate previous tokens for this order
        await models.Signature_Token.update(
            { status: 0 },
            { where: { order_id: orderId, status: 1 } }
        )

        // Generate random token
        const token = crypto.randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours

        const record = await models.Signature_Token.create({
            order_id: orderId,
            token: token,
            expires_at: expiresAt,
            create_date: new Date()
        })

        res.json({ success: true, payload: { token: record.token, expires_at: record.expires_at } })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

// PUBLIC — no auth required
exports.getSignatureData = async (req, res, next) => {
    try {
        const token = req.params.token

        const sigToken = await models.Signature_Token.findOne({
            where: { token, status: 1 }
        })

        if (!sigToken) return res.json({ success: false, payload: 'Token invalido o expirado' })
        if (new Date() > new Date(sigToken.expires_at)) return res.json({ success: false, payload: 'El link ha expirado. Solicite uno nuevo.' })
        if (sigToken.signed_at) return res.json({ success: false, payload: 'Este documento ya fue firmado.' })

        // Load order with quotation items
        const order = await models.Order_Header.findOne({
            where: { id: sigToken.order_id },
            include: [
                { model: models.Client, as: 'client' },
                { model: models.Vehicle, as: 'vehicule', include: [{ model: models.Vehicle_Brand, as: 'vehicule_brand' }] },
                { model: models.Vendor, as: 'vendor' },
                { model: models.Technical, as: 'technical' },
            ]
        })

        // Load quotation items
        const items = await models.Service_Option_Assign.findAll({
            where: { order_id: sigToken.order_id },
            include: [
                { model: models.Service_Option, as: 'service_option',
                  include: [{ model: models.Service, as: 'service',
                    include: [{ model: models.Service_Type, as: 'service_type' }]
                  }]
                }
            ]
        })

        res.json({
            success: true,
            payload: {
                order: order,
                items: items,
                expires_at: sigToken.expires_at,
            }
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

// PUBLIC — no auth required
exports.submitRemoteSignature = async (req, res, next) => {
    try {
        const token = req.params.token

        const sigToken = await models.Signature_Token.findOne({
            where: { token, status: 1 }
        })

        if (!sigToken) return res.json({ success: false, payload: 'Token invalido o expirado' })
        if (new Date() > new Date(sigToken.expires_at)) return res.json({ success: false, payload: 'El link ha expirado.' })
        if (sigToken.signed_at) return res.json({ success: false, payload: 'Ya fue firmado.' })

        if (!req.file) return res.json({ success: false, payload: 'No se recibio la firma' })

        // Upload signature to S3
        const s3Result = await s3Service.uploadFile(
            req.file.buffer,
            `firma_autorizacion_${sigToken.order_id}.png`,
            'image/png',
            sigToken.order_id
        )

        // Save as Order_Document (type 1 = signature_authorization)
        await models.Order_Document.create({
            order_id: sigToken.order_id,
            document_type_id: 1,
            original_name: s3Result.originalName,
            stored_name: s3Result.storedName,
            file_type: 'image/png',
            s3_path: s3Result.s3Path,
            create_date: new Date()
        })

        // Mark token as signed
        await models.Signature_Token.update(
            { signed_at: new Date() },
            { where: { id: sigToken.id } }
        )

        // Advance order to status 4 (Autorizacion) if currently at 3
        const order = await models.Order_Header.findByPk(sigToken.order_id)
        if (order && order.status === 3) {
            const now = new Date()
            await models.Order_Status_Log.update(
                { end_date: now, description: 'Autorizado por el cliente con firma remota' },
                { where: { order_id: sigToken.order_id, end_date: null } }
            )
            await models.Order_Status_Log.create({
                order_id: sigToken.order_id,
                status: 4,
                start_date: now,
                create_date: now
            })
            await models.Order_Header.update(
                { status: 4, update_date: now },
                { where: { id: sigToken.order_id } }
            )
        }

        res.json({ success: true, payload: 'Firma registrada exitosamente' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

// ─── ORDER CHECKLIST ───

exports.createOrderChecklist = async (req, res, next) => {
    try {
        const record = await models.Order_Checklist.create({
            order_id: req.body.order_id,
            // Niveles generales
            oil_motor: req.body.oil_motor,
            oil_gearbox: req.body.oil_gearbox,
            oil_mechanical: req.body.oil_mechanical,
            oil_steering: req.body.oil_steering,
            oil_differential: req.body.oil_differential,
            coolant: req.body.coolant,
            windshield_fluid: req.body.windshield_fluid,
            brake_fluid: req.body.brake_fluid,
            car_wash: req.body.car_wash,
            // Aros y neumaticos
            bolts: req.body.bolts,
            studs: req.body.studs,
            bolts_torqued: req.body.bolts_torqued,
            rim_caps: req.body.rim_caps,
            rim_condition: req.body.rim_condition,
            tire_condition: req.body.tire_condition,
            spare_tire: req.body.spare_tire,
            tools: req.body.tools,
            // Accesorios y testigos
            check_engine: req.body.check_engine,
            abs_light: req.body.abs_light,
            airbag_light: req.body.airbag_light,
            tpms_light: req.body.tpms_light,
            anti_skid: req.body.anti_skid,
            other_lights: req.body.other_lights,
            other_lights_detail: req.body.other_lights_detail,
            // Confirmacion
            spare_parts_delivered: req.body.spare_parts_delivered ? 1 : 0,
            // Datos adicionales
            invoice_number: req.body.invoice_number,
            delivery_time: req.body.delivery_time,
            observations: req.body.observations,
            create_date: new Date()
        })
        res.json({ success: true, payload: record })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.getOrderChecklist = async (req, res, next) => {
    try {
        const result = await models.Order_Checklist.findOne({
            where: { order_id: req.params.orderId, status: 1 },
            order: [['create_date', 'DESC']]
        })
        res.json({ success: true, payload: result })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.updateOrderChecklist = async (req, res, next) => {
    try {
        const result = await models.Order_Checklist.update({
            oil_motor: req.body.oil_motor,
            oil_gearbox: req.body.oil_gearbox,
            oil_mechanical: req.body.oil_mechanical,
            oil_steering: req.body.oil_steering,
            oil_differential: req.body.oil_differential,
            coolant: req.body.coolant,
            windshield_fluid: req.body.windshield_fluid,
            brake_fluid: req.body.brake_fluid,
            car_wash: req.body.car_wash,
            bolts: req.body.bolts,
            studs: req.body.studs,
            bolts_torqued: req.body.bolts_torqued,
            rim_caps: req.body.rim_caps,
            rim_condition: req.body.rim_condition,
            tire_condition: req.body.tire_condition,
            spare_tire: req.body.spare_tire,
            tools: req.body.tools,
            check_engine: req.body.check_engine,
            abs_light: req.body.abs_light,
            airbag_light: req.body.airbag_light,
            tpms_light: req.body.tpms_light,
            anti_skid: req.body.anti_skid,
            other_lights: req.body.other_lights,
            other_lights_detail: req.body.other_lights_detail,
            spare_parts_delivered: req.body.spare_parts_delivered ? 1 : 0,
            invoice_number: req.body.invoice_number,
            delivery_time: req.body.delivery_time,
            observations: req.body.observations,
        }, { where: { id: req.params.id } })
        res.json({ success: true, payload: result })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

// ─── CHECKLIST PDF GENERATION ───

exports.generateChecklistPdf = async (req, res, next) => {
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

        if (!order) {
            return res.json({ success: false, payload: 'Orden no encontrada' })
        }

        const checklist = await models.Order_Checklist.findOne({
            where: { order_id: orderId, status: 1 },
            order: [['create_date', 'DESC']]
        })

        if (!checklist) {
            return res.json({ success: false, payload: 'No hay checklist registrado para esta orden' })
        }

        // Load delivery signature (document_type_id 6)
        let signatureBuffer = null
        const sigDoc = await models.Order_Document.findOne({
            where: { order_id: orderId, document_type_id: 6, status: 1 },
            order: [['create_date', 'DESC']]
        })
        if (sigDoc) {
            try {
                const fetch = require('https')
                signatureBuffer = await new Promise((resolve, reject) => {
                    fetch.get(sigDoc.s3_path, (response) => {
                        const chunks = []
                        response.on('data', c => chunks.push(c))
                        response.on('end', () => resolve(Buffer.concat(chunks)))
                        response.on('error', reject)
                    }).on('error', reject)
                })
            } catch (e) {
                console.log('Could not load delivery signature:', e.message)
            }
        }

        // Soft-delete existing checklist PDF (type 5)
        await models.Order_Document.update(
            { status: 0 },
            { where: { order_id: orderId, document_type_id: 5, status: 1 } }
        )

        const orderData = order.toJSON()
        const checklistData = checklist.toJSON()

        const checklistPdf = await generateChecklistPdf({ order: orderData, checklist: checklistData, signatureBuffer })

        const s3Result = await s3Service.uploadFile(checklistPdf, `checklist_salida_${orderId}.pdf`, 'application/pdf', orderId)

        const doc = await models.Order_Document.create({
            order_id: orderId, document_type_id: 5,
            original_name: s3Result.originalName, stored_name: s3Result.storedName,
            file_type: 'application/pdf', s3_path: s3Result.s3Path, create_date: new Date()
        })

        res.json({ success: true, payload: doc })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}
