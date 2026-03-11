const sequelize = require('../components/conn_sqlz');
let initModels = require("../src/modelKorea/init-models");
let models = initModels(sequelize);

let CatalogRepository = function(){

    let getAllVendors = async() =>{
        return await models.Vendor.findAll({
        })
    }

    let getAllTechnicals = async() =>{
        return await models.Technical.findAll({
        })
    }

    let createVendor = async(params) => {
        return await models.Vendor.create({
            name: params.name,
            create_date: new Date(),
            status: 1
        })
    }

    let updateVendor = async(id, params) => {
        return await models.Vendor.update(
            { name: params.name, update_date: new Date() },
            { where: { id: id } }
        )
    }

    let createTechnical = async(params) => {
        return await models.Technical.create({
            name: params.name,
            create_date: new Date(),
            status: 1
        })
    }

    let updateTechnical = async(id, params) => {
        return await models.Technical.update(
            { name: params.name, update_date: new Date() },
            { where: { id: id } }
        )
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
