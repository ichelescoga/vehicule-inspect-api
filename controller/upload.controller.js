const s3Service = require('../services/s3Service')
const sequelize = require('../components/conn_sqlz');
const initModels = require("../src/modelKorea/init-models");
const models = initModels(sequelize);

exports.uploadInspectionFile = async (req, res, next) => {
    try {
        if (!req.file) {
            res.json({ success: false, payload: 'No se recibió archivo' })
            return
        }

        const orderId = parseInt(req.body.order_id)
        const vehiculePartId = parseInt(req.body.vehicule_part_id)

        if (!orderId || !vehiculePartId) {
            res.json({ success: false, payload: 'order_id y vehicule_part_id son requeridos' })
            return
        }

        // Upload to S3
        const s3Result = await s3Service.uploadFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            orderId
        )

        // Save record in DB
        const record = await models.Inspection_File.create({
            order_id: orderId,
            vehicule_part_id: vehiculePartId,
            original_name: s3Result.originalName,
            stored_name: s3Result.storedName,
            file_type: s3Result.fileType,
            s3_path: s3Result.s3Path,
            create_date: new Date()
        })

        res.json({
            success: true,
            payload: record
        })
    } catch (error) {
        console.log(error)
        console.info(error)
        res.json({
            success: false,
            payload: error.message || error
        })
        return
    }
}

exports.deleteInspectionFile = async (req, res, next) => {
    try {
        const result = await models.Inspection_File.update(
            { status: 0 },
            { where: { id: req.params.id } }
        )

        res.json({
            success: true,
            payload: result
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            payload: error.message || error
        })
        return
    }
}

exports.uploadSignature = async (req, res, next) => {
    try {
        if (!req.file) {
            res.json({ success: false, payload: 'No se recibió archivo' })
            return
        }

        const orderId = parseInt(req.body.order_id)

        if (!orderId) {
            res.json({ success: false, payload: 'order_id es requerido' })
            return
        }

        // Upload to S3
        const s3Result = await s3Service.uploadFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            orderId
        )

        // Save record in DB
        const record = await models.Order_Signature.create({
            order_id: orderId,
            s3_path: s3Result.s3Path,
            stored_name: s3Result.storedName,
            create_date: new Date()
        })

        res.json({
            success: true,
            payload: record
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            payload: error.message || error
        })
    }
}

exports.getOrderSignature = async (req, res, next) => {
    try {
        const result = await models.Order_Signature.findOne({
            where: { order_id: req.params.orderId, status: 1 },
            order: [['create_date', 'DESC']]
        })

        res.json({
            success: true,
            payload: result
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            payload: error.message || error
        })
    }
}

exports.getInspectionFiles = async (req, res, next) => {
    try {
        const result = await models.Inspection_File.findAll({
            where: { order_id: req.params.orderId, status: 1 },
            include: [
                { model: models.Vehicle_Part, as: 'vehicule_part' }
            ],
            order: [['create_date', 'DESC']]
        })

        res.json({
            success: true,
            payload: result
        })
    } catch (error) {
        console.log(error)
        console.info(error)
        res.json({
            success: false,
            payload: error.message || error
        })
        return
    }
}
