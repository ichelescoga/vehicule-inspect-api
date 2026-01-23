const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Sucursal', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    supermercado_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Supermercado',
        key: 'id'
      }
    },
    nombre: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    direccion: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Sucursal',
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
        name: "supermercado_id_idx",
        using: "BTREE",
        fields: [
          { name: "supermercado_id" },
        ]
      },
    ]
  });
};
