const sequelize = require("../Banco_Klion")
const Sequelize = require("sequelize")

const Usuario = sequelize.define("Usuario", {
    id_usuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    senha: {
        type: Sequelize.STRING // vai guardar a senha criptografada
    },
    tokenRecuperacao: {
        type: Sequelize.STRING
    }
})

module.exports = Usuario