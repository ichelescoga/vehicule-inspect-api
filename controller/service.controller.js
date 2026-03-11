const serviceRepository = require('../repository/ServiceRepository')

exports.getAllServices = async (req, res, next) => {
    try{
        let result = await serviceRepository.getAllServices()
        console.log(result)
        if (!result) {
            console.info("Services were empty")
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
