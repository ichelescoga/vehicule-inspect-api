const { Sequelize } = require('sequelize');
const { database } = require('./config');
const {mysql} = require('mysql2')
    
const sequelize = new Sequelize(
    database.database,
    database.username,
    database.password,
    {
        host:database.host,
        port: 3306,
        dialect:"mysql",
        dialectModule: mysql,
        logging: console.log,
        encrypt: false
    }
);

module.exports = sequelize;