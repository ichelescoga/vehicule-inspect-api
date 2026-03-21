const sequelize = require('../components/conn_sqlz');
let initModels = require("../src/modelKorea/init-models");
let models = initModels(sequelize);

let ServiceRepository = function(){

    // ─── SERVICE TYPE ───

    let getAllServiceTypes = async() => {
        return await models.Service_Type.findAll({
            where: { status: 1 }
        })
    }

    let createServiceType = async(params) => {
        return await models.Service_Type.create({
            name: params.name,
            create_date: new Date(),
            status: 1
        })
    }

    let updateServiceType = async(id, params) => {
        return await models.Service_Type.update({
            name: params.name,
            update_date: new Date()
        }, { where: { id } })
    }

    // ─── SERVICE ───

    let getServicesByType = async(serviceTypeId) => {
        return await models.Service.findAll({
            where: { service_type_id: serviceTypeId, status: 1 },
            include: [{
                model: models.Service_Option,
                as: 'Service_Options',
                where: { status: 1 },
                required: false
            }]
        })
    }

    let getAllServices = async() => {
        return await models.Service.findAll({
            where: { status: 1 },
            include: [
                {
                    model: models.Service_Option,
                    as: 'Service_Options',
                    where: { status: 1 },
                    required: false
                },
                {
                    model: models.Service_Type,
                    as: 'service_type'
                }
            ]
        })
    }

    let createService = async(params) => {
        return await models.Service.create({
            name: params.name,
            service_type_id: params.service_type_id,
            create_date: new Date(),
            status: 1
        })
    }

    let updateService = async(id, params) => {
        return await models.Service.update({
            name: params.name,
            service_type_id: params.service_type_id,
            update_date: new Date()
        }, { where: { id } })
    }

    // ─── SERVICE OPTION ───

    let getServiceOptions = async(serviceId) => {
        return await models.Service_Option.findAll({
            where: { service_id: serviceId, status: 1 },
            include: [{
                model: models.Service,
                as: 'service'
            }]
        })
    }

    let createServiceOption = async(params) => {
        return await models.Service_Option.create({
            name: params.name,
            service_id: params.service_id,
            create_date: new Date(),
            status: 1
        })
    }

    let updateServiceOption = async(id, params) => {
        return await models.Service_Option.update({
            name: params.name,
            update_date: new Date()
        }, { where: { id } })
    }

    // ─── SERVICE OPTION ASSIGN (Order) ───

    let getOrderServiceOptions = async(orderId) => {
        return await models.Service_Option_Assign.findAll({
            where: { order_id: orderId },
            include: [{
                model: models.Service_Option,
                as: 'service_option',
                include: [{
                    model: models.Service,
                    as: 'service'
                }]
            }]
        })
    }

    let deleteOrderServiceOption = async(id) => {
        return await models.Service_Option_Assign.destroy({
            where: { id }
        })
    }

    return {
        getAllServiceTypes,
        createServiceType,
        updateServiceType,
        getServicesByType,
        getAllServices,
        createService,
        updateService,
        getServiceOptions,
        createServiceOption,
        updateServiceOption,
        getOrderServiceOptions,
        deleteOrderServiceOption
    }

}

module.exports = ServiceRepository();
