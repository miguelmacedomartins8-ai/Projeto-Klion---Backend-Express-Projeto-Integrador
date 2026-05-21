const express = require("express")
const router = express.Router()
const Postagem = require("../models/Postagem")
const autenticar = require("../middlewares/autenticacao") 

router.post("/postagem", autenticar, async function(req, res){
    const { titulo, Conteudo } = req.body
    const nova = await Postagem.create({ titulo, Conteudo })
    res.json(nova)
})

router.get("/postagem", async function(req, res){
    const postagens = await Postagem.findAll()
    res.json(postagens)
})

module.exports = router