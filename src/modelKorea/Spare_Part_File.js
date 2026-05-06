const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Spare_Part_File', {
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
    spare_part_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Spare_Part',
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
    tableName: 'Spare_Part_File',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id" }]
      },
      {
        name: "idx_spf_order",
        using: "BTREE",
        fields: [{ name: "order_id" }]
      },
      {
        name: "idx_spf_spare_part",
        using: "BTREE",
        fields: [{ name: "spare_part_id" }]
      },
    ]
  });
};
