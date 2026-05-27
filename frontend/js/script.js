document.addEventListener("DOMContentLoaded", function () {

    const formCalc    = document.querySelector("form.form-calculadora")
    const inpRenda    = document.getElementById("rendaAno")
    const inpDeducao  = document.getElementById("deducao")
    const inpDep      = document.getElementById("dependente")
    const errorEl     = document.getElementById("form-error")
    const badge       = document.getElementById("badge-status")

    const modalOverlay    = document.getElementById("modalDados")
    const btnAbrirModal   = document.getElementById("btnAbrirModal")
    const btnFecharModal  = document.getElementById("btnFecharModal")
    const btnCancelarModal= document.getElementById("btnCancelarModal")
    const btnSalvarModal  = document.getElementById("btnSalvarModal")
    const modalStatus     = document.getElementById("modal-status")
    const modalRenda      = document.getElementById("modal-renda")
    const modalDeducoes   = document.getElementById("modal-deducoes")
    const modalDep        = document.getElementById("modal-dependentes")

    carregarDadosUsuario()

    btnAbrirModal.addEventListener("click", abrirModal)
    btnFecharModal.addEventListener("click", fecharModal)
    btnCancelarModal.addEventListener("click", fecharModal)

    // Fechar clicando fora da caixa
    modalOverlay.addEventListener("click", function (e) {
        if (e.target === modalOverlay) fecharModal()
    })

    btnSalvarModal.addEventListener("click", salvarDadosModal)

    if (formCalc) {
        formCalc.addEventListener("submit", function (e) {
            e.preventDefault()
            calcular()
        })
    }

    // Busca dados do usuário e preenche a calculadora
    async function carregarDadosUsuario() {
        const token = localStorage.getItem("token")
        if (!token) return  // não logado, não faz nada

        try {
            const res  = await fetch("/info-usuario", {
                headers: { "authorization": token }
            })
            const data = await res.json()

            if (data && data.renda_anual) {
                // Preenche os campos da calculadora
                inpRenda.value   = data.renda_anual
                inpDeducao.value = data.deducoes   || 0
                inpDep.value     = data.dependentes || 0

                // Preenche também o modal (para edição)
                modalRenda.value    = data.renda_anual
                modalDeducoes.value = data.deducoes   || 0
                modalDep.value      = data.dependentes || 0

                // Badge verde
                atualizarBadge(true)
            } else {
                // Sem dados salvos → badge amarelo
                atualizarBadge(false)
            }
        } catch (err) {
            console.error("Erro ao buscar dados:", err)
        }
    }

    // Atualiza o badge de status
    function atualizarBadge(temDados) {
        if (temDados) {
            badge.className = "badge-dados tem-dados"
            badge.textContent = "✅ Dados salvos"
        } else {
            badge.className = "badge-dados sem-dados"
            badge.textContent = "⚠️ Sem dados salvos — clique em Meus Dados"
        }
    }

    // Abre o modal
    function abrirModal() {
        modalStatus.textContent = ""
        modalStatus.className   = "modal-status"
        modalOverlay.classList.add("aberto")
    }

    // Fecha o modal
    function fecharModal() {
        modalOverlay.classList.remove("aberto")
    }

    // Salva os dados do modal no backend e preenche a calculadora
    async function salvarDadosModal() {
        const token = localStorage.getItem("token")

        if (!token) {
            alert("Você precisa estar logado!")
            window.location.href = "./login.html"
            return
        }

        const renda      = modalRenda.value
        const deducoes   = modalDeducoes.value   || 0
        const dependentes = modalDep.value        || 0

        if (!renda || parseFloat(renda) <= 0) {
            mostrarStatusModal("⚠️ Informe uma renda anual válida.", "erro")
            return
        }

        btnSalvarModal.textContent = "Salvando..."
        btnSalvarModal.disabled    = true

        try {
            const res  = await fetch("/info-usuario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                },
                body: JSON.stringify({ renda_anual: renda, deducoes, dependentes })
            })
            const data = await res.json()

            // Atualiza os campos da calculadora com os novos dados
            inpRenda.value   = renda
            inpDeducao.value = deducoes
            inpDep.value     = dependentes

            atualizarBadge(true)
            mostrarStatusModal("✅ " + data.mensagem, "sucesso")

            // Fecha o modal automaticamente após 1.5s
            setTimeout(fecharModal, 1500)

        } catch (err) {
            mostrarStatusModal("❌ Erro ao salvar. Tente novamente.", "erro")
        } finally {
            btnSalvarModal.textContent = "💾 Salvar Dados"
            btnSalvarModal.disabled    = false
        }
    }

    // Mostra mensagem de status no modal
    function mostrarStatusModal(msg, tipo) {
        modalStatus.textContent = msg
        modalStatus.className   = "modal-status " + tipo
    }

    // Faz o cálculo chamando o backend
    async function calcular() {
        const token = localStorage.getItem("token")

        if (!token) {
            alert("Você precisa estar logado para usar a calculadora!")
            window.location.href = "./login.html"
            return
        }

        const renda     = inpRenda.value
        const deducao   = inpDeducao.value  || 0
        const dependente= inpDep.value      || 0

        errorEl.textContent = ""

        if (!renda || parseFloat(renda) <= 0) {
            errorEl.textContent = "Por favor, informe uma renda anual maior que zero."
            return
        }

        // Garante que os dados mais recentes dos campos estão salvos antes de calcular
        await fetch("/info-usuario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            },
            body: JSON.stringify({
                renda_anual: renda,
                deducoes: deducao,
                dependentes: dependente
            })
        })

        // Chama o cálculo
        const resCalculo = await fetch("/calcular", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        })

        const dataCalculo = await resCalculo.json()

        if (dataCalculo.resultado) {
            const r = dataCalculo.resultado
            document.getElementById("resultado-base").textContent     = formatCurrency(parseFloat(r.base_calculo))
            document.getElementById("resultado-imposto").textContent  = formatCurrency(parseFloat(r.imposto_estimado))
            document.getElementById("resultado-aliquota").textContent = r.aliquota_efetiva
            document.getElementById("resultado-liquida").textContent  = formatCurrency(parseFloat(r.renda_liquida))
            atualizarBadge(true)
        } else {
            errorEl.textContent = dataCalculo.mensagem || "Erro ao calcular."
        }
    }

    // Formata valor em BRL
    function formatCurrency(value) {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
    }
})