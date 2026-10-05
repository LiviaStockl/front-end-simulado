const API_URL = "http://localhost:3000/api";
const formulario = document.getElementById("form-palestrante");

formulario.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!nome || !email) {
        alert("Todos os campos são obrigatórios.");
        return;
    }

    if (!validarEmail(email)) {
        alert("Digite um e-mail válido.");
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/palestrantes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: nome,
                email: email
            })
        });

        const dados = await resposta.json();

        console.log("Resposta da API:", dados);

        if (!resposta.ok) {
            alert(dados.error || "Erro ao cadastrar palestrante.");
            return;
        }

        alert("Cadastro concluído com sucesso!");
        formulario.reset();

    } catch (error) {
        console.error("Erro:", error);
        alert("Não foi possível conectar com a API.");
    }
});

function validarEmail(email) {
    const regra = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regra.test(email);
}