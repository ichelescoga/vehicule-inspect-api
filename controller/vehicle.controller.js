const vehicleRepository = require('../repository/VehicleRepository')

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
        let params = {
            model: req.body.model,
            plate_id: req.body.plate_id,
            color: req.body.color,
            vehicule_type_id: req.body.vehicule_type_id,
            vehicule_brand_id: req.body.vehicule_brand_id
        }
        let result = await vehicleRepository.createVehicle(params)
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
        let result = await vehicleRepository.getAllVehicleParts()
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
        let result = await vehicleRepository.getAllVehicles()
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
