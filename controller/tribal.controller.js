const TribalRepository = require('../repository/TribalRepository')
const jwt  = require('jsonwebtoken');
const { get } = require('request');
const https = require('https')
const request = require('request');



exports.getAllSupermercados = async (req, res, next) => {
    try{
        let result = await TribalRepository.getAllSupermercados()
        console.log(result)
        if (!result) {
            console.info("Supermarkets was empty")
            res.json({
                success: false,
                responseType: 3,
                payload: result
            })
            return
        }

        res.json({
            success: true,
            payload: result
        })
    }
    catch(error){
        console.log(error)
        console.info(error)
        res.json({
            success: false,
            payload: error
        })
        return
    }
}

exports.createSupermercado = async (req, res, next) => {
    try{
        let params = {
            nombre: req.body.nombre,
            direccion: req.body.direccion
        }
        let result = await TribalRepository.createSupermercado(params)
        console.log(result)
        if (!result) {
            console.info("Supermarkets was empty")
            res.json({
                success: false,
                responseType: 3,
                payload: result
            })
            return
        }

        res.json({
            success: true,
            payload: result
        })
    }
    catch(error){
        console.log(error)
        console.info(error)
        res.json({
            success: false,
            payload: error
        })
        return
    }
}