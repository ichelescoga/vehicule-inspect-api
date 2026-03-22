const orderRepository = require('../repository/OrderRepository')

exports.createOrder = async (req, res, next) => {
    try{
        let params = {
            number_pass: req.body.number_pass,
            order_date: req.body.order_date,
            payment_type: req.body.payment_type,
            delivery_date: req.body.delivery_date,
            client_id: req.body.client_id,
            vendor_id: req.body.vendor_id,
            vehicule_id: req.body.vehicule_id,
            technical_id: req.body.technical_id
        }
        let result = await orderRepository.createOrder(params)
        console.log(result)
        if (!result) {
            console.info("Order was not created")
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

exports.getOrderById = async (req, res, next) => {
    try{
        let result = await orderRepository.getOrderById(req.params.id)
        console.log(result)
        if (!result) {
            console.info("Order not found")
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

exports.getAllOrders = async (req, res, next) => {
    try{
        let result = await orderRepository.getAllOrders()
        console.log(result)
        if (!result) {
            console.info("Orders were empty")
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

exports.searchOrders = async (req, res, next) => {
    try{
        let filters = {
            number_pass: req.query.number_pass,
            client_nit: req.query.client_nit,
            client_name: req.query.client_name,
            plate_id: req.query.plate_id,
            vendor_name: req.query.vendor_name,
            technical_name: req.query.technical_name
        }
        let result = await orderRepository.searchOrders(filters)
        console.log(result)
        if (!result) {
            console.info("Orders not found")
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

exports.updateOrder = async (req, res, next) => {
    try{
        let params = {
            number_pass: req.body.number_pass,
            order_date: req.body.order_date,
            payment_type: req.body.payment_type,
            delivery_date: req.body.delivery_date,
            client_id: req.body.client_id,
            vendor_id: req.body.vendor_id,
            vehicule_id: req.body.vehicule_id,
            technical_id: req.body.technical_id
        }
        let result = await orderRepository.updateOrder(req.params.id, params)
        console.log(result)
        if (!result) {
            console.info("Order was not updated")
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

exports.updateOrderStatus = async (req, res, next) => {
    try{
        let result = await orderRepository.updateOrderStatus(req.params.id, req.body.status, req.body.description)
        console.log(result)
        if (!result) {
            console.info("Order status was not updated")
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
            payload: error.message || error
        })
        return
    }
}

exports.getOrderStatusLog = async (req, res, next) => {
    try{
        let result = await orderRepository.getOrderStatusLog(req.params.orderId)
        console.log(result)
        if (!result) {
            console.info("Order Status Log was empty")
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

exports.getOrdersByClient = async (req, res, next) => {
    try{
        let result = await orderRepository.getOrdersByClient(req.params.clientId)
        console.log(result)
        if (!result) {
            console.info("Orders for client were empty")
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

exports.createOrderVehiculePart = async (req, res, next) => {
    try{
        let params = {
            order_id: req.body.order_id,
            vehicule_part_id: req.body.vehicule_part_id,
            url: req.body.url,
            asset_type_id: req.body.asset_type_id
        }
        let result = await orderRepository.createOrderVehiculePart(params)
        console.log(result)
        if (!result) {
            console.info("Order Vehicule Part was not created")
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

exports.createOrderServiceOption = async (req, res, next) => {
    try{
        let params = {
            order_id: req.body.order_id,
            service_option_id: req.body.service_option_id,
            price: req.body.price,
            quantity: req.body.quantity,
            discount: req.body.discount
        }
        let result = await orderRepository.createOrderServiceOption(params)
        console.log(result)
        if (!result) {
            console.info("Service Option was not assigned")
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
