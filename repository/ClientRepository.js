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

    return {
        getAllClients,
        createClient
    }

}

module.exports = ClientRepository();
