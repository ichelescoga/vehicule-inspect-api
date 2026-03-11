const sequelize = require('../components/conn_sqlz');
let initModels = require("../src/modelKorea/init-models");
let models = initModels(sequelize);

let OrderRepository = function(){

    let createOrder = async(params) => {
        return await models.Order_Header.create({
            number_pass: params.number_pass,
            order_date: params.order_date || new Date(),
            payment_type: params.payment_type,
            delivery_date: params.delivery_date,
            client_id: params.client_id,
            vendor_id: params.vendor_id,
            vehicule_id: params.vehicule_id,
            technical_id: params.technical_id,
            create_date: new Date(),
            status: 1
        })
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

    let getAllOrders = async() => {
        return await models.Order_Header.findAll({
            include: [
                { model: models.Client, as: 'client' },
                { model: models.Vendor, as: 'vendor' },
                { model: models.Vehicle, as: 'vehicule' },
                { model: models.Technical, as: 'technical' }
            ],
            order: [['create_date', 'DESC']]
        })
    }

    let updateOrderStatus = async(id, status) => {
        return await models.Order_Header.update(
            { status: status, update_date: new Date() },
            { where: { id: id } }
        )
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
            price: params.price
        })
    }

    return {
        createOrder,
        getOrderById,
        getAllOrders,
        updateOrderStatus,
        getOrdersByClient,
        createOrderVehiculePart,
        createOrderServiceOption
    }

}

module.exports = OrderRepository();
