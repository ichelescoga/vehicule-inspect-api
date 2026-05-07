const s3Service = require('../services/s3Service')
const sequelize = require('../components/conn_sqlz');
const initModels = require("../src/modelKorea/init-models");
const models = initModels(sequelize);
const { generateCommentsPdf, generateTermsPdf } = require('../services/pdfGenerator');

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
