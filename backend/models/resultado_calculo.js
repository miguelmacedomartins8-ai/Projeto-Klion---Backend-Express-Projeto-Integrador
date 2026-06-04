const sequelize = require("../Banco_Klion")
const Sequelize = require("sequelize")
const Usuario = require("./Usuario")

const ResultadoCalculo = sequelize.define("resultado_calculo", {
    id_resultado_calculo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    base_calculo: {
        type: Sequelize.DECIMAL(9, 2)
    },
    imposto_estimado: {
        type: Sequelize.DECIMAL(9, 2)
    },
    aliquota_efetiva: {
        type: Sequelize.STRING(6)
    },
    renda_liquida: {
        type: Sequelize.DECIMAL(9, 2)
    },
    fk_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Usuario,
            key: "id_usuario"
        }
    }
}, {
    tableName: "resultado_calculo",
    timestamps: false
})

ResultadoCalculo.belongsTo(Usuario, { foreignKey: "fk_id" })
Usuario.hasMany(ResultadoCalculo, { foreignKey: "fk_id" })

module.exports = ResultadoCalculo