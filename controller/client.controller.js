const clientRepository = require('../repository/ClientRepository')

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

exports.createClient = async (req, res, next) => {
    try{
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
