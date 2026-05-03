const catalogRepository = require('../repository/CatalogRepository')

exports.getAllVendors = async (req, res, next) => {
    try{
        const includeInactive = req.query.includeInactive === 'true'
        let result = await catalogRepository.getAllVendors(req.companyId, includeInactive)
        console.log(result)
        if (!result) {
            console.info("Vendors were empty")
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

exports.getAllTechnicals = async (req, res, next) => {
    try{
        const includeInactive = req.query.includeInactive === 'true'
        let result = await catalogRepository.getAllTechnicals(req.companyId, includeInactive)
        console.log(result)
        if (!result) {
            console.info("Technicals were empty")
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

exports.createVendor = async (req, res, next) => {
    try{
        let params = {
            name: req.body.name
        }
        let result = await catalogRepository.createVendor(params, req.companyId)
        console.log(result)
        if (!result) {
            console.info("Vendor was not created")
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

exports.updateVendor = async (req, res, next) => {
    try{
        let params = {
            name: req.body.name,
            status: req.body.status
        }
        let result = await catalogRepository.updateVendor(req.params.id, params)
        console.log(result)
        if (!result) {
            console.info("Vendor was not updated")
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

exports.createTechnical = async (req, res, next) => {
    try{
        let params = {
            name: req.body.name
        }
        let result = await catalogRepository.createTechnical(params, req.companyId)
        console.log(result)
        if (!result) {
            console.info("Technical was not created")
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

exports.updateTechnical = async (req, res, next) => {
    try{
        let params = {
            name: req.body.name,
            status: req.body.status
        }
        let result = await catalogRepository.updateTechnical(req.params.id, params)
        console.log(result)
        if (!result) {
            console.info("Technical was not updated")
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
