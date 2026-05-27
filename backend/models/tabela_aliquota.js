const sequelize = require("../Banco_Klion")
const Sequelize = require("sequelize")

const TabelaAliquota = sequelize.define("tabela_aliquota", {
    id_tabela_aliquota: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    faixa: {
        type: Sequelize.INTEGER
    },
    limite_reais: {
        type: Sequelize.STRING(20)
    },
    aliquota: {
        type: Sequelize.STRING(6)
    }
}, {
    tableName: "tabela_aliquota",
    timestamps: false
})

module.exports = TabelaAliquota