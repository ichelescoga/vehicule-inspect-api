var DataTypes = require("sequelize").DataTypes;
var _Inventario = require("./Inventario");
var _Producto = require("./Producto");
var _Sucursal = require("./Sucursal");
var _Supermercado = require("./Supermercado");

function initModels(sequelize) {
  var Inventario = _Inventario(sequelize, DataTypes);
  var Producto = _Producto(sequelize, DataTypes);
  var Sucursal = _Sucursal(sequelize, DataTypes);
  var Supermercado = _Supermercado(sequelize, DataTypes);

  Inventario.belongsTo(Producto, { as: "producto", foreignKey: "producto_id"});
  Producto.hasMany(Inventario, { as: "Inventarios", foreignKey: "producto_id"});
  Inventario.belongsTo(Sucursal, { as: "sucursal", foreignKey: "sucursal_id"});
  Sucursal.hasMany(Inventario, { as: "Inventarios", foreignKey: "sucursal_id"});
  Sucursal.belongsTo(Supermercado, { as: "supermercado", foreignKey: "supermercado_id"});
  Supermercado.hasMany(Sucursal, { as: "Sucursals", foreignKey: "supermercado_id"});

  return {
    Inventario,
    Producto,
    Sucursal,
    Supermercado,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
