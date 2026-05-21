const express = require("express")
const path = require("path")
const app = express()

// Banco
require("./Banco_Klion")

// Middlewares
app.use(express.json())
app.use(express.static(path.join(__dirname, "html")))

// Rotas
app.use(require("./routes/paginaPrincipal"))
app.use(require("./routes/cadastroRoutes"))
app.use(require("./routes/postagemRoutes"))
app.use(require("./routes/usuarioRoutes"))
app.use(require("./routes/recuperacaoRoutes"))

app.listen(2026, function(){
    console.log("Servidor Rodando na url http://localhost:2026")
})