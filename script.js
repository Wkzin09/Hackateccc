const loginOverlay = document.getElementById('login-overlay');
const mainContent = document.getElementById('main-content');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const usernameInput = document.getElementById('username-input');
const expLevelInput = document.getElementById('experience-level');
const btnEntrar = document.getElementById('btn-entrar');
const btnSair = document.getElementById('btn-sair');

const navName = document.getElementById('nav-display-name');
const navImg = document.getElementById('nav-profile-img');
const navBadge = document.getElementById('nav-badge-experience');
const jobsContainer = document.getElementById('jobs-container');

// Base de dados com classificação por nível
// Base de dados expandida com classificação por nível
const listaVagas = [
    // --- VAGAS PARA INICIANTES ---
    { titulo: "Front-end Júnior (React)", empresa: "Tech Solutions", local: "Remoto", nivel: "Iniciante" },
    { titulo: "Estágio em Desenvolvimento Web", empresa: "StartUp Inovação", local: "Rio de Janeiro, RJ", nivel: "Iniciante" },
    { titulo: "Desenvolvedor Mobile Trainee", empresa: "App Factory", local: "Belo Horizonte, MG", nivel: "Iniciante" },
    { titulo: "React Developer Júnior", empresa: "Webflow Corp", local: "Curitiba, PR", nivel: "Iniciante" },
    { titulo: "Suporte Técnico Nível 1", empresa: "Global Infra", local: "São Paulo, SP", nivel: "Iniciante" },
    { titulo: "Auxiliar de Programação", empresa: "Soft House", local: "Remoto", nivel: "Iniciante" },
    { titulo: "QA Tester Júnior", empresa: "Bug Hunters", local: "Florianópolis, SC", nivel: "Iniciante" },

    // --- VAGAS PARA EXPERIENTES ---
    { titulo: "Software Engineer Sênior", empresa: "Global Fintech", local: "São Paulo, SP", nivel: "Experiente" },
    { titulo: "Full Stack Pleno (Node/React)", empresa: "E-commerce Pro", local: "Remoto", nivel: "Experiente" },
    { titulo: "Arquiteto de Sistemas Cloud", empresa: "Big Data Co", local: "Remoto", nivel: "Experiente" },
    { titulo: "Tech Lead", empresa: "Unicórnio Tech", local: "São Paulo, SP", nivel: "Experiente" },
    { titulo: "SRE / DevOps Engineer Pleno", empresa: "Cloud Ops", local: "Remoto", nivel: "Experiente" },
    { titulo: "Desenvolvedor Backend Sênior (Java)", empresa: "Banco Digital", local: "Brasília, DF", nivel: "Experiente" },
    { titulo: "Especialista em Segurança da Informação", empresa: "Cyber Shield", local: "Remoto", nivel: "Experiente" }
];

window.onload = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const user = localStorage.getItem('githubUser');
    const level = localStorage.getItem('userLevel');
    if (isLoggedIn === 'true' && user) iniciarApp(user, level);
};

btnEntrar.addEventListener('click', () => {
    const user = usernameInput.value.trim();
    const level = expLevelInput.value;
    if (user && level && passwordInput.value.length >= 6) {
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
    mostrarVagas(level); // Filtra as vagas pelo nível
}

async function buscarDadosPerfil(user) {
    try {
        const response = await fetch(`https://api.github.com/users/${user}`);
        const data = await response.json();
        if (data.id) {
            navName.innerText = data.name || user;
            navImg.src = data.avatar_url;
        }
    } catch (e) { console.error("Erro no perfil"); }
}

// FILTRO DE VAGAS: Exibe apenas o que for compatível com o nível selecionado
function mostrarVagas(nivelUsuario) {
    jobsContainer.innerHTML = '';
    
    const vagasFiltradas = listaVagas.filter(vaga => vaga.nivel === nivelUsuario);

    vagasFiltradas.forEach(vaga => {
        jobsContainer.innerHTML += `
            <div class="job-card">
                <h4>${vaga.titulo}</h4>
                <p class="job-company"><i class="fas fa-building"></i> ${vaga.empresa}</p>
                <p class="job-location"><i class="fas fa-map-marker-alt"></i> ${vaga.local}</p>
                <p class="badge-mini" style="width: fit-content;">${vaga.nivel}</p>
                <button class="btn-candidatar" onclick="alert('Candidatura enviada!')">Candidatar-se</button>
            </div>`;
    });
}

// Redirecionamento para o perfil do GitHub
document.querySelector('.user-nav-info').addEventListener('click', (e) => {
    if (e.target.closest('#btn-sair')) return;
    const user = localStorage.getItem('githubUser');
    if (user) window.open(`https://github.com/${user}`, '_blank');
});