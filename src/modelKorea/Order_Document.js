const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Order_Document', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Order_Header',
        key: 'id'
      }
    },
    document_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Order_Document_Type',
        key: 'id'
      }
    },
    original_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    stored_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    s3_path: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'Order_Document',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id" }]
      },
      {
        name: "idx_od_order",
        using: "BTREE",
        fields: [{ name: "order_id" }]
      },
      {
        name: "idx_od_type",
        using: "BTREE",
        fields: [{ name: "document_type_id" }]
      },
    ]
  });
};
