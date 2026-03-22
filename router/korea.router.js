const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller')
const clientController = require('../controller/client.controller')
const vehicleController = require('../controller/vehicle.controller')
const serviceController = require('../controller/service.controller')
const catalogController = require('../controller/catalog.controller')
const uploadController = require('../controller/upload.controller')
const authController = require('../controller/auth.controller')
const userController = require('../controller/user.controller')
const upload = require('../components/multerConfig')
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


// Auth
router.post('/login', authController.login)
router.post('/changePassword', authController.changePassword)
router.post('/verifyToken', authController.verifyToken)

// User Management (public)
router.post('/requestAccount', userController.requestAccount)
router.post('/requestPasswordReset', userController.requestPasswordReset)

// User Management (admin)
router.get('/getPendingRequests', userController.getPendingRequests)
router.get('/getPendingRequestsCount', userController.getPendingRequestsCount)
router.put('/approveAccount/:id', userController.approveAccount)
router.put('/rejectAccount/:id', userController.rejectAccount)
router.put('/approvePasswordReset/:id', userController.approvePasswordReset)
router.put('/rejectPasswordReset/:id', userController.rejectPasswordReset)
router.get('/getAllUsers', userController.getAllUsers)
router.put('/updateUser/:id', userController.updateUser)

// Role Management
router.get('/getAllRoles', userController.getAllRoles)
router.post('/createRole', userController.createRole)
router.put('/updateRole/:id', userController.updateRole)
router.delete('/deleteRole/:id', userController.deleteRole)
router.post('/assignRole', userController.assignRole)
router.delete('/removeRole/:userId/:rolId', userController.removeRole)

// Role Permissions
router.get('/getPermissionsByRole/:rolId', userController.getPermissionsByRole)
router.put('/updateRolePermissions/:rolId', userController.updateRolePermissions)
router.get('/getPermissionsByUser/:userId', userController.getPermissionsByUser)

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

// Service Type
router.get('/getAllServiceTypes', serviceController.getAllServiceTypes)
router.post('/createServiceType', serviceController.createServiceType)
router.put('/updateServiceType/:id', serviceController.updateServiceType)

// Service
router.get('/getAllServices', serviceController.getAllServices)
router.get('/getServicesByType/:serviceTypeId', serviceController.getServicesByType)
router.post('/createService', serviceController.createService)
router.put('/updateService/:id', serviceController.updateService)

// Service Option
router.get('/getServiceOptions/:serviceId', serviceController.getServiceOptions)
router.post('/createServiceOption', serviceController.createServiceOption)
router.put('/updateServiceOption/:id', serviceController.updateServiceOption)

// Service Option Assign (Order)
router.get('/getOrderServiceOptions/:orderId', serviceController.getOrderServiceOptions)
router.delete('/deleteOrderServiceOption/:id', serviceController.deleteOrderServiceOption)
router.put('/updateOrderServiceOption/:id', serviceController.updateOrderServiceOption)
router.get('/searchServices/:query', serviceController.searchServices)

// Order
router.get('/searchOrders', orderController.searchOrders)
router.post('/createOrder', orderController.createOrder)
router.get('/getOrderById/:id', orderController.getOrderById)
router.get('/getAllOrders', orderController.getAllOrders)
router.put('/updateOrder/:id', orderController.updateOrder)
router.put('/updateOrderStatus/:id', orderController.updateOrderStatus)
router.get('/getOrderStatusLog/:orderId', orderController.getOrderStatusLog)
router.get('/getOrdersByClient/:clientId', orderController.getOrdersByClient)
router.post('/createOrderVehiculePart', orderController.createOrderVehiculePart)
router.post('/createOrderServiceOption', orderController.createOrderServiceOption)

// Upload / Inspection Files
router.post('/uploadInspectionFile', upload.single('file'), uploadController.uploadInspectionFile)
router.get('/getInspectionFiles/:orderId', uploadController.getInspectionFiles)
router.put('/deleteInspectionFile/:id', uploadController.deleteInspectionFile)

// Signature
router.post('/uploadSignature', upload.single('file'), uploadController.uploadSignature)
router.get('/getOrderSignature/:orderId', uploadController.getOrderSignature)

module.exports = router
