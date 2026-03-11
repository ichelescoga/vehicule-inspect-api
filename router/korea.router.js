const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller')
const clientController = require('../controller/client.controller')
const vehicleController = require('../controller/vehicle.controller')
const serviceController = require('../controller/service.controller')
const catalogController = require('../controller/catalog.controller')
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

// Catalog - Vendor
router.get('/getAllVendors', catalogController.getAllVendors)
router.post('/createVendor', catalogController.createVendor)
router.put('/updateVendor/:id', catalogController.updateVendor)

// Catalog - Technical
router.get('/getAllTechnicals', catalogController.getAllTechnicals)
router.post('/createTechnical', catalogController.createTechnical)
router.put('/updateTechnical/:id', catalogController.updateTechnical)

// Vehicle
router.get('/getAllVehiculeBrands', vehicleController.getAllVehiculeBrands)
router.get('/getAllVehiculeType', vehicleController.getAllVehiculeType)
router.get('/getAllVehicleParts', vehicleController.getAllVehicleParts)
router.get('/searchVehicleByPlate/:plate', vehicleController.searchVehicleByPlate)
router.get('/getAllVehicles', vehicleController.getAllVehicles)
router.post('/createVehicle', vehicleController.createVehicle)
router.put('/updateVehicle/:id', vehicleController.updateVehicle)
router.post('/createVehiculeBrand', vehicleController.createVehiculeBrand)
router.post('/createVehiculeType', vehicleController.createVehiculeType)
router.get('/searchVehicleParts/:name', vehicleController.searchVehicleParts)
router.post('/createVehiclePart', vehicleController.createVehiclePart)

// Client
router.get('/getAllClients', clientController.getAllClients)
router.get('/searchClientByNit/:nit', clientController.searchClientByNit)
router.get('/searchClientByName/:name', clientController.searchClientByName)
router.post('/createClient', clientController.createClient)
router.put('/updateClient/:id', clientController.updateClient)

// Service
router.get('/getAllServices', serviceController.getAllServices)

// Order
router.get('/searchOrders', orderController.searchOrders)
router.post('/createOrder', orderController.createOrder)
router.get('/getOrderById/:id', orderController.getOrderById)
router.get('/getAllOrders', orderController.getAllOrders)
router.put('/updateOrder/:id', orderController.updateOrder)
router.put('/updateOrderStatus/:id', orderController.updateOrderStatus)
router.get('/getOrdersByClient/:clientId', orderController.getOrdersByClient)
router.post('/createOrderVehiculePart', orderController.createOrderVehiculePart)
router.post('/createOrderServiceOption', orderController.createOrderServiceOption)

module.exports = router
