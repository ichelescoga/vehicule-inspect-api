const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Inspection_File', {
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
    vehicule_part_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Vehicle_Part',
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
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'Inspection_File',
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
        name: "fk_inspection_file_order",
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
      {
        name: "fk_inspection_file_part",
        using: "BTREE",
        fields: [
          { name: "vehicule_part_id" },
        ]
      },
    ]
  });
};
