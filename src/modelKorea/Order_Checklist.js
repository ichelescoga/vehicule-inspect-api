const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Order_Checklist', {
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
    // NIVELES GENERALES
    oil_motor: { type: DataTypes.STRING(4), allowNull: true },
    oil_gearbox: { type: DataTypes.STRING(4), allowNull: true },
    oil_mechanical: { type: DataTypes.STRING(4), allowNull: true },
    oil_steering: { type: DataTypes.STRING(4), allowNull: true },
    oil_differential: { type: DataTypes.STRING(4), allowNull: true },
    coolant: { type: DataTypes.STRING(4), allowNull: true },
    windshield_fluid: { type: DataTypes.STRING(4), allowNull: true },
    brake_fluid: { type: DataTypes.STRING(4), allowNull: true },
    car_wash: { type: DataTypes.STRING(4), allowNull: true },
    // AROS Y NEUMATICOS
    bolts: { type: DataTypes.STRING(4), allowNull: true },
    studs: { type: DataTypes.STRING(4), allowNull: true },
    bolts_torqued: { type: DataTypes.STRING(4), allowNull: true },
    rim_caps: { type: DataTypes.STRING(4), allowNull: true },
    rim_condition: { type: DataTypes.STRING(4), allowNull: true },
    tire_condition: { type: DataTypes.STRING(4), allowNull: true },
    spare_tire: { type: DataTypes.STRING(4), allowNull: true },
    tools: { type: DataTypes.STRING(4), allowNull: true },
    // ACCESORIOS Y TESTIGOS
    check_engine: { type: DataTypes.STRING(4), allowNull: true },
    abs_light: { type: DataTypes.STRING(4), allowNull: true },
    airbag_light: { type: DataTypes.STRING(4), allowNull: true },
    tpms_light: { type: DataTypes.STRING(4), allowNull: true },
    anti_skid: { type: DataTypes.STRING(4), allowNull: true },
    other_lights: { type: DataTypes.STRING(4), allowNull: true },
    other_lights_detail: { type: DataTypes.STRING(255), allowNull: true },
    // CONFIRMACION
    spare_parts_delivered: { type: DataTypes.TINYINT, allowNull: true, defaultValue: 0 },
    // DATOS ADICIONALES
    invoice_number: { type: DataTypes.STRING(50), allowNull: true },
    delivery_time: { type: DataTypes.STRING(50), allowNull: true },
    observations: { type: DataTypes.TEXT, allowNull: true },
    create_date: { type: DataTypes.DATE, allowNull: true },
    status: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 }
  }, {
    sequelize,
    tableName: 'Order_Checklist',
    timestamps: false,
    indexes: [
      { name: "PRIMARY", unique: true, using: "BTREE", fields: [{ name: "id" }] },
      { name: "idx_checklist_order", using: "BTREE", fields: [{ name: "order_id" }] },
    ]
  });
};
