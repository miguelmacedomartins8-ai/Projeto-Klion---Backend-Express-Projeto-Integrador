const express = require("express")
const router = express.Router()
const Usuario = require("../models/Usuario")
const nodemailer = require("nodemailer") //envia o email
const bcrypt = require("bcrypt") //criptografa a senha
const crypto = require("crypto") //gera o token

// configuração do email
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "miguelmacedomartins8@gmail.com",    
        pass: "unhouzeloedgddbi"       
    }
})

// ROTA 1 - recebe o email e manda o link
router.post("/esqueci-senha", async function(req, res){
    const { email } = req.body

    const usuario = await Usuario.findOne({ where: { email } })

    if(!usuario){
        return res.json({ mensagem: "Email não encontrado!" })
    }

    // gera um token aleatório
    const token = crypto.randomBytes(32).toString("hex")

    // salva o token no banco
    await usuario.update({ tokenRecuperacao: token })

    // monta o link de recuperação
    const link = `http://localhost:2026/nova-senha.html?token=${token}`

    // envia o email
    await transporter.sendMail({
        from: "miguelmacedomartins8@gmail.com",
        to: email,
        subject: "Recuperação de senha - Klion",
        html: `
            <h1>Recuperação de senha</h1>
            <p>Clique no link abaixo para redefinir sua senha:</p>
            <a href="${link}">${link}</a>
            <p>Este link expira em 1 hora.</p>
        `
    })

    res.json({ mensagem: "Email de recuperação enviado!" })
})

// rota 2 - recebe o token e a nova senha
router.post("/nova-senha", async function(req, res){
    const { token, novaSenha } = req.body

    // busca o usuário pelo token
    const usuario = await Usuario.findOne({ where: { tokenRecuperacao: token } })

    if(!usuario){
        return res.json({ mensagem: "Token inválido!" })
    }

    // criptografa a nova senha
    const senhaCriptografada = await bcrypt.hash(novaSenha, 10)

    // atualiza a senha e limpa o token
    await usuario.update({
        senha: senhaCriptografada,
        tokenRecuperacao: null
    })

    res.json({ mensagem: "Senha alterada com sucesso!" })
})

module.exports = router