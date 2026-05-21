document.addEventListener("DOMContentLoaded", function() {
    
    const formCalculadora = document.querySelector('form.form-calculadora'); 

    if (formCalculadora) {
        
        formCalculadora.addEventListener('submit', function(event) {
            
            event.preventDefault(); 
            
            calcularImposto(); 
        });
    } else {
      console.error("Formulário da calculadora não encontrado!");
    }
});

const taxBrackets = [
  { limit: 20000, rate: 0.0 },
  { limit: 40000, rate: 0.075 },
  { limit: 60000, rate: 0.15 },
  { limit: Infinity, rate: 0.225 }
];

const DEDUCAO_POR_DEPENDENTE = 2000;

function calcularImposto() {
  const rendaAnoInput = document.getElementById("rendaAno");
  const deducaoInput = document.getElementById("deducao");
  const dependenteInput = document.getElementById("dependente");
  const errorEl = document.getElementById("form-error");

  const resultadoBase = document.getElementById("resultado-base");
  const resultadoImposto = document.getElementById("resultado-imposto");
  const resultadoAliquota = document.getElementById("resultado-aliquota");
  const resultadoLiquida = document.getElementById("resultado-liquida");

  if (!rendaAnoInput || !resultadoBase) {
    return;
  }

  errorEl.textContent = "";

  const income = parseFloat(rendaAnoInput.value.replace(",", ".")) || 0;
  const deductions = parseFloat(deducaoInput.value.replace(",", ".")) || 0;
  const dependents = parseInt(dependenteInput.value, 10) || 0;

  if (income <= 0) {
    errorEl.textContent = "Por favor, informe uma renda anual maior que zero.";
    limparResultados();
    return;
  }

  if (deductions < 0) {
    errorEl.textContent = "As deduções não podem ser negativas.";
    limparResultados();
    return;
  }

  if (dependents < 0) {
    errorEl.textContent = "O número de dependentes não pode ser negativo.";
    limparResultados();
    return;
  }

  const deducaoDependentes = dependents * DEDUCAO_POR_DEPENDENTE;
  const totalDeducoes = deductions + deducaoDependentes;

  let taxableIncome = income - totalDeducoes;
  if (taxableIncome < 0) taxableIncome = 0;

  const tax = calcularPorTabela(taxableIncome);
  const netIncome = income - tax;
  const effectiveRate = income > 0 ? (tax / income) * 100 : 0;

  resultadoBase.textContent = formatCurrency(taxableIncome);
  resultadoImposto.textContent = formatCurrency(tax);
  resultadoAliquota.textContent = effectiveRate.toFixed(2) + " %";
  resultadoLiquida.textContent = formatCurrency(netIncome);
}

function calcularPorTabela(taxableIncome) {
  let restante = taxableIncome;
  let imposto = 0;
  let faixaAnterior = 0;

  for (const faixa of taxBrackets) {
    const tetoFaixa = faixa.limit;

    const baseFaixa = Math.min(restante, tetoFaixa - faixaAnterior);
    if (baseFaixa <= 0) {
      faixaAnterior = tetoFaixa;
      continue;
    }

    imposto += baseFaixa * faixa.rate;
    restante -= baseFaixa;
    faixaAnterior = tetoFaixa;

    if (restante <= 0) break;
  }

  return imposto;
}

function limparResultados() {
  const rt = document.getElementById("resultado-base");
  const rtax = document.getElementById("resultado-imposto");
  const rr = document.getElementById("resultado-aliquota");
  const rn = document.getElementById("resultado-liquida");
  if (!rt) return;
  rt.textContent = "–";
  rtax.textContent = "–";
  rr.textContent = "–";
  rn.textContent = "–";
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}