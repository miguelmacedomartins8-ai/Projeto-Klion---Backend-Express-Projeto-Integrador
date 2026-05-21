const sequelize = require("../Banco_Klion")
const Sequelize = require("sequelize")

const Usuario = sequelize.define("Usuario", {
    nome: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    senha: {
        type: Sequelize.STRING  // vai guardar a senha criptografada
    },
    tokenRecuperacao: { 
        type: Sequelize.STRING
    }
})

Usuario.sync({ alter: true })

module.exports = Usuario