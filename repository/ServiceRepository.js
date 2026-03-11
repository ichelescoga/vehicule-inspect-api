const sequelize = require('../components/conn_sqlz');
let initModels = require("../src/modelKorea/init-models");
let models = initModels(sequelize);

let ServiceRepository = function(){

    let getAllServices = async() =>{
        return await models.Service.findAll({
            where: { status: 1 },
            include: [{
                model: models.Service_Option,
                as: 'Service_Options',
                where: { status: 1 },
                required: false
            }]
        })
    }

    return {
        getAllServices
    }

}

module.exports = ServiceRepository();
