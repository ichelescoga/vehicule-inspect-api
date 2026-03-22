module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Order_Signature', {
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
    s3_path: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    stored_name: {
      type: DataTypes.STRING(255),
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
    tableName: 'Order_Signature',
    timestamps: false
  });
};
