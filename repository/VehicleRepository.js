const sequelize = require('../components/conn_sqlz');
let initModels = require("../src/modelKorea/init-models");
let models = initModels(sequelize);

let VehicleRepository = function(){

    let getAllVehiculeBrands = async() =>{
        return await models.Vehicle_Brand.findAll({
        })
    }

    let getAllVehiculeType = async() =>{
        return await models.Vehicle_Type.findAll({
        })
    }

    let createVehicle = async(params) => {
        return await models.Vehicle.create({
            model: params.model,
            plate_id: params.plate_id,
            color: params.color,
            vehicule_type_id: params.vehicule_type_id,
            vehicule_brand_id: params.vehicule_brand_id,
            create_date: new Date(),
            status: 1
        })
    }

    let getAllVehicleParts = async() =>{
        return await models.Vehicle_Part.findAll({
            where: { status: 1 }
        })
    }

    let createVehiculeBrand = async(params) => {
        return await models.Vehicle_Brand.create({
            name: params.name,
            create_date: new Date(),
            status: 1
        })
    }

    let createVehiculeType = async(params) => {
        return await models.Vehicle_Type.create({
            name: params.name,
            create_date: new Date(),
            status: 1
        })
    }

    let getAllVehicles = async() =>{
        return await models.Vehicle.findAll({
            where: { status: 1 },
            include: [
                { model: models.Vehicle_Brand, as: 'vehicule_brand' },
                { model: models.Vehicle_Type, as: 'vehicule_type' }
            ]
        })
    }

    return {
        getAllVehiculeBrands,
        getAllVehiculeType,
        createVehicle,
        getAllVehicleParts,
        createVehiculeBrand,
        createVehiculeType,
        getAllVehicles
    }

}

module.exports = VehicleRepository();
