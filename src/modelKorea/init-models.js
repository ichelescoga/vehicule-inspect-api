var DataTypes = require("sequelize").DataTypes;
var _Client = require("./Client");
var _Order_Header = require("./Order_Header");
var _Order_Vehicule_Part = require("./Order_Vehicule_Part");
var _Service = require("./Service");
var _Service_Option = require("./Service_Option");
var _Service_Option_Assign = require("./Service_Option_Assign");
var _Service_Type = require("./Service_Type");
var _Technical = require("./Technical");
var _Vehicle = require("./Vehicle");
var _Vendor = require("./Vendor");

function initModels(sequelize) {
  var Client = _Client(sequelize, DataTypes);
  var Order_Header = _Order_Header(sequelize, DataTypes);
  var Order_Vehicule_Part = _Order_Vehicule_Part(sequelize, DataTypes);
  var Service = _Service(sequelize, DataTypes);
  var Service_Option = _Service_Option(sequelize, DataTypes);
  var Service_Option_Assign = _Service_Option_Assign(sequelize, DataTypes);
  var Service_Type = _Service_Type(sequelize, DataTypes);
  var Technical = _Technical(sequelize, DataTypes);
  var Vehicle = _Vehicle(sequelize, DataTypes);
  var Vendor = _Vendor(sequelize, DataTypes);

  Order_Header.belongsTo(Client, { as: "client", foreignKey: "client_id"});
  Client.hasMany(Order_Header, { as: "Order_Headers", foreignKey: "client_id"});
  Order_Vehicule_Part.belongsTo(Order_Header, { as: "order", foreignKey: "order_id"});
  Order_Header.hasMany(Order_Vehicule_Part, { as: "Order_Vehicule_Parts", foreignKey: "order_id"});
  Service_Option_Assign.belongsTo(Order_Header, { as: "order", foreignKey: "order_id"});
  Order_Header.hasMany(Service_Option_Assign, { as: "Service_Option_Assigns", foreignKey: "order_id"});
  Service_Option.belongsTo(Service, { as: "service", foreignKey: "service_id"});
  Service.hasMany(Service_Option, { as: "Service_Options", foreignKey: "service_id"});
  Service.belongsTo(Service_Option, { as: "service_type", foreignKey: "service_type_id"});
  Service_Option.hasMany(Service, { as: "Services", foreignKey: "service_type_id"});
  Service_Option_Assign.belongsTo(Service_Option, { as: "service_option", foreignKey: "service_option_id"});
  Service_Option.hasMany(Service_Option_Assign, { as: "Service_Option_Assigns", foreignKey: "service_option_id"});
  Order_Header.belongsTo(Technical, { as: "technical", foreignKey: "technical_id"});
  Technical.hasMany(Order_Header, { as: "Order_Headers", foreignKey: "technical_id"});
  Order_Header.belongsTo(Vehicle, { as: "vehicule", foreignKey: "vehicule_id"});
  Vehicle.hasMany(Order_Header, { as: "Order_Headers", foreignKey: "vehicule_id"});
  Vehicle.belongsTo(Vehicule_Brand, { as: "vehicule_brand", foreignKey: "vehicule_brand_id"});
  Vehicule_Brand.hasMany(Vehicle, { as: "Vehicles", foreignKey: "vehicule_brand_id"});
  Order_Vehicule_Part.belongsTo(Vehicule_Part, { as: "vehicule_part", foreignKey: "vehicule_part_id"});
  Vehicule_Part.hasMany(Order_Vehicule_Part, { as: "Order_Vehicule_Parts", foreignKey: "vehicule_part_id"});
  Vehicle.belongsTo(Vehicule_Type, { as: "vehicule_type", foreignKey: "vehicule_type_id"});
  Vehicule_Type.hasMany(Vehicle, { as: "Vehicles", foreignKey: "vehicule_type_id"});
  Order_Header.belongsTo(Vendor, { as: "vendor", foreignKey: "vendor_id"});
  Vendor.hasMany(Order_Header, { as: "Order_Headers", foreignKey: "vendor_id"});

  return {
    Client,
    Order_Header,
    Order_Vehicule_Part,
    Service,
    Service_Option,
    Service_Option_Assign,
    Service_Type,
    Technical,
    Vehicle,
    Vendor,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
