const sequelize = require('../components/conn_sqlz');
let initModels = require("../src/modelKorea/init-models");
let models = initModels(sequelize);

let ClientRepository = function(){

    let getAllClients = async() =>{
        return await models.Client.findAll({
            where: { status: 1 }
        })
    }

    let createClient = async(params) => {
        return await models.Client.create({
            name: params.name,
            address: params.address,
            bill_name: params.bill_name,
            nit: params.nit,
            email: params.email,
            office_cel: params.office_cel,
            residence_cel: params.residence_cel,
            create_date: new Date(),
            status: 1
        })
    }

    let searchClientByNit = async(nit) => {
        return await models.Client.findAll({
            where: {
                nit: { [require('sequelize').Op.like]: `%${nit}%` },
                status: 1
            }
        })
    }

    let searchClientByName = async(name) => {
        return await models.Client.findAll({
            where: {
                name: { [require('sequelize').Op.like]: `%${name}%` },
                status: 1
            }
        })
    }

    let updateClient = async(id, params) => {
        return await models.Client.update({
            name: params.name,
            address: params.address,
            bill_name: params.bill_name,
            nit: params.nit,
            email: params.email,
            office_cel: params.office_cel,
            residence_cel: params.residence_cel,
            update_date: new Date()
        }, { where: { id: id } })
    }

    return {
        getAllClients,
        createClient,
        searchClientByNit,
        searchClientByName,
        updateClient
    }

}

module.exports = ClientRepository();
