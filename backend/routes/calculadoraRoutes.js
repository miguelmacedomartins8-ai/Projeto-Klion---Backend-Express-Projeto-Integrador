const express = require("express")
const router = express.Router()
const autenticar = require("../middlewares/autenticacao")
const InfoUsuarioCalculo = require("../models/info_usuario_calculo")
const ResultadoCalculo = require("../models/resultado_calculo")
const TabelaAliquota = require("../models/tabela_aliquota")

// POST /info-usuario — salva os dados do formulário
router.post("/info-usuario", autenticar, async function(req, res) {
    const { renda_anual, deducoes, dependentes } = req.body
    const fk_id = req.usuarioId

    // verifica se já existe registro para esse usuário
    const existente = await InfoUsuarioCalculo.findOne({ where: { fk_id } })

    if (existente) {
        // atualiza se já existir
        await existente.update({ renda_anual, deducoes, dependentes })
        return res.json({ mensagem: "Dados atualizados com sucesso!" })
    }

    // cria novo registro
    await InfoUsuarioCalculo.create({ renda_anual, deducoes, dependentes, fk_id })
    res.json({ mensagem: "Dados salvos com sucesso!" })
})

// GET /info-usuario — busca os dados do usuário logado
router.get("/info-usuario", autenticar, async function(req, res) {
    const fk_id = req.usuarioId

    const info = await InfoUsuarioCalculo.findOne({ where: { fk_id } })

    if (!info) {
        return res.json(null)
    }

    res.json(info)
})

// POST /calcular — busca os dados do usuário e calcula automaticamente
router.post("/calcular", autenticar, async function(req, res) {
    const fk_id = req.usuarioId  // pega o id do token automaticamente

    // busca os dados do usuário na tabela info_usuario_calculo
    const infoUsuario = await InfoUsuarioCalculo.findOne({ where: { fk_id } })

    if(!infoUsuario){
        return res.json({ mensagem: "Você precisa preencher seus dados financeiros primeiro!" })
    }

    const { renda_anual, deducoes, dependentes } = infoUsuario

    // busca as alíquotas do banco
    const aliquotas = await TabelaAliquota.findAll({
        order: [["faixa", "ASC"]]
    })

    if(aliquotas.length === 0){
        return res.json({ mensagem: "Tabela de alíquotas não encontrada!" })
    }

    // faz o cálculo...
    const deducaoDependentes = parseInt(dependentes) * 2275.08
    const base_calculo = parseFloat(renda_anual) - parseFloat(deducoes) - deducaoDependentes

    let imposto = 0

    for(let i = 0; i < aliquotas.length; i++){
        const faixaAtual = aliquotas[i]
        const faixaAnterior = aliquotas[i - 1]
        const limiteAtual = parseFloat(faixaAtual.limite_reais)
        const limiteAnterior = faixaAnterior ? parseFloat(faixaAnterior.limite_reais) : 0
        const aliquotaDecimal = parseFloat(faixaAtual.aliquota) / 100

        if(base_calculo <= limiteAtual || i === aliquotas.length - 1){
            imposto += Math.max(0, base_calculo - limiteAnterior) * aliquotaDecimal
            break
        } else {
            imposto += (limiteAtual - limiteAnterior) * aliquotaDecimal
        }
    }

    const aliquota_efetiva = base_calculo > 0
        ? ((imposto / base_calculo) * 100).toFixed(2) + "%"
        : "0%"

    const renda_liquida = parseFloat(renda_anual) - imposto

    // salva o resultado
    await ResultadoCalculo.create({
        base_calculo: base_calculo.toFixed(2),
        imposto_estimado: imposto.toFixed(2),
        aliquota_efetiva,
        renda_liquida: renda_liquida.toFixed(2),
        fk_id
    })

    res.json({
        mensagem: "Cálculo realizado com sucesso!",
        resultado: {
            base_calculo: base_calculo.toFixed(2),
            imposto_estimado: imposto.toFixed(2),
            aliquota_efetiva,
            renda_liquida: renda_liquida.toFixed(2)
        }
    })
})

// GET /calcular — busca histórico de cálculos do usuário
router.get("/calcular", autenticar, async function(req, res) {
    const fk_id = req.usuarioId

    const historico = await ResultadoCalculo.findAll({
        where: { fk_id },
        order: [["id", "DESC"]]
    })

    res.json(historico)
})

module.exports = router