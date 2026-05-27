const sequelize = require("../Banco_Klion")
const Sequelize = require("sequelize")
const Usuario = require("./Usuario")

const InfoUsuarioCalculo = sequelize.define("infi_usuario_calculo", {
    renda_anual: {
        type: Sequelize.DECIMAL(9, 2)
    },
    deducoes: {
        type: Sequelize.DECIMAL(9, 2)
    },
    dependentes: {
        type: Sequelize.INTEGER
    },
    fk_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Usuario,
            key: "id"
        }
    }
}, {
    tableName: "info_usuario_calculo"
})

InfoUsuarioCalculo.belongsTo(Usuario, { foreignKey: "fk_id" })
Usuario.hasMany(InfoUsuarioCalculo, { foreignKey: "fk_id" })

module.exports = InfoUsuarioCalculo