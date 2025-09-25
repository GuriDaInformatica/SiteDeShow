// Script simples de seleção de assentos/setores

(function () {
  const MAX = 20;

  // Elementos
  const setores = document.querySelectorAll(".setor");
  const assentosBox = document.getElementById("assentosID");
  const qtdDisplay = document.getElementById("quantidadeDisplay");
  const btnAdd = document.getElementById("botaodeadd");
  const btnRmv = document.getElementById("botaodermv");
  const resumoSetor = document.getElementById("resumoSetor");
  const resumoIngresso = document.getElementById("resumoIngresso");
  const resumoValor = document.getElementById("resumoIngressoValor");
  const resumoTotal = document.getElementById("valorTotal");
  const qtdBox = document.getElementById("quantidadeAssentos");
  const confirmar = document.getElementById("confirmarBtn");

  // Estado
  let setor = null;
  let preco = 0;
  let quantidade = 0;
  let selecionados = [];

  // Função util
  function moeda(v) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  // Atualiza resumo
  function atualizar() {
    const total = setor && setor.tipo === "mapa" ? selecionados.length : quantidade;
    resumoSetor.textContent = setor ? setor.nome : "Nenhum setor";
    resumoIngresso.textContent = total > 0 ? total + " ingresso(s)" : "Nenhum ingresso";
    resumoValor.textContent = preco ? moeda(preco) : moeda(0);
    resumoTotal.textContent = moeda(preco * total);
    qtdDisplay.textContent = quantidade;
  }

  // Cria mapa simples de assentos
  function criarMapa(linhas, colunas) {
    assentosBox.innerHTML = "";
    for (let l = 1; l <= linhas; l++) {
      for (let c = 1; c <= colunas; c++) {
        const id = l + "-" + c;
        const div = document.createElement("div");
        div.className = "assento livre";
        div.textContent = id;
        div.addEventListener("click", () => {
          if (div.classList.contains("selecionado")) {
            div.classList.remove("selecionado");
            selecionados = selecionados.filter(s => s !== id);
          } else {
            if (selecionados.length >= MAX) {
              alert("Máximo de " + MAX);
              return;
            }
            div.classList.add("selecionado");
            selecionados.push(id);
          }
          atualizar();
        });
        assentosBox.appendChild(div);
      }
    }
  }

  // Escolha de setor
  setores.forEach(s => {
    s.addEventListener("click", () => {
      setores.forEach(x => x.classList.remove("selecionado"));
      s.classList.add("selecionado");

      setor = { 
        nome: s.querySelector("h4").textContent, 
        preco: parseFloat(s.dataset.preco), 
        tipo: s.dataset.tipo 
      };
      preco = setor.preco;

      quantidade = 0;
      selecionados = [];

      if (setor.tipo === "mapa") {
        qtdBox.style.display = "none";
        criarMapa(5, 8); // cria um mapa 5x8 fixo
      } else {
        qtdBox.style.display = "block";
        assentosBox.innerHTML = "";
      }

      atualizar();
    });
  });

  // Botões quantidade
  btnAdd.addEventListener("click", () => {
    if (!setor) { alert("Escolha o setor!"); return; }
    if (quantidade >= MAX) return;
    quantidade++;
    atualizar();
  });
  btnRmv.addEventListener("click", () => {
    if (quantidade > 0) quantidade--;
    atualizar();
  });

  // Confirmar
  confirmar.addEventListener("click", () => {
    const total = setor && setor.tipo === "mapa" ? selecionados.length : quantidade;
    if (!setor || total === 0) {
      alert("Selecione setor e ingressos!");
      return;
    }
    alert("Compra confirmada!\nSetor: " + setor.nome + "\nIngressos: " + total + "\nTotal: " + moeda(preco * total));
    // reset simples
    location.reload();
  });

  atualizar();
})();
