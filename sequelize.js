const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

async function init(onError, onSuccess) {
    try {
        await sequelize.authenticate()
        onSuccess()
    }
    catch (err) {
        onError(err)
    }
}

module.exports = { init }