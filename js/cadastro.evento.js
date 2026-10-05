const API_URL = "http://localhost:3000/api";
const formulario = document.getElementById("form-evento");
const selectPalestrante = document.getElementById("palestrante");
const titulo = document.getElementById("titulo-formulario");
const parametros = new URLSearchParams(window.location.search);
const idEvento = parametros.get("id");
 
async function iniciar() {
    await carregarPalestrantes();
 
    if (idEvento) {
        await carregarEventoParaEdicao(idEvento);
    }
}
 
async function carregarPalestrantes() {
    try {
        const resposta = await fetch(`${API_URL}/palestrantes`);
 
        if (!resposta.ok) {
            throw new Error("Erro ao buscar palestrantes.");
        }
 
        const palestrantes = await resposta.json();
 
        selectPalestrante.innerHTML = `
            <option value="">Selecione um palestrante</option>
        `;
 
        palestrantes.forEach(palestrante => {
            const option = document.createElement("option");
            option.value = palestrante.id;
            option.textContent = palestrante.nome;
            selectPalestrante.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        alert("Não foi possível carregar os palestrantes.");
    }
}
 
async function carregarEventoParaEdicao(id) {
    try {
        const resposta = await fetch(`${API_URL}/eventos/${id}`);
 
        if (!resposta.ok) {
            throw new Error("Evento não encontrado.");
        }
 
        const evento = await resposta.json();
 
        document.getElementById("nome").value = evento.nome;
        document.getElementById("descricao").value = evento.descricao;
        document.getElementById("local").value = evento.local;
 
        if (evento.palestranteId) {
            selectPalestrante.value = evento.palestranteId;
        }
 
        titulo.textContent = "Cadastro de evento";
    } catch (error) {
        console.error(error);
        alert("Não foi possível carregar o evento.");
    }
}
 
formulario.addEventListener("submit", async function(event) {
    event.preventDefault();
 
    const nome = document.getElementById("nome").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const local = document.getElementById("local").value.trim();
    const palestranteId = selectPalestrante.value;
 
    if (!nome || !descricao || !local || !palestranteId) {
        alert("Todos os campos são obrigatórios.");
        return;
    }
 
    try {
        let resposta;
 
        const dados = {
            nome: nome,
            descricao: descricao,
            local: local,
            palestranteId: Number(palestranteId)
        };
 
        if (idEvento) {
            resposta = await fetch(`${API_URL}/eventos/${idEvento}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });
        } else {
            resposta = await fetch(`${API_URL}/eventos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });
        }
 
        const resultado = await resposta.json();
 
        if (!resposta.ok) {
            alert(resultado.error || "Erro ao salvar evento.");
            return;
        }
 
        alert("cadastro concluído com sucesso");
        window.location.href = "index.html";
    } catch (error) {
        console.error(error);
        alert("Não foi possível conectar com a API.");
    }
});
 
iniciar();