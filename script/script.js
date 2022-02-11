// Variaveis que guardam os HTML
let nomeUsuario = "";
let ultimoUsuario;
let ultimoUsuarioGuardado;
let indexUltimoUsuario;

async function pedirNomeUsuario() {
    let erro = true;

    while (erro) {
        nomeUsuario = prompt('Escolha um nome de usuário');
        // ultimoUsuarioGuardado = nomeUsuario;
        await axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', {
            name: nomeUsuario
        }).then(() => {
            verificarNomeUsuario();
            erro = false;
        });
    }
}

function verificarNomeUsuario() {
    verificarParticipates();
    manterConexao();
}

function avisoEntradaNaSala(response) {
    if (
        ultimoUsuarioGuardado.from === response.data[99].from && 
        ultimoUsuarioGuardado.type === response.data[99].type && 
        ultimoUsuarioGuardado.time === response.data[99].time
    ) return;

    const indexUltimoUsuario = response.data.findIndex(element => 
        element.from === ultimoUsuarioGuardado.from && 
        element.type == ultimoUsuarioGuardado.type &&
        element.time === ultimoUsuarioGuardado.time
    ) + 1;
    
    for (let index = indexUltimoUsuario; index < response.data.length; index++) {
        criarCard(response.data[index]);
    }
    ultimoUsuarioGuardado = response.data[99];
}

function criarCard(card) {
    let message = `<span class="negrito">${card.from}</span>`;

    if (card.type === 'message') {
        message += ` para <span class="negrito">${card.to}:</span>`;
    }
    if (card.type === 'private_message') {
        message += ` reservadamente para <span class="negrito">${card.to}:</span>`;
    }
    
    document.querySelector('main').innerHTML += `
    <div class="conteiner-mensagem ${card.type}">
        <p>
        <span class="time">(${card.time})</span>
        <span class="name">${message}</span>
        <span class="text">${card.text}</span>
        </p>
    </div>`;
}

function verificarParticipates(){
    axios.get('https://mock-api.driven.com.br/api/v4/uol/messages').then((response) => {
        ultimoUsuarioGuardado = response.data[99];
    }); 

    setInterval(() => {
        axios.get('https://mock-api.driven.com.br/api/v4/uol/messages').then(avisoEntradaNaSala);
    }, 3000);
}

function manterConexao() {
    console.log('manterConexao');  
    setInterval(() => {
        console.log('manterConexao 2');
        axios.post('https://mock-api.driven.com.br/api/v4/uol/status', {
            name: nomeUsuario
    });
    }, 5000);
}









// function abrirSideBar() {
//     document.querySelector('nav').classList.toggle('escondido')
// }
pedirNomeUsuario()