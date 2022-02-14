// Variaveis que guardam os HTML
let nomeUsuario = "";
let ultimoUsuario = undefined;
let ultimoUsuarioGuardado = undefined;
let indexUltimoUsuario = undefined;
let usuarioSelecionadoAnterior = undefined;
let visibilidadeSelecionadaAnterior = undefined;
let mensagemDigitada = undefined;
let nomeDestinatario = undefined;
let tipoVisibilidade = undefined;


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
    <div class="conteiner-mensagem ${card.type}" data-identifier="message">
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
    setInterval(() =>{
        axios.get('https://mock-api.driven.com.br/api/v4/uol/participants').then(usuariosOnline);
    }, 10000)
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

// Funções Relacionadas ao Aside
function abrirSideBar() {
    document.querySelector('aside').classList.toggle('escondido')
}
function selecionarUsuario(selecionado) {
    if (usuarioSelecionadoAnterior === undefined) {
        selecionado.querySelector('.check').classList.remove('escondido');
        usuarioSelecionadoAnterior = selecionado;
    }else{
        usuarioSelecionadoAnterior.querySelector('.check').classList.add('escondido');
        selecionado.querySelector('.check').classList.remove('escondido');
        usuarioSelecionadoAnterior = selecionado;
    }
    eviarPara(selecionado);
}
function eviarPara(nome) {
    nomeDestinatario = nome.querySelector('p').innerText;
}

function selecionarVisibilidade(selecionado) {
    if (visibilidadeSelecionadaAnterior === undefined) {
        selecionado.querySelector('.check').classList.remove('escondido');
        visibilidadeSelecionadaAnterior = selecionado;
    }else{
        visibilidadeSelecionadaAnterior.querySelector('.check').classList.add('escondido');
        selecionado.querySelector('.check').classList.remove('escondido');
        visibilidadeSelecionadaAnterior = selecionado;
    }
    tipoVisibilidade = selecionado.querySelector('p').innerText;
    if (tipoVisibilidade === "Reservadamente") {
        tipoVisibilidade = "private_message"
    } else{
        tipoVisibilidade = "message"
    }
}

function usuariosOnline(response) {
    document.querySelector('.escolher-contato').innerHTML = `
        <div class="titulo">
            <p class="texto">Escolha a visibilidade:</p>
        </div>
        <div class="usuarios">
            <div class="contato" onclick="selecionarUsuario(this)">
                <div>
                    <ion-icon name="people"></ion-icon>
                    <p class="texto">Todos</p>
                </div>
            </div>
            <div>
                <ion-icon class="check escondido" name="checkmark-sharp"></ion-icon>
            </div>
        </div>`;

    document.querySelector('.usuarios').innerHTML=`
    <div class="contato" onclick="selecionarUsuario(this)">
        <div>
            <ion-icon name="people"></ion-icon>
            <p class="texto">Todos</p>
        </div>`;

    response.data.forEach(usuario => {
        document.querySelector('.usuarios').innerHTML += `
        <div class="contato" onclick="selecionarUsuario(this)" data-identifier="participant">
            <div>
                <ion-icon name="person"></ion-icon>
                <p class="texto">${usuario.name}</p>
            </div>
            <div>
                <ion-icon class="check escondido" name="checkmark-sharp"></ion-icon>
            </div>
        </div>`;
        document.querySelector('main > div:last-of-type').scrollIntoView();
    });
}

// Relacionado ao Footer
function enviarMensagem() {
    mensagemDigitada = document.querySelector('#input-mensagem').value;
    document.querySelector('#input-mensagem').value = "";
    axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', {
        from: nomeUsuario,
        to: nomeDestinatario,
        text: mensagemDigitada,
        type: tipoVisibilidade,
    });
}

pedirNomeUsuario()