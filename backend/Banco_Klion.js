const Sequelize = require('sequelize')
const sequelize = new Sequelize('klion_data', 'root', '06132024Mi!', {
    host: "localhost",
    dialect: 'mysql'
})

// sync centralizado - atualiza todas as tabelas em ordem
sequelize.sync({ alter: true }).then(() => {
    console.log("Banco sincronizado!")
})

//exportação do app
module.exports = sequelize