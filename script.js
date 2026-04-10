const loginOverlay = document.getElementById('login-overlay');
const mainContent = document.getElementById('main-content');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const usernameInput = document.getElementById('username-input');
const expLevelInput = document.getElementById('experience-level');
const btnEntrar = document.getElementById('btn-entrar');
const btnSair = document.getElementById('btn-sair');

// Elementos da Navbar
const navName = document.getElementById('nav-display-name');
const navImg = document.getElementById('nav-profile-img');
const navBadge = document.getElementById('nav-badge-experience');
const jobsContainer = document.getElementById('jobs-container');

// Banco de dados de vagas fictícias
const listaVagas = [
    { titulo: "Desenvolvedor Front-end Júnior", empresa: "Tech Solutions", local: "Remoto", nivel: "Iniciante" },
    { titulo: "Software Engineer Sênior", empresa: "Global Fintech", local: "São Paulo, SP", nivel: "Experiente" },
    { titulo: "Estágio em Web Development", empresa: "StartUp Inovação", local: "Rio de Janeiro, RJ", nivel: "Iniciante" },
    { titulo: "Desenvolvedor Full Stack Pleno", empresa: "E-commerce Pro", local: "Remoto", nivel: "Experiente" },
    { titulo: "React Developer", empresa: "Webflow Corp", local: "Curitiba, PR", nivel: "Iniciante" },
    { titulo: "Arquiteto de Sistemas", empresa: "Big Data Co", local: "Remoto", nivel: "Experiente" }
];

window.onload = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const user = localStorage.getItem('githubUser');
    const level = localStorage.getItem('userLevel');
    
    if (isLoggedIn === 'true' && user) {
        iniciarApp(user, level);
    }
};

btnEntrar.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const user = usernameInput.value.trim();
    const level = expLevelInput.value;

    if (email && password.length >= 6 && user && level) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('githubUser', user);
        localStorage.setItem('userLevel', level);
        iniciarApp(user, level);
    } else {
        alert("Preencha todos os campos corretamente.");
    }
});

btnSair.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

function iniciarApp(user, level) {
    loginOverlay.classList.add('hidden');
    mainContent.classList.remove('hidden');
    navBadge.innerText = level;
    buscarDadosPerfil(user);
    mostrarVagas(level); // Mostra vagas baseadas no nível selecionado
}

async function buscarDadosPerfil(user) {
    try {
        const response = await fetch(`https://api.github.com/users/${user}`);
        const data = await response.json();
        if (data.id) {
            navName.innerText = data.name || user;
            navImg.src = data.avatar_url;
        }
    } catch (e) {
        console.error("Erro ao carregar perfil");
    }
}

function mostrarVagas(nivelUsuario) {
    jobsContainer.innerHTML = '';
    
    // Filtra vagas ou mostra as que combinam com o nível do usuário
    listaVagas.forEach(vaga => {
        const card = `
            <div class="job-card">
                <h4>${vaga.titulo}</h4>
                <p class="job-company"><i class="fas fa-building"></i> ${vaga.empresa}</p>
                <p class="job-location"><i class="fas fa-map-marker-alt"></i> ${vaga.local}</p>
                <p class="badge-mini" style="width: fit-content;">${vaga.nivel}</p>
                <button class="btn-candidatar" onclick="alert('Candidatura enviada para ${vaga.titulo}!')">Candidatar-se</button>
            </div>
        `;
        jobsContainer.innerHTML += card;
    });
}

// Adicione este código ao final do arquivo script.js
document.querySelector('.user-nav-info').style.cursor = 'pointer';
document.querySelector('.user-nav-info').addEventListener('click', (e) => {
    // Evita que o clique no botão "Sair" também redirecione
    if (e.target.closest('#btn-sair')) return;

    const user = localStorage.getItem('githubUser');
    if (user) {
        window.open(`https://github.com/${user}`, '_blank');
    }
});