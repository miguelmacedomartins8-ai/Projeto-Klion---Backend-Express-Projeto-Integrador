document.addEventListener("DOMContentLoaded", function () {

    const btnIcon     = document.getElementById("btnUserIcon")
    const dropdown    = document.getElementById("userDropdown")
    const dropNome    = document.getElementById("dropNome")
    const dropEmail   = document.getElementById("dropEmail")
    const dropAvatar  = document.getElementById("dropAvatar")
    const btnHistorico= document.getElementById("btnHistorico")
    const btnSair     = document.getElementById("btnSair")

    const modalHistorico = document.getElementById("modalHistorico")
    const btnFecharHist  = document.getElementById("btnFecharHistorico")

    if (!btnIcon) return  // segurança: se o HTML não tiver o menu, sai

    const token = localStorage.getItem("token")

    btnIcon.addEventListener("click", async function (e) {
        e.stopPropagation()

        if (!token) {
            window.location.href = "./login.html"
            return
        }

        // Alterna aberto/fechado
        const jaAberto = dropdown.classList.contains("aberto")
        fecharDropdown()
        if (jaAberto) return

        // Busca dados do perfil se ainda não carregou
        if (!dropNome.textContent || dropNome.textContent.trim() === "Carregando...") {
            await carregarPerfil()
        }

        dropdown.classList.add("aberto")
    })

    // Fecha ao clicar fora
    document.addEventListener("click", fecharDropdown)
    dropdown.addEventListener("click", function (e) { e.stopPropagation() })

    if (btnHistorico) {
        btnHistorico.addEventListener("click", function () {
            fecharDropdown()
            abrirHistorico()
        })
    }

    if (btnSair) {
        btnSair.addEventListener("click", function () {
            localStorage.removeItem("token")
            window.location.href = "./login.html"
        })
    }

    if (btnFecharHist) {
        btnFecharHist.addEventListener("click", function () {
            modalHistorico.classList.remove("aberto")
        })
    }

    if (modalHistorico) {
        modalHistorico.addEventListener("click", function (e) {
            if (e.target === modalHistorico) modalHistorico.classList.remove("aberto")
        })
    }

    function fecharDropdown() {
        if (dropdown) dropdown.classList.remove("aberto")
    }

    async function carregarPerfil() {
        try {
            const res  = await fetch("/meu-perfil", {
                headers: { "authorization": token }
            })
            const data = await res.json()

            if (data.nome) {
                dropNome.textContent  = data.nome
                dropEmail.textContent = data.email
                // Inicial do nome no avatar
                dropAvatar.textContent = data.nome.charAt(0).toUpperCase()
            }
        } catch (err) {
            console.error("Erro ao carregar perfil:", err)
        }
    }

    async function abrirHistorico() {
        if (!modalHistorico) return

        // Limpa conteúdo anterior
        document.getElementById("histDadosSalvos").innerHTML = "<p style='color:#888;font-size:0.85rem'>Carregando...</p>"
        document.getElementById("histListaCalculos").innerHTML = ""

        modalHistorico.classList.add("aberto")

        try {
            // Busca dados salvos e histórico em paralelo
            const [resDados, resHist] = await Promise.all([
                fetch("/info-usuario",  { headers: { "authorization": token } }),
                fetch("/calcular",      { headers: { "authorization": token } })
            ])

            const dados     = await resDados.json()
            const historico = await resHist.json()

            renderDadosSalvos(dados)
            renderHistorico(historico)

        } catch (err) {
            document.getElementById("histDadosSalvos").innerHTML = "<p style='color:#dc2626'>Erro ao carregar dados.</p>"
        }
    }

    function renderDadosSalvos(dados) {
        const el = document.getElementById("histDadosSalvos")

        if (!dados || !dados.renda_anual) {
            el.innerHTML = "<p style='color:#888;font-size:0.85rem'>Nenhum dado financeiro salvo ainda.</p>"
            return
        }

        el.innerHTML = `
            <div class="historico-dados-row">
                <span>Renda Anual:</span>
                <span>${formatCurrency(parseFloat(dados.renda_anual))}</span>
            </div>
            <div class="historico-dados-row">
                <span>Deduções:</span>
                <span>${formatCurrency(parseFloat(dados.deducoes || 0))}</span>
            </div>
            <div class="historico-dados-row">
                <span>Dependentes:</span>
                <span>${dados.dependentes || 0}</span>
            </div>
        `
    }

    function renderHistorico(historico) {
        const el = document.getElementById("histListaCalculos")

        if (!historico || historico.length === 0) {
            el.innerHTML = "<p class='historico-vazio'>Nenhum cálculo realizado ainda.</p>"
            return
        }

        el.innerHTML = historico.map(function (item, i) {
            return `
                <div class="historico-card">
                    <div class="historico-card-row">
                        <span>Cálculo #${historico.length - i}</span>
                        <strong>ID ${item.id}</strong>
                    </div>
                    <div class="historico-card-row">
                        <span>Base de Cálculo:</span>
                        <strong>${formatCurrency(parseFloat(item.base_calculo))}</strong>
                    </div>
                    <div class="historico-card-row">
                        <span>Imposto Estimado:</span>
                        <strong>${formatCurrency(parseFloat(item.imposto_estimado))}</strong>
                    </div>
                    <div class="historico-card-row">
                        <span>Alíquota Efetiva:</span>
                        <strong>${item.aliquota_efetiva}</strong>
                    </div>
                    <div class="historico-card-row">
                        <span>Renda Líquida:</span>
                        <strong>${formatCurrency(parseFloat(item.renda_liquida))}</strong>
                    </div>
                </div>
            `
        }).join("")
    }

    function formatCurrency(value) {
        return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    }
})
