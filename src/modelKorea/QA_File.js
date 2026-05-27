module.exports = function(sequelize, DataTypes) {
  return sequelize.define('QA_File', {
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
    qa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Order_QA', key: 'id' }
    },
    file_label: {
      type: DataTypes.STRING(50),
      allowNull: true
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
    tableName: 'QA_File',
    timestamps: false
  });
};
