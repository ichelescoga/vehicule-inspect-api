const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Order_Header', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    close_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    number_pass: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    card_installments: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    payment_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Client',
        key: 'id'
      }
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Vendor',
        key: 'id'
      }
    },
    vehicule_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Vehicle',
        key: 'id'
      }
    },
    technical_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Technical',
        key: 'id'
      }
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Company',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'Order_Header',
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
        name: "orderClient_idx",
        using: "BTREE",
        fields: [
          { name: "client_id" },
        ]
      },
      {
        name: "orderTechnical_idx",
        using: "BTREE",
        fields: [
          { name: "technical_id" },
        ]
      },
      {
        name: "orderVendor_idx",
        using: "BTREE",
        fields: [
          { name: "vendor_id" },
        ]
      },
      {
        name: "orderVehicule_idx",
        using: "BTREE",
        fields: [
          { name: "vehicule_id" },
        ]
      },
    ]
  });
};
