const sequelize = require('../components/conn_sqlz');
let initModels = require("../src/modelKorea/init-models");
let models = initModels(sequelize);

let CatalogRepository = function(){

    let getAllVendors = async(companyId, includeInactive = false) =>{
        const where = includeInactive ? { company_id: companyId } : { status: 1, company_id: companyId }
        return await models.Vendor.findAll({ where })
    }

    let getAllTechnicals = async(companyId, includeInactive = false) =>{
        const where = includeInactive ? { company_id: companyId } : { status: 1, company_id: companyId }
        return await models.Technical.findAll({ where })
    }

    let createVendor = async(params, companyId) => {
        return await models.Vendor.create({
            name: params.name,
            company_id: companyId,
            create_date: new Date(),
            status: 1
        })
    }

    let updateVendor = async(id, params) => {
        const data = { name: params.name, update_date: new Date() }
        if (params.status !== undefined) data.status = params.status
        return await models.Vendor.update(data, { where: { id: id } })
    }

    let createTechnical = async(params, companyId) => {
        return await models.Technical.create({
            name: params.name,
            company_id: companyId,
            create_date: new Date(),
            status: 1
        })
    }

    let updateTechnical = async(id, params) => {
        const data = { name: params.name, update_date: new Date() }
        if (params.status !== undefined) data.status = params.status
        return await models.Technical.update(data, { where: { id: id } })
    }

    return {
        getAllVendors,
        getAllTechnicals,
        createVendor,
        updateVendor,
        createTechnical,
        updateTechnical
    }

}

module.exports = CatalogRepository();
