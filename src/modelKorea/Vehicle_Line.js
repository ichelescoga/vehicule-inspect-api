module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Vehicle_Line', {
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
    vehicle_brand_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Vehicle_Brand',
        key: 'id'
      }
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    update_date: {
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
    tableName: 'Vehicle_Line',
    timestamps: false
  });
};
