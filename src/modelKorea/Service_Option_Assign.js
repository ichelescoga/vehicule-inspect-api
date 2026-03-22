const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Service_Option_Assign', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    service_option_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Service_Option',
        key: 'id'
      }
    },
    price: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    discount: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      defaultValue: 0.00
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Order_Header',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'Service_Option_Assign',
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
        name: "serviceOptionAssignServiceOption_idx",
        using: "BTREE",
        fields: [
          { name: "service_option_id" },
        ]
      },
      {
        name: "serviceOptionAssignOrder_idx",
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
    ]
  });
};
