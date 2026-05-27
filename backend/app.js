const express = require("express")
const path = require("path")
const app = express()

// Banco
require("./Banco_Klion")
require("./models/info_usuario_calculo")
require("./models/resultado_calculo")
require("./models/tabela_aliquota")

// Middlewares
app.use(express.json())
app.use(express.static(path.join(__dirname, "../frontend")))

// Rotas
app.use(require("./routes/paginaPrincipal"))
app.use(require("./routes/usuarioRoutes"))
app.use(require("./routes/recuperacaoRoutes"))
app.use(require("./routes/calculadoraRoutes"))
app.use(require("./routes/aliquotaRoutes"))

app.listen(2026, function(){
    console.log("Servidor Rodando na url http://localhost:2026")
})