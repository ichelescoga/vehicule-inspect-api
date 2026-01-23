const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Client', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    bill_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    nit: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    office_cel: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    residence_cel: {
      type: DataTypes.STRING(45),
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
    tableName: 'Client',
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
    ]
  });
};
