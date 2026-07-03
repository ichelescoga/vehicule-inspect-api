const vehicleRepository = require('../repository/VehicleRepository')
const { validatePlate } = require('../src/utils/validators')
const sequelize = require('../components/conn_sqlz')
const initModels = require("../src/modelKorea/init-models")
const { Op } = require('sequelize')
const models = initModels(sequelize)

exports.getAllVehiculeBrands = async (req, res, next) => {
    try{
        let result = await vehicleRepository.getAllVehiculeBrands()
        console.log(result)
        if (!result) {
            console.info("Vehicule brands were empty")
            res.json({
                success: false,
                payload: result
            })
            return
        }

        res.json({
            success: true,
            payload: result
        })
    }
    catch(error){
        console.log(error)
        console.info(error)
        res.json({
            success: false,
            payload: error
        })
        return
    }
}

exports.getAllVehiculeType = async (req, res, next) => {
    try{
        let result = await vehicleRepository.getAllVehiculeType()
        console.log(result)
        if (!result) {
            console.info("Vehicule Types were empty")
            res.json({
                success: false,
                payload: result
            })
            return
        }

        res.json({
            success: true,
            payload: result
        })
    }
    catch(error){
        console.log(error)
        console.info(error)
        res.json({
            success: false,
            payload: error
        })
        return
    }
}

exports.createVehicle = async (req, res, next) => {
    try{
        const plateValidation = validatePlate(req.body.plate_id)
        if (!plateValidation.valid) {
            res.json({ success: false, payload: plateValidation.message })
            return
        }

        let params = {
            model: req.body.model,
            linea: req.body.linea,
            plate_id: req.body.plate_id,
            color: req.body.color,
            vehicule_type_id: req.body.vehicule_type_id,
            vehicule_brand_id: req.body.vehicule_brand_id,
            vehicle_line_id: req.body.vehicle_line_id || null,
            transmision_type: req.body.transmision_type
        }
        let result = await vehicleRepository.createVehicle(params, req.companyId)
        console.log(result)
        if (!result) {
            console.info("Vehicle was not created")
            res.json({
                success: false,
                payload: result
            })
            return
        }

        res.json({
            success: true,
            payload: result
        })
    }
    catch(error){
        console.log(error)
        console.info(error)
        res.json({
            success: false,
            payload: error
        })
        return
    }
}

exports.getAllVehicleParts = async (req, res, next) => {
    try{
        let result = await vehicleRepository.getAllVehicleParts(req.companyId)
        console.log(result)
        if (!result) {
            console.info("Vehicle Parts were empty")
            res.json({
                success: false,
                payload: result
            })
            return
        }

        res.json({
            success: true,
            payload: result
        })
    }
    catch(error){
        console.log(error)
        console.info(error)
        res.json({
            success: false,
            payload: error
        })
        return
    }
}

exports.getAllVehicles = async (req, res, next) => {
    try{
        const includeInactive = req.query.includeInactive === 'true'
        let result = await vehicleRepository.getAllVehicles(req.companyId, includeInactive)
        console.log(result)
        if (!result) {
            console.info("Vehicles were empty")
            res.json({
                success: false,
                payload: result
            })
            return
        }

        res.json({
            success: true,
            payload: result
        })
    }
    catch(error){
        console.log(error)
        console.info(error)
        res.json({
            success: false,
            payload: error
        })
        return
    }
}

exports.searchVehicleByPlate = async (req, res, next) => {
    try{
        let result = await vehicleRepository.searchVehicleByPlate(req.params.plate, req.companyId)
        console.log(result)
        if (!result) {
            console.info("Vehicles not found")
            res.json({
                success: false,
                payload: result
            })
            return
        }

        res.json({
            success: true,
            payload: result
        })
    }
    catch(error){
        console.log(error)
        console.info(error)
        res.json({
            success: false,
            payload: error
        })
        return
    }
}

exports.updateVehicle = async (req, res, next) => {
    try{
        if (req.body.plate_id) {
            const plateValidation = validatePlate(req.body.plate_id)
            if (!plateValidation.valid) {
                res.json({ success: false, payload: plateValidation.message })
                return
            }
        }

        let params = {
            model: req.body.model,
            linea: req.body.linea,
            plate_id: req.body.plate_id,
            color: req.body.color,
            vehicule_type_id: req.body.vehicule_type_id,
            vehicule_brand_id: req.body.vehicule_brand_id,
            vehicle_line_id: req.body.vehicle_line_id,
            transmision_type: req.body.transmision_type,
            status: req.body.status
        }
        let result = await vehicleRepository.updateVehicle(req.params.id, params)
        console.log(result)
        if (!result) {
            console.info("Vehicle was not updated")
            res.json({
                success: false,
                payload: result
            })
            return
        }

        res.json({
            success: true,
            payload: result
        })
    }
    catch(error){
        console.log(error)
        console.info(error)
        res.json({
            success: false,
            payload: error
        })
        return
    }
}

