// Variaveis que guardam os HTML
const htmlScript = document.body;
let htmlBody = document.body;

const htmlSalaLogin = `
    <img src="img/logo 1.svg" alt="logo batepopo uol">
    <form class="sala-login" action="http://mock-api.driven.com.br/api/v4/uol/participants" method="post">
        <input type="text" name="" id="login-name" placeholder="Digite seu nome" value="">
        <div>
            <input class="button texto" type="submit" value="Entrar">       
        </div>
    </form>
`;

const htmlSalaBatePapo =`
    <header class="conteiners header-batepapo">
        <img src="img/logo 1.svg" alt="logo batepopo uol">
        <ion-icon name="people"></ion-icon>
    </header>
    <main class="main-batepapo">
    </main>
    <footer class="conteiners footer-batepapo">
        <input class="texto"type="text" placeholder="Escreva aqui..." >
        <ion-icon name="paper-plane-outline"></ion-icon>
    </footer>
`;

function abrirSideBar() {
    document.querySelector('nav').classList.toggle('escondido')
}