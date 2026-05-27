module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Order_QA', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Order_Header', key: 'id' }
    },
    tech_comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    client_comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    qa_manager_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    decision: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: 'pending'
    },
    reject_observations: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    signature_s3_path: {
      type: DataTypes.STRING(500),
      allowNull: true
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
    tableName: 'Order_QA',
    timestamps: false
  });
};
