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


module.exports = Postagem