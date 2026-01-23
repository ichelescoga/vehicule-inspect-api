const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Order_Vehicule_Part', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Order_Header',
        key: 'id'
      }
    },
    vehicule_part_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Vehicule_Part',
        key: 'id'
      }
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    asset_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Order_Vehicule_Part',
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
        name: "vehiculePartOrder_idx",
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
      {
        name: "vehiculePartPart_idx",
        using: "BTREE",
        fields: [
          { name: "vehicule_part_id" },
        ]
      },
    ]
  });
};
