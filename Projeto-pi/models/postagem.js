const sequelize = require("../Banco_Klion")
const Sequelize = require('sequelize')

const Postagem = sequelize.define('Postagem', {
    titulo: {
        type: Sequelize.STRING
    },
    Conteudo: {
        type: Sequelize.TEXT
    }
})

Postagem.sync({ alter: true })

module.exports = Postagem