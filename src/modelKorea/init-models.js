var DataTypes = require("sequelize").DataTypes;
var _Client = require("./Client");
var _Inspection_File = require("./Inspection_File");
var _Order_Header = require("./Order_Header");
var _Order_Status_Log = require("./Order_Status_Log");
var _Order_Vehicule_Part = require("./Order_Vehicule_Part");
var _Service = require("./Service");
var _Service_Option = require("./Service_Option");
var _Service_Option_Assign = require("./Service_Option_Assign");
var _Service_Type = require("./Service_Type");
var _Technical = require("./Technical");
var _User = require("./User");
var _User_Rol = require("./User_Rol");
var _User_Rol_Assign = require("./User_Rol_Assign");
var _Vehicle = require("./Vehicle");
var _Vehicle_Brand = require("./Vehicle_Brand");
var _Vehicle_Part = require("./Vehicle_Part");
var _Vehicle_Type = require("./Vehicle_Type");
var _Vendor = require("./Vendor");
var _Account_Request = require("./Account_Request");
var _Password_Reset_Request = require("./Password_Reset_Request");
var _Role_Permission = require("./Role_Permission");

function initModels(sequelize) {
  var Client = _Client(sequelize, DataTypes);
  var Inspection_File = _Inspection_File(sequelize, DataTypes);
  var Order_Header = _Order_Header(sequelize, DataTypes);
  var Order_Status_Log = _Order_Status_Log(sequelize, DataTypes);
  var Order_Vehicule_Part = _Order_Vehicule_Part(sequelize, DataTypes);
  var Service = _Service(sequelize, DataTypes);
  var Service_Option = _Service_Option(sequelize, DataTypes);
  var Service_Option_Assign = _Service_Option_Assign(sequelize, DataTypes);
  var Service_Type = _Service_Type(sequelize, DataTypes);
  var Technical = _Technical(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);
  var User_Rol = _User_Rol(sequelize, DataTypes);
  var User_Rol_Assign = _User_Rol_Assign(sequelize, DataTypes);
  var Vehicle = _Vehicle(sequelize, DataTypes);
  var Vehicle_Brand = _Vehicle_Brand(sequelize, DataTypes);
  var Vehicle_Part = _Vehicle_Part(sequelize, DataTypes);
  var Vehicle_Type = _Vehicle_Type(sequelize, DataTypes);
  var Vendor = _Vendor(sequelize, DataTypes);
  var Account_Request = _Account_Request(sequelize, DataTypes);
  var Password_Reset_Request = _Password_Reset_Request(sequelize, DataTypes);
  var Role_Permission = _Role_Permission(sequelize, DataTypes);

  Order_Header.belongsTo(Client, { as: "client", foreignKey: "client_id"});
  Client.hasMany(Order_Header, { as: "Order_Headers", foreignKey: "client_id"});
  Inspection_File.belongsTo(Order_Header, { as: "order", foreignKey: "order_id"});
  Order_Header.hasMany(Inspection_File, { as: "Inspection_Files", foreignKey: "order_id"});
  Inspection_File.belongsTo(Vehicle_Part, { as: "vehicule_part", foreignKey: "vehicule_part_id"});
  Vehicle_Part.hasMany(Inspection_File, { as: "Inspection_Files", foreignKey: "vehicule_part_id"});
  Order_Status_Log.belongsTo(Order_Header, { as: "order", foreignKey: "order_id"});
  Order_Header.hasMany(Order_Status_Log, { as: "Order_Status_Logs", foreignKey: "order_id"});
  Order_Vehicule_Part.belongsTo(Order_Header, { as: "order", foreignKey: "order_id"});
  Order_Header.hasMany(Order_Vehicule_Part, { as: "Order_Vehicule_Parts", foreignKey: "order_id"});
  Service_Option_Assign.belongsTo(Order_Header, { as: "order", foreignKey: "order_id"});
  Order_Header.hasMany(Service_Option_Assign, { as: "Service_Option_Assigns", foreignKey: "order_id"});
  Service_Option.belongsTo(Service, { as: "service", foreignKey: "service_id"});
  Service.hasMany(Service_Option, { as: "Service_Options", foreignKey: "service_id"});
  Service.belongsTo(Service_Type, { as: "service_type", foreignKey: "service_type_id"});
  Service_Type.hasMany(Service, { as: "Services", foreignKey: "service_type_id"});
  Service_Option_Assign.belongsTo(Service_Option, { as: "service_option", foreignKey: "service_option_id"});
  Service_Option.hasMany(Service_Option_Assign, { as: "Service_Option_Assigns", foreignKey: "service_option_id"});
  Order_Header.belongsTo(Technical, { as: "technical", foreignKey: "technical_id"});
  Technical.hasMany(Order_Header, { as: "Order_Headers", foreignKey: "technical_id"});
  User_Rol_Assign.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(User_Rol_Assign, { as: "User_Rol_Assigns", foreignKey: "user_id"});
  User_Rol_Assign.belongsTo(User_Rol, { as: "rol", foreignKey: "rol_id"});
  User_Rol.hasMany(User_Rol_Assign, { as: "User_Rol_Assigns", foreignKey: "rol_id"});
  Order_Header.belongsTo(Vehicle, { as: "vehicule", foreignKey: "vehicule_id"});
  Vehicle.hasMany(Order_Header, { as: "Order_Headers", foreignKey: "vehicule_id"});
  Vehicle.belongsTo(Vehicle_Brand, { as: "vehicule_brand", foreignKey: "vehicule_brand_id"});
  Vehicle_Brand.hasMany(Vehicle, { as: "Vehicles", foreignKey: "vehicule_brand_id"});
  Order_Vehicule_Part.belongsTo(Vehicle_Part, { as: "vehicule_part", foreignKey: "vehicule_part_id"});
  Vehicle_Part.hasMany(Order_Vehicule_Part, { as: "Order_Vehicule_Parts", foreignKey: "vehicule_part_id"});
  Vehicle.belongsTo(Vehicle_Type, { as: "vehicule_type", foreignKey: "vehicule_type_id"});
  Vehicle_Type.hasMany(Vehicle, { as: "Vehicles", foreignKey: "vehicule_type_id"});
  Order_Header.belongsTo(Vendor, { as: "vendor", foreignKey: "vendor_id"});
  Vendor.hasMany(Order_Header, { as: "Order_Headers", foreignKey: "vendor_id"});
  Password_Reset_Request.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(Password_Reset_Request, { as: "Password_Reset_Requests", foreignKey: "user_id"});
  Role_Permission.belongsTo(User_Rol, { as: "rol", foreignKey: "rol_id"});
  User_Rol.hasMany(Role_Permission, { as: "Role_Permissions", foreignKey: "rol_id"});

  return {
    Client,
    Inspection_File,
    Order_Header,
    Order_Status_Log,
    Order_Vehicule_Part,
    Service,
    Service_Option,
    Service_Option_Assign,
    Service_Type,
    Technical,
    User,
    User_Rol,
    User_Rol_Assign,
    Vehicle,
    Vehicle_Brand,
    Vehicle_Part,
    Vehicle_Type,
    Vendor,
    Account_Request,
    Password_Reset_Request,
    Role_Permission,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
