const serviceRepository = require('../repository/ServiceRepository')

// ─── SERVICE TYPE ───

exports.getAllServiceTypes = async (req, res, next) => {
    try {
        let result = await serviceRepository.getAllServiceTypes()
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.createServiceType = async (req, res, next) => {
    try {
        let result = await serviceRepository.createServiceType({ name: req.body.name })
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.updateServiceType = async (req, res, next) => {
    try {
        let result = await serviceRepository.updateServiceType(req.params.id, { name: req.body.name })
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

// ─── SERVICE ───

exports.getAllServices = async (req, res, next) => {
    try {
        let result = await serviceRepository.getAllServices()
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.getServicesByType = async (req, res, next) => {
    try {
        let result = await serviceRepository.getServicesByType(req.params.serviceTypeId)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.createService = async (req, res, next) => {
    try {
        let result = await serviceRepository.createService({
            name: req.body.name,
            service_type_id: req.body.service_type_id
        })
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.updateService = async (req, res, next) => {
    try {
        let result = await serviceRepository.updateService(req.params.id, {
            name: req.body.name,
            service_type_id: req.body.service_type_id
        })
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

// ─── SERVICE OPTION ───

exports.getServiceOptions = async (req, res, next) => {
    try {
        let result = await serviceRepository.getServiceOptions(req.params.serviceId)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.createServiceOption = async (req, res, next) => {
    try {
        let result = await serviceRepository.createServiceOption({
            name: req.body.name,
            service_id: req.body.service_id
        })
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.updateServiceOption = async (req, res, next) => {
    try {
        let result = await serviceRepository.updateServiceOption(req.params.id, {
            name: req.body.name
        })
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

// ─── SERVICE OPTION ASSIGN (Order) ───

exports.getOrderServiceOptions = async (req, res, next) => {
    try {
        let result = await serviceRepository.getOrderServiceOptions(req.params.orderId)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.deleteOrderServiceOption = async (req, res, next) => {
    try {
        let result = await serviceRepository.deleteOrderServiceOption(req.params.id)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.updateOrderServiceOption = async (req, res, next) => {
    try {
        let result = await serviceRepository.updateOrderServiceOption(req.params.id, {
            price: req.body.price,
            quantity: req.body.quantity,
            discount: req.body.discount
        })
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.searchServices = async (req, res, next) => {
    try {
        let result = await serviceRepository.searchServices(req.params.query)
        res.json({ success: true, payload: result })
    } catch(error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}
