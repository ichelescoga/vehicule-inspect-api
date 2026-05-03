const sequelize = require('../components/conn_sqlz');
const { Op } = require('sequelize');
let initModels = require("../src/modelKorea/init-models");
let models = initModels(sequelize);

let ServiceRepository = function(){

    // ─── SERVICE TYPE ───

    let getAllServiceTypes = async(companyId) => {
        return await models.Service_Type.findAll({
            where: { status: 1, company_id: companyId }
        })
    }

    let createServiceType = async(params, companyId) => {
        return await models.Service_Type.create({
            name: params.name,
            company_id: companyId,
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

    let getServicesByType = async(serviceTypeId, companyId) => {
        return await models.Service.findAll({
            where: { service_type_id: serviceTypeId, status: 1, company_id: companyId },
            include: [{
                model: models.Service_Option,
                as: 'Service_Options',
                where: { status: 1 },
                required: false
            }]
        })
    }

    let getAllServices = async(companyId) => {
        return await models.Service.findAll({
            where: { status: 1, company_id: companyId },
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

    let createService = async(params, companyId) => {
        return await models.Service.create({
            name: params.name,
            service_type_id: params.service_type_id,
            company_id: companyId,
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

    let createServiceOption = async(params, companyId) => {
        return await models.Service_Option.create({
            name: params.name,
            service_id: params.service_id,
            company_id: companyId,
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
                    as: 'service',
                    include: [{
                        model: models.Service_Type,
                        as: 'service_type'
                    }]
                }]
            }]
        })
    }

    let deleteOrderServiceOption = async(id) => {
        return await models.Service_Option_Assign.destroy({
            where: { id }
        })
    }

    let updateOrderServiceOption = async(id, params) => {
        return await models.Service_Option_Assign.update({
            price: params.price,
            quantity: params.quantity,
            discount: params.discount
        }, { where: { id } })
    }

    let searchServices = async(query, companyId) => {
        const like = { [Op.like]: `%${query}%` };
        return await models.Service_Option.findAll({
            where: { status: 1, name: like, company_id: companyId },
            include: [{
                model: models.Service,
                as: 'service',
                where: { status: 1 },
                include: [{
                    model: models.Service_Type,
                    as: 'service_type',
                    where: { status: 1 }
                }]
            }],
            limit: 20
        }).then(async (optionResults) => {
            // Also search by service name
            const serviceResults = await models.Service_Option.findAll({
                where: { status: 1 },
                include: [{
                    model: models.Service,
                    as: 'service',
                    where: { status: 1, name: like },
                    include: [{
                        model: models.Service_Type,
                        as: 'service_type',
                        where: { status: 1 }
                    }]
                }],
                limit: 20
            });
            // Also search by service type name
            const typeResults = await models.Service_Option.findAll({
                where: { status: 1 },
                include: [{
                    model: models.Service,
                    as: 'service',
                    where: { status: 1 },
                    include: [{
                        model: models.Service_Type,
                        as: 'service_type',
                        where: { status: 1, name: like }
                    }]
                }],
                limit: 20
            });
            // Merge and deduplicate by option id
            const seen = new Set();
            const merged = [];
            for (const item of [...optionResults, ...serviceResults, ...typeResults]) {
                if (!seen.has(item.id)) {
                    seen.add(item.id);
                    merged.push(item);
                }
            }
            return merged;
        });
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
        deleteOrderServiceOption,
        updateOrderServiceOption,
        searchServices
    }

}

module.exports = ServiceRepository();
