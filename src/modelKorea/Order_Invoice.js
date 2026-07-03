module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Order_Invoice', {
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
    invoice_number: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    invoice_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    amount_without_iva: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    amount_with_iva: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    s3_path: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'Order_Invoice',
    timestamps: false
  });
};
