const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Inventario', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sucursal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Sucursal',
        key: 'id'
      }
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Producto',
        key: 'id'
      }
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tipo_movimiento: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Inventario',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "InventarioSucursal_idx",
        using: "BTREE",
        fields: [
          { name: "sucursal_id" },
        ]
      },
      {
        name: "InventarioProducto_idx",
        using: "BTREE",
        fields: [
          { name: "producto_id" },
        ]
      },
    ]
  });
};
