const clientRepository = require('../repository/ClientRepository')
const { validateNIT } = require('../src/utils/validators')

exports.getAllClients = async (req, res, next) => {
    try{
        let result = await clientRepository.getAllClients()
        console.log(result)
        if (!result) {
            console.info("Clients were empty")
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

exports.searchClientByNit = async (req, res, next) => {
    try{
        let result = await clientRepository.searchClientByNit(req.params.nit)
        console.log(result)
        if (!result) {
            console.info("No clients found by NIT")
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

exports.searchClientByName = async (req, res, next) => {
    try{
        let result = await clientRepository.searchClientByName(req.params.name)
        console.log(result)
        if (!result) {
            console.info("No clients found by name")
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

exports.updateClient = async (req, res, next) => {
    try{
        if (req.body.nit) {
            const nitValidation = validateNIT(req.body.nit)
            if (!nitValidation.valid) {
                res.json({ success: false, payload: nitValidation.message })
                return
            }
        }

        let params = {
            name: req.body.name,
            address: req.body.address,
            bill_name: req.body.bill_name,
            nit: req.body.nit,
            email: req.body.email,
            office_cel: req.body.office_cel,
            residence_cel: req.body.residence_cel
        }
        let result = await clientRepository.updateClient(req.params.id, params)
        console.log(result)
        if (!result) {
            console.info("Client was not updated")
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

exports.createClient = async (req, res, next) => {
    try{
        if (req.body.nit) {
            const nitValidation = validateNIT(req.body.nit)
            if (!nitValidation.valid) {
                res.json({ success: false, payload: nitValidation.message })
                return
            }
        }

        let params = {
            name: req.body.name,
            address: req.body.address,
            bill_name: req.body.bill_name,
            nit: req.body.nit,
            email: req.body.email,
            office_cel: req.body.office_cel,
            residence_cel: req.body.residence_cel
        }
        let result = await clientRepository.createClient(params)
        console.log(result)
        if (!result) {
            console.info("Client was not created")
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
