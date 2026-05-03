const sequelize = require('../components/conn_sqlz');
const { Op } = require('sequelize');
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

    let createVehicle = async(params, companyId) => {
        return await models.Vehicle.create({
            model: params.model,
            linea: params.linea,
            plate_id: params.plate_id,
            color: params.color,
            vehicule_type_id: params.vehicule_type_id,
            vehicule_brand_id: params.vehicule_brand_id,
            transmision_type: params.transmision_type,
            company_id: companyId,
            create_date: new Date(),
            status: 1
        })
    }

    let getAllVehicleParts = async(companyId) =>{
        return await models.Vehicle_Part.findAll({
            where: { status: 1, company_id: companyId }
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

    let getAllVehicles = async(companyId, includeInactive = false) =>{
        const where = includeInactive ? { company_id: companyId } : { status: 1, company_id: companyId }
        return await models.Vehicle.findAll({
            where,
            include: [
                { model: models.Vehicle_Brand, as: 'vehicule_brand' },
                { model: models.Vehicle_Type, as: 'vehicule_type' }
            ]
        })
    }

    let searchVehicleByPlate = async(plate, companyId) => {
        return await models.Vehicle.findAll({
            where: {
                plate_id: { [Op.like]: `%${plate}%` },
                status: 1,
                company_id: companyId
            },
            include: [
                { model: models.Vehicle_Brand, as: 'vehicule_brand' },
                { model: models.Vehicle_Type, as: 'vehicule_type' }
            ]
        })
    }

    let updateVehicle = async(id, params) => {
        const data = {
            model: params.model,
            linea: params.linea,
            plate_id: params.plate_id,
            color: params.color,
            vehicule_type_id: params.vehicule_type_id,
            vehicule_brand_id: params.vehicule_brand_id,
            transmision_type: params.transmision_type,
            update_date: new Date()
        }
        if (params.status !== undefined) data.status = params.status
        return await models.Vehicle.update(data, { where: { id: id } })
    }

    let searchVehicleParts = async(name, companyId) => {
        return await models.Vehicle_Part.findAll({
            where: {
                name: { [Op.like]: `%${name}%` },
                status: 1,
                company_id: companyId
            }
        })
    }

    let createVehiclePart = async(params, companyId) => {
        return await models.Vehicle_Part.create({
            name: params.name,
            company_id: companyId,
            create_date: new Date(),
            status: 1
        })
    }

    return {
        getAllVehiculeBrands,
        getAllVehiculeType,
        createVehicle,
        getAllVehicleParts,
        searchVehicleParts,
        createVehiclePart,
        createVehiculeBrand,
        createVehiculeType,
        getAllVehicles,
        searchVehicleByPlate,
        updateVehicle
    }

}

module.exports = VehicleRepository();
