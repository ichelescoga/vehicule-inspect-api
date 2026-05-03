const sequelize = require('../components/conn_sqlz');
let initModels = require("../src/modelKorea/init-models");
let models = initModels(sequelize);

let ClientRepository = function(){

    let getAllClients = async(companyId) =>{
        return await models.Client.findAll({
            where: { status: 1, company_id: companyId }
        })
    }

    let createClient = async(params, companyId) => {
        return await models.Client.create({
            name: params.name,
            address: params.address,
            bill_name: params.bill_name,
            nit: params.nit,
            email: params.email,
            office_cel: params.office_cel,
            residence_cel: params.residence_cel,
            authorization_cel: params.authorization_cel,
            company_id: companyId,
            create_date: new Date(),
            status: 1
        })
    }

    let searchClientByNit = async(nit, companyId) => {
        return await models.Client.findAll({
            where: {
                nit: { [require('sequelize').Op.like]: `%${nit}%` },
                status: 1,
                company_id: companyId
            }
        })
    }

    let searchClientByName = async(name, companyId) => {
        return await models.Client.findAll({
            where: {
                name: { [require('sequelize').Op.like]: `%${name}%` },
                status: 1,
                company_id: companyId
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
            authorization_cel: params.authorization_cel,
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
