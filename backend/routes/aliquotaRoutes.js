const express = require("express")
const router = express.Router()
const TabelaAliquota = require("../models/tabela_aliquota")

// POST /aliquota — cadastra uma nova alíquota
router.post("/aliquota", async function(req, res){
    const { faixa, limite_reais, aliquota } = req.body

    const nova = await TabelaAliquota.create({
        faixa,
        limite_reais,
        aliquota
    })

    res.json({ mensagem: "Alíquota cadastrada com sucesso!", nova })
})

// GET /aliquota — lista todas as alíquotas ordenadas por faixa
router.get("/aliquota", async function(req, res){
    const aliquotas = await TabelaAliquota.findAll({
        order: [["faixa", "ASC"]]
    })

    res.json(aliquotas)
})

// PUT /aliquota/:id — atualiza uma alíquota existente
router.put("/aliquota/:id", async function(req, res){
    const { faixa, limite_reais, aliquota } = req.body

    const registro = await TabelaAliquota.findByPk(req.params.id)

    if(!registro){
        return res.json({ mensagem: "Alíquota não encontrada!" })
    }

    await registro.update({ faixa, limite_reais, aliquota })
    res.json({ mensagem: "Alíquota atualizada com sucesso!" })
})

// DELETE /aliquota/:id — deleta uma alíquota
router.delete("/aliquota/:id", async function(req, res){
    const registro = await TabelaAliquota.findByPk(req.params.id)

    if(!registro){
        return res.json({ mensagem: "Alíquota não encontrada!" })
    }

    await registro.destroy()
    res.json({ mensagem: "Alíquota deletada com sucesso!" })
})

module.exports = router