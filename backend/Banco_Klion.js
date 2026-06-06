const Sequelize = require('sequelize')
const sequelize = new Sequelize('banco_teste_klion', 'root', '06132024Mi!', {
    host: "localhost",
    dialect: 'mysql'
})

// sync centralizado - atualiza todas as tabelas em ordem
sequelize.sync({ alter: true }).then(() => {
    console.log("Banco sincronizado!")
})

//exportação do app
module.exports = sequelize