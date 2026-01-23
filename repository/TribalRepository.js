const sequelize = require('../components/conn_sqlz');
let initModels = require("../src/modelTribal/init-models");
let models = initModels(sequelize);
const Sequelize = require('sequelize');
const { Op } = require("sequelize");
 let TribalRepository = function(){

    let getAllSupermercados = async() =>{
        return await models.Supermercado.findAll({

        })
    }

    let createSupermercado = async(params) => {
        return await models.Supermercado.create({
            nombre: params.nombre,
            direccion: params.direccion            
        }).then(resp =>{
            //console.log(resp);
            return resp
        }).catch(err=>{
            console.log(err);
            return err
        })
    }

    return {
        getAllSupermercados,
        createSupermercado
    }

 }

 module.exports = TribalRepository();