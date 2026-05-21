const Sequelize = require('sequelize')
const sequelize = new Sequelize('klion_data', 'root', '06132024Mi!', {
    host: "localhost",
    dialect: 'mysql'
})

//exportação do app
module.exports = sequelize