// Variaveis que guardam os HTML
let nomeUsuario = "";
let promisse = "";

function pedirNomeUsuario() {
    nomeUsuario = prompt('Escolha um nome de usuário')
    axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', {
        name: `${nomeUsuario}`
    }).then(verficarNomeUsuario)
}

function verficarNomeUsuario(promisse) {
    if (promisse.status === 200) {
        axios.get('https://mock-api.driven.com.br/api/v4/uol/participants').then( (response) => {
            avisoEntradaNaSala(response.data[0].name);
        });
        setInterval(manterConexao, 5000);
    } else{
        pedirNomeUsuario();
    }
}
function avisoEntradaNaSala(nomePessoa) {
    document.querySelector('main').innerHTML = `
    <div class="entrou-sala texto">
            <p><span>(09:21:45)</span><strong>${nomePessoa}</strong> entrou na sala...</p>
        </div>
`;
}
function manterConexao() {
    axios.post('https://mock-api.driven.com.br/api/v4/uol/status', {
        name: `${nomeUsuario}`
    });
}










function abrirSideBar() {
    document.querySelector('nav').classList.toggle('escondido')
}
pedirNomeUsuario()