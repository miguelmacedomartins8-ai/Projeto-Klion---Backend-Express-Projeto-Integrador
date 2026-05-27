const express = require("express")
const router = express.Router()
const Usuario = require("../models/Usuario")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const autenticar = require("../middlewares/autenticacao")

const SEGREDO = "klion123"

// CADASTRO
router.post("/cadastro", async function(req, res){
    const { nome, email, senha } = req.body
    const senhaCriptografada = await bcrypt.hash(senha, 10)
    await Usuario.create({ nome, email, senha: senhaCriptografada })
    res.json({ mensagem: "Usuário cadastrado com sucesso!" })
})

// LOGIN
router.post("/login", async function(req, res){
    const { email, senha } = req.body
    const usuario = await Usuario.findOne({ where: { email } })

    if(!usuario){
        return res.json({ mensagem: "Email não encontrado!" })
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if(!senhaCorreta){
        return res.json({ mensagem: "Senha incorreta!" })
    }

    const token = jwt.sign({ id: usuario.id }, SEGREDO)
    res.json({ mensagem: "Login feito com sucesso!", token })
})

// GET /meu-perfil — retorna nome e email do usuário logado
router.get("/meu-perfil", autenticar, async function(req, res){
    const usuario = await Usuario.findOne({
        where: { id: req.usuarioId },
        attributes: ["nome", "email"]
    })

    if(!usuario){
        return res.json({ mensagem: "Usuário não encontrado!" })
    }

    res.json({ nome: usuario.nome, email: usuario.email })
})

module.exports = router
