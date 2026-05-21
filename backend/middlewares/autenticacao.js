// middlewares/autenticacao.js
const jwt = require("jsonwebtoken")

const SEGREDO = "klion123"

function autenticar(req, res, next){
    const token = req.headers["authorization"]

    if(!token){
        return res.json({ mensagem: "Acesso negado! Faça login." })
    }

    try {
        const dados = jwt.verify(token, SEGREDO)
        req.usuarioId = dados.id
        next()
    } catch(erro) {
        return res.json({ mensagem: "Token inválido!" })
    }
}

module.exports = autenticar