// Variaveis que guardam os HTML
let nomeUsuario = "";
let ultimoUsuario;
let ultimoUsuarioGuardado;
let indexUltimoUsuario;

function pedirNomeUsuario() {
    let erro = true;
    while (erro) {
        nomeUsuario = prompt('Escolha um nome de usuário');
        // ultimoUsuarioGuardado = nomeUsuario;
        axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', {
            name: `${nomeUsuario}`
        }).then(() => {
            verificarParticipates();
            erro = false;
        });
    }
}

function verificarNomeUsuario() {
    verificarParticipates();
    manterConexao();
}

function avisoEntradaNaSala(response) {
    if (ultimoUsuarioGuardado.from === response.data[99].from && ultimoUsuarioGuardado.type === response.data[99].type && ultimoUsuarioGuardado.time === response.data[99].time) {
        console.log(respose.data[99].from);
        return;
    }
    const indexUltimoUsuario = response.data.findIndex( (element) => element.time === ultimoUsuarioGuardado.time);
    console.log('Mudou Guardado:');
    for (let index = indexUltimoUsuario; index < response.data.length; index++) {
        console.log(response.data[index]);
        if (response.data[index].type === "status") {
            document.querySelector('main').innerHTML = document.querySelector('main').innerHTML + `
            <div class="entrou-sala texto">
                <p><span>${response.data[index].time}</span><strong>${response.data[index].from}</strong> ${response.data[index].text}</p>
            </div>
        `;
        }
    }
    ultimoUsuarioGuardado = response.data[99];
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
    setInterval(() => {
        axios.post('https://mock-api.driven.com.br/api/v4/uol/status', {
            name: `${nomeUsuario}`
        });
    }, 5000);
}









function abrirSideBar() {
    document.querySelector('nav').classList.toggle('escondido')
}
pedirNomeUsuario()