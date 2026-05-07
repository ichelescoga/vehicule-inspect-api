const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Order_Comment', {
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
    main_symptom: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    when_cold: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    },
    when_hot: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    },
    when_running: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    },
    when_idle: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    },
    when_intermittent: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    },
    since_when: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    previously_repaired: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    },
    repair_detail: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dashboard_light: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    },
    dashboard_light_which: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    urgency_level: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: 'BAJO'
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
    tableName: 'Order_Comment',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id" }]
      },
      {
        name: "idx_oc_order",
        using: "BTREE",
        fields: [{ name: "order_id" }]
      },
    ]
  });
};
