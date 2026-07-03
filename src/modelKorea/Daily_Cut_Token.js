module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Daily_Cut_Token', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true
    },
    cut_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'Daily_Cut_Token',
    timestamps: false
  });
};
