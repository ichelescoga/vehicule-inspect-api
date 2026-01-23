const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Vehicle', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    model: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    plate_id: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    color: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    vehicule_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Vehicule_Type',
        key: 'id'
      }
    },
    vehicule_brand_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Vehicule_Brand',
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
    }
  }, {
    sequelize,
    tableName: 'Vehicle',
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
        name: "vehiculeBrand_idx",
        using: "BTREE",
        fields: [
          { name: "vehicule_brand_id" },
        ]
      },
      {
        name: "vehiculeType_idx",
        using: "BTREE",
        fields: [
          { name: "vehicule_type_id" },
        ]
      },
    ]
  });
};