exports.createVehiculeBrand = async (req, res, next) => {
    try{
        let params = {
            name: req.body.name
        }
        let result = await vehicleRepository.createVehiculeBrand(params)
        console.log(result)
        if (!result) {
            console.info("Vehicule Brand was not created")
            res.json({
                success: false,
                payload: result
            })
            return
        }

        res.json({
            success: true,
            payload: result
        })
    }
    catch(error){
        console.log(error)
        console.info(error)
        res.json({
            success: false,
            payload: error
        })
        return
    }
}

exports.searchVehicleParts = async (req, res, next) => {
    try{
        let result = await vehicleRepository.searchVehicleParts(req.params.name, req.companyId)
        console.log(result)
        if (!result) {
            console.info("Vehicle Parts not found")
            res.json({
                success: false,
                payload: result
            })
            return
        }

        res.json({
            success: true,
            payload: result
        })
    }
    catch(error){
        console.log(error)
        console.info(error)
        res.json({
            success: false,
            payload: error
        })
        return
    }
}

exports.createVehiclePart = async (req, res, next) => {
    try{
        let params = {
            name: req.body.name
        }
        let result = await vehicleRepository.createVehiclePart(params, req.companyId)
        console.log(result)
        if (!result) {
            console.info("Vehicle Part was not created")
            res.json({
                success: false,
                payload: result
            })
            return
        }

        res.json({
            success: true,
            payload: result
        })
    }
    catch(error){
        console.log(error)
        console.info(error)
        res.json({
            success: false,
            payload: error
        })
        return
    }
}

// ─── VEHICLE LINE ───

exports.getLinesByBrand = async (req, res, next) => {
    try {
        const result = await models.Vehicle_Line.findAll({
            where: { vehicle_brand_id: req.params.brandId, status: 1 },
            order: [['name', 'ASC']]
        })
        res.json({ success: true, payload: result })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.searchLines = async (req, res, next) => {
    try {
        const query = req.params.query
        const result = await models.Vehicle_Line.findAll({
            where: {
                name: { [Op.like]: `%${query}%` },
                status: 1
            },
            include: [{ model: models.Vehicle_Brand, as: 'vehicle_brand', attributes: ['id', 'name'] }],
            order: [['name', 'ASC']],
            limit: 20
        })
        res.json({ success: true, payload: result })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.createVehicleLine = async (req, res, next) => {
    try {
        const result = await models.Vehicle_Line.create({
            name: req.body.name,
            vehicle_brand_id: req.body.vehicle_brand_id,
            create_date: new Date()
        })
        res.json({ success: true, payload: result })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.updateVehicleLine = async (req, res, next) => {
    try {
        const result = await models.Vehicle_Line.update({
            name: req.body.name,
            status: req.body.status,
            update_date: new Date()
        }, { where: { id: req.params.id } })
        res.json({ success: true, payload: result })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.updateVehiculeBrand = async (req, res, next) => {
    try {
        const result = await models.Vehicle_Brand.update({
            name: req.body.name,
            status: req.body.status,
            update_date: new Date()
        }, { where: { id: req.params.id } })
        res.json({ success: true, payload: result })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.getAllBrandsWithLines = async (req, res, next) => {
    try {
        const result = await models.Vehicle_Brand.findAll({
            where: { status: 1 },
            include: [{ model: models.Vehicle_Line, as: 'Vehicle_Lines', where: { status: 1 }, required: false }],
            order: [['name', 'ASC'], [{ model: models.Vehicle_Line, as: 'Vehicle_Lines' }, 'name', 'ASC']]
        })
        res.json({ success: true, payload: result })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.createVehiculeType = async (req, res, next) => {
    try{
        let params = {
            name: req.body.name
        }
        let result = await vehicleRepository.createVehiculeType(params)
        console.log(result)
        if (!result) {
            console.info("Vehicule Type was not created")
            res.json({
                success: false,
                payload: result
            })
            return
        }

        res.json({
            success: true,
            payload: result
        })
    }
    catch(error){
        console.log(error)
        console.info(error)
        res.json({
            success: false,
            payload: error
        })
        return
    }
}
