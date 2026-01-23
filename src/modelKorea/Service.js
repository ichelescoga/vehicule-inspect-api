const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Service', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    service_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Service_Option',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'Service',
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
        name: "serviceOption_idx",
        using: "BTREE",
        fields: [
          { name: "service_type_id" },
        ]
      },
    ]
  });
};
