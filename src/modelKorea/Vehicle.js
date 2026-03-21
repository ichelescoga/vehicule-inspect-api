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
    linea: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    plate_id: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    vehicule_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Vehicle_Type',
        key: 'id'
      }
    },
    vehicule_brand_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Vehicle_Brand',
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
    transmision_type: {
      type: DataTypes.INTEGER,
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
        name: "vehiculeType_idx",
        using: "BTREE",
        fields: [
          { name: "vehicule_type_id" },
        ]
      },
      {
        name: "vehiculeVehiculeBrand_idx",
        using: "BTREE",
        fields: [
          { name: "vehicule_brand_id" },
        ]
      },
    ]
  });
};
