const express = require("express")
const router = express.Router()
const Usuario = require("../models/Usuario")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const SEGREDO = "klion123" // palavra secreta para gerar o token

// CADASTRO
router.post("/cadastro", async function(req, res){
    const { nome, email, senha } = req.body

    // criptografa a senha antes de salvar
    const senhaCriptografada = await bcrypt.hash(senha, 10)

    const usuario = await Usuario.create({
        nome,
        email,
        senha: senhaCriptografada
    })

    res.json({ mensagem: "Usuário cadastrado com sucesso!" })
})

// LOGIN
router.post("/login", async function(req, res){
    const { email, senha } = req.body

    // busca o usuário pelo email
    const usuario = await Usuario.findOne({ where: { email } })

    if(!usuario){
        return res.json({ mensagem: "Email não encontrado!" })
    }

    // compara a senha digitada com a senha criptografada
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

    if(!senhaCorreta){
        return res.json({ mensagem: "Senha incorreta!" })
    }

    // gera o token de sessão
    const token = jwt.sign({ id: usuario.id }, SEGREDO)

    res.json({ mensagem: "Login feito com sucesso!", token })
})

module.exports = router