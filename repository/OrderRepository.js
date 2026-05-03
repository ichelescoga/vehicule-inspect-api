const sequelize = require('../components/conn_sqlz');
const { Op } = require('sequelize');
let initModels = require("../src/modelKorea/init-models");
let models = initModels(sequelize);

let OrderRepository = function(){

    let createOrder = async(params, companyId) => {
        // Auto-generate number_pass: MAX + 1, starting from 1000000001
        const maxResult = await models.Order_Header.max('number_pass', { where: { company_id: companyId } })
        const nextPass = maxResult && maxResult >= 1000000001 ? maxResult + 1 : 1000000001

        const order = await models.Order_Header.create({
            number_pass: nextPass,
            order_date: params.order_date || new Date(),
            payment_type: params.payment_type,
            card_installments: params.card_installments,
            delivery_date: params.delivery_date,
            client_id: params.client_id,
            vendor_id: params.vendor_id,
            vehicule_id: params.vehicule_id,
            technical_id: params.technical_id,
            company_id: companyId,
            create_date: new Date(),
            status: 1
        })
        // Create initial status log (Recepción)
        await models.Order_Status_Log.create({
            order_id: order.id,
            status: 1,
            start_date: new Date(),
            create_date: new Date()
        })
        return order
    }

    let getOrderById = async(id) => {
        return await models.Order_Header.findByPk(id, {
            include: [
                { model: models.Client, as: 'client' },
                { model: models.Vendor, as: 'vendor' },
                { model: models.Vehicle, as: 'vehicule',
                    include: [
                        { model: models.Vehicle_Brand, as: 'vehicule_brand' },
                        { model: models.Vehicle_Type, as: 'vehicule_type' }
                    ]
                },
                { model: models.Technical, as: 'technical' },
                { model: models.Order_Vehicule_Part, as: 'Order_Vehicule_Parts',
                    include: [
                        { model: models.Vehicle_Part, as: 'vehicule_part' }
                    ]
                },
                { model: models.Service_Option_Assign, as: 'Service_Option_Assigns',
                    include: [
                        { model: models.Service_Option, as: 'service_option' }
                    ]
                }
            ]
        })
    }

    let getAllOrders = async(companyId) => {
        return await models.Order_Header.findAll({
            where: { company_id: companyId },
            include: [
                { model: models.Client, as: 'client' },
                { model: models.Vendor, as: 'vendor' },
                { model: models.Vehicle, as: 'vehicule' },
                { model: models.Technical, as: 'technical' },
                { model: models.Service_Option_Assign, as: 'Service_Option_Assigns', attributes: ['id'] }
            ],
            order: [['create_date', 'DESC']]
        })
    }

    let searchOrders = async(filters, companyId) => {
        let where = { company_id: companyId }
        let clientWhere = {}
        let vendorWhere = {}
        let vehicleWhere = {}
        let technicalWhere = {}
        let hasClientFilter = false
        let hasVendorFilter = false
        let hasVehicleFilter = false
        let hasTechnicalFilter = false

        if (filters.number_pass) {
            where.number_pass = { [Op.like]: `%${filters.number_pass}%` }
        }

        if (filters.client_nit) {
            clientWhere.nit = { [Op.like]: `%${filters.client_nit}%` }
            hasClientFilter = true
        }

        if (filters.client_name) {
            clientWhere.name = { [Op.like]: `%${filters.client_name}%` }
            hasClientFilter = true
        }

        if (filters.plate_id) {
            vehicleWhere.plate_id = { [Op.like]: `%${filters.plate_id}%` }
            hasVehicleFilter = true
        }

        if (filters.vendor_name) {
            vendorWhere.name = { [Op.like]: `%${filters.vendor_name}%` }
            hasVendorFilter = true
        }

        if (filters.technical_name) {
            technicalWhere.name = { [Op.like]: `%${filters.technical_name}%` }
            hasTechnicalFilter = true
        }

        return await models.Order_Header.findAll({
            where: where,
            include: [
                { model: models.Client, as: 'client', where: hasClientFilter ? clientWhere : undefined, required: hasClientFilter },
                { model: models.Vendor, as: 'vendor', where: hasVendorFilter ? vendorWhere : undefined, required: hasVendorFilter },
                { model: models.Vehicle, as: 'vehicule', where: hasVehicleFilter ? vehicleWhere : undefined, required: hasVehicleFilter },
                { model: models.Technical, as: 'technical', where: hasTechnicalFilter ? technicalWhere : undefined, required: hasTechnicalFilter },
                { model: models.Service_Option_Assign, as: 'Service_Option_Assigns', attributes: ['id'] }
            ],
            order: [['create_date', 'DESC']]
        })
    }

    let updateOrder = async(id, params) => {
        return await models.Order_Header.update({
            number_pass: params.number_pass,
            order_date: params.order_date,
            payment_type: params.payment_type,
            card_installments: params.card_installments,
            delivery_date: params.delivery_date,
            client_id: params.client_id,
            vendor_id: params.vendor_id,
            vehicule_id: params.vehicule_id,
            technical_id: params.technical_id,
            update_date: new Date()
        }, { where: { id: id } })
    }

    let updateOrderStatus = async(id, status, description) => {
        // Validate sequential status change (only +1 or -1)
        const order = await models.Order_Header.findByPk(id)
        if (!order) throw new Error('Order not found')
        const currentStatus = order.status
        const diff = status - currentStatus
        if (diff !== 1 && diff !== -1) {
            throw new Error(`Status can only change one step at a time. Current: ${currentStatus}, Requested: ${status}`)
        }

        const now = new Date()
        // Close current status log with description
        await models.Order_Status_Log.update(
            { end_date: now, description: description || null },
            { where: { order_id: id, end_date: null } }
        )
        // Create new status log (without description)
        await models.Order_Status_Log.create({
            order_id: id,
            status: status,
            start_date: now,
            create_date: now
        })
        // Update order header
        return await models.Order_Header.update(
            { status: status, update_date: now },
            { where: { id: id } }
        )
    }

    let getOrderStatusLog = async(orderId) => {
        return await models.Order_Status_Log.findAll({
            where: { order_id: orderId },
            order: [['start_date', 'ASC']]
        })
    }

    let getOrdersByClient = async(clientId) => {
        return await models.Order_Header.findAll({
            where: { client_id: clientId },
            include: [
                { model: models.Client, as: 'client' },
                { model: models.Vendor, as: 'vendor' },
                { model: models.Vehicle, as: 'vehicule' },
                { model: models.Technical, as: 'technical' }
            ],
            order: [['create_date', 'DESC']]
        })
    }

    let createOrderVehiculePart = async(params) => {
        return await models.Order_Vehicule_Part.create({
            order_id: params.order_id,
            vehicule_part_id: params.vehicule_part_id,
            url: params.url,
            asset_type_id: params.asset_type_id,
            create_date: new Date()
        })
    }

    let createOrderServiceOption = async(params) => {
        return await models.Service_Option_Assign.create({
            order_id: params.order_id,
            service_option_id: params.service_option_id,
            price: params.price,
            quantity: params.quantity || 1,
            discount: params.discount || 0
        })
    }

    return {
        createOrder,
        getOrderById,
        getAllOrders,
        searchOrders,
        updateOrder,
        updateOrderStatus,
        getOrderStatusLog,
        getOrdersByClient,
        createOrderVehiculePart,
        createOrderServiceOption
    }

}

module.exports = OrderRepository();
