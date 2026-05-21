const express = require("express")
const router = express.Router()

router.get("/Cadastro/:nome/:cargo/:cor", function(req, res){
    res.send(
        "<h1>Olá " + req.params.nome + "</h1>" +
        "<h2>Seu cargo é: " + req.params.cargo + "</h2>" +
        "<h3>Sua cor favorita é: " + req.params.cor + "</h3>"
    )
})

module.exports = router