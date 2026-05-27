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
var _Order_Signature = require("./Order_Signature");
var _Company = require("./Company");
var _Spare_Part = require("./Spare_Part");
var _Spare_Part_File = require("./Spare_Part_File");
var _Quotation_File = require("./Quotation_File");
var _Order_Document_Type = require("./Order_Document_Type");
var _Order_Document = require("./Order_Document");
var _Order_Comment = require("./Order_Comment");
var _Signature_Token = require("./Signature_Token");
var _Order_Checklist = require("./Order_Checklist");
var _Order_QA = require("./Order_QA");
var _QA_File = require("./QA_File");

function initModels(sequelize) {
  var Company = _Company(sequelize, DataTypes);
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
  var Order_Signature = _Order_Signature(sequelize, DataTypes);
  var Spare_Part = _Spare_Part(sequelize, DataTypes);
  var Spare_Part_File = _Spare_Part_File(sequelize, DataTypes);
  var Quotation_File = _Quotation_File(sequelize, DataTypes);
  var Order_Document_Type = _Order_Document_Type(sequelize, DataTypes);
  var Order_Document = _Order_Document(sequelize, DataTypes);
  var Order_Comment = _Order_Comment(sequelize, DataTypes);
  var Signature_Token = _Signature_Token(sequelize, DataTypes);
  var Order_Checklist = _Order_Checklist(sequelize, DataTypes);
  var Order_QA = _Order_QA(sequelize, DataTypes);
  var QA_File = _QA_File(sequelize, DataTypes);

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
  Order_Signature.belongsTo(Order_Header, { as: "order", foreignKey: "order_id"});
  Order_Header.hasMany(Order_Signature, { as: "Order_Signatures", foreignKey: "order_id"});

  // Company associations
  Client.belongsTo(Company, { as: "company", foreignKey: "company_id"});
  Company.hasMany(Client, { as: "Clients", foreignKey: "company_id"});
  Vehicle.belongsTo(Company, { as: "company", foreignKey: "company_id"});
  Company.hasMany(Vehicle, { as: "Vehicles", foreignKey: "company_id"});
  Technical.belongsTo(Company, { as: "company", foreignKey: "company_id"});
  Company.hasMany(Technical, { as: "Technicals", foreignKey: "company_id"});
  Vendor.belongsTo(Company, { as: "company", foreignKey: "company_id"});
  Company.hasMany(Vendor, { as: "Vendors", foreignKey: "company_id"});
  Order_Header.belongsTo(Company, { as: "company", foreignKey: "company_id"});
  Company.hasMany(Order_Header, { as: "Order_Headers", foreignKey: "company_id"});
  User.belongsTo(Company, { as: "company", foreignKey: "company_id"});
  Company.hasMany(User, { as: "Users", foreignKey: "company_id"});
  Service_Type.belongsTo(Company, { as: "company", foreignKey: "company_id"});
  Company.hasMany(Service_Type, { as: "Service_Types", foreignKey: "company_id"});
  Service.belongsTo(Company, { as: "company", foreignKey: "company_id"});
  Company.hasMany(Service, { as: "Services", foreignKey: "company_id"});
  Service_Option.belongsTo(Company, { as: "company", foreignKey: "company_id"});
  Company.hasMany(Service_Option, { as: "Service_Options", foreignKey: "company_id"});
  Vehicle_Part.belongsTo(Company, { as: "company", foreignKey: "company_id"});
  Company.hasMany(Vehicle_Part, { as: "Vehicle_Parts", foreignKey: "company_id"});
  User_Rol_Assign.belongsTo(Company, { as: "company", foreignKey: "company_id"});
  Company.hasMany(User_Rol_Assign, { as: "User_Rol_Assigns", foreignKey: "company_id"});

  // Spare Part associations
  Spare_Part_File.belongsTo(Order_Header, { as: "order", foreignKey: "order_id"});
  Order_Header.hasMany(Spare_Part_File, { as: "Spare_Part_Files", foreignKey: "order_id"});
  Spare_Part_File.belongsTo(Spare_Part, { as: "spare_part", foreignKey: "spare_part_id"});
  Spare_Part.hasMany(Spare_Part_File, { as: "Spare_Part_Files", foreignKey: "spare_part_id"});
  Spare_Part.belongsTo(Company, { as: "company", foreignKey: "company_id"});
  Company.hasMany(Spare_Part, { as: "Spare_Parts", foreignKey: "company_id"});

  // Quotation File associations
  Quotation_File.belongsTo(Order_Header, { as: "order", foreignKey: "order_id"});
  Order_Header.hasMany(Quotation_File, { as: "Quotation_Files", foreignKey: "order_id"});

  // Order Document associations
  Order_Document.belongsTo(Order_Header, { as: "order", foreignKey: "order_id"});
  Order_Header.hasMany(Order_Document, { as: "Order_Documents", foreignKey: "order_id"});
  Order_Document.belongsTo(Order_Document_Type, { as: "document_type", foreignKey: "document_type_id"});
  Order_Document_Type.hasMany(Order_Document, { as: "Order_Documents", foreignKey: "document_type_id"});

  // Order Comment associations
  Order_Comment.belongsTo(Order_Header, { as: "order", foreignKey: "order_id"});

  // Signature Token associations
  Signature_Token.belongsTo(Order_Header, { as: "order", foreignKey: "order_id"});
  Order_Header.hasMany(Signature_Token, { as: "Signature_Tokens", foreignKey: "order_id"});
  Order_Header.hasMany(Order_Comment, { as: "Order_Comments", foreignKey: "order_id"});

  // Order Checklist associations
  Order_Checklist.belongsTo(Order_Header, { as: "order", foreignKey: "order_id"});
  Order_Header.hasMany(Order_Checklist, { as: "Order_Checklists", foreignKey: "order_id"});

  Order_QA.belongsTo(Order_Header, { as: "order", foreignKey: "order_id"});
  Order_Header.hasMany(Order_QA, { as: "Order_QAs", foreignKey: "order_id"});
  QA_File.belongsTo(Order_Header, { as: "order", foreignKey: "order_id"});
  QA_File.belongsTo(Order_QA, { as: "qa", foreignKey: "qa_id"});
  Order_QA.hasMany(QA_File, { as: "QA_Files", foreignKey: "qa_id"});

  return {
    Company,
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
    Order_Signature,
    Spare_Part,
    Spare_Part_File,
    Quotation_File,
    Order_Document_Type,
    Order_Document,
    Order_Comment,
    Signature_Token,
    Order_Checklist,
    Order_QA,
    QA_File,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
