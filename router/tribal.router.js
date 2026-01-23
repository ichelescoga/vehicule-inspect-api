const express = require('express');
const router = express.Router();
const tribalController = require('../controller/tribal.controller')
const security = require('../src/utils/security')

function verfiyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403)
    }
}

function authentication(req,res,next){
    //console.log(req.headers.token);
    let decryptToken = security.Decrypt(req.headers.token)
    console.log(
        {
            Reqtoken : JSON.parse(decryptToken),
            ResTokenValues : security.validateToken2(JSON.parse(decryptToken))
        }
    )
    //console.log(JSON.parse(decryptToken));
    if(security.validateToken(JSON.parse(decryptToken))){
        console.log('Go next');
        next();
    }else{
        res.sendStatus(403)
    }
}


router.get('/healthcheck', (req, res) => {
    res.json({succeded: true, payload: 'HealthCheck ok'})
    console.log('HealthCheck ok')
})

//
router.get('/getAllSupermercados', tribalController.getAllSupermercados)
router.post('/createSupermercado', tribalController.createSupermercado)
module.exports = router