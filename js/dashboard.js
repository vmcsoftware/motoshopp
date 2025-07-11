// Configuração Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// Verificar se está logado
auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    // Carregar contadores com animação
    carregarDados();
    inicializarEventos();
  }
});

// Logout com confirmação
document.getElementById("logoutBtn").addEventListener("click", () => {
  if (confirm("Tem certeza que deseja sair?")) {
    auth.signOut().then(() => {
      window.location.href = "login.html";
    });
  }
});

// Inicializar eventos da interface
function inicializarEventos() {
  // Navegação do sidebar
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active de todos os links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Adiciona active ao link clicado
      link.classList.add('active');
      
      // Efeito de feedback visual
      link.style.transform = 'scale(1.05)';
      setTimeout(() => {
        link.style.transform = '';
      }, 150);
      
      // Aqui você pode adicionar lógica para trocar conteúdo
      const section = link.getAttribute('data-section');
      if (section) {
        mostrarSecao(section);
      }
    });
  });

  // Adicionar efeitos aos cards
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Animar contadores
  animarContadores();
}

// Função para mostrar seções (placeholder)
function mostrarSecao(section) {
  console.log(`Navegando para: ${section}`);
  // Aqui você pode implementar a lógica para mostrar diferentes seções
}

// Carregar dados de resumo com animação
function carregarDados() {
  // Simulando dados para demonstração
  const dados = {
    clientes: 127,
    ordens: 23,
    produtos: 456
  };

  // Animar contadores
  animarContador('clientesCount', dados.clientes);
  animarContador('ordensCount', dados.ordens);
  animarContador('produtosCount', dados.produtos);

  // Versão com Firebase (comentada para não dar erro)
  /*
  db.collection("clientes").get().then((snapshot) => {
    animarContador('clientesCount', snapshot.size);
  });
  db.collection("ordens").where("status", "==", "Em Andamento").get().then((snapshot) => {
    animarContador('ordensCount', snapshot.size);
  });
  db.collection("produtos").get().then((snapshot) => {
    animarContador('produtosCount', snapshot.size);
  });
  */
}

// Função para animar contadores
function animarContador(elementId, valorFinal) {
  const elemento = document.getElementById(elementId);
  const valorInicial = 0;
  const duracao = 2000; // 2 segundos
  const incremento = valorFinal / (duracao / 16); // 60 FPS
  
  let valorAtual = valorInicial;
  
  const timer = setInterval(() => {
    valorAtual += incremento;
    if (valorAtual >= valorFinal) {
      valorAtual = valorFinal;
      clearInterval(timer);
      
      // Efeito de pulsação no final
      elemento.style.animation = 'pulse 0.6s ease';
      setTimeout(() => {
        elemento.style.animation = '';
      }, 600);
    }
    
    elemento.textContent = Math.floor(valorAtual);
  }, 16);
}

// Função para animar contadores na inicialização
function animarContadores() {
  const contadores = document.querySelectorAll('[id$="Count"]');
  contadores.forEach((contador, index) => {
    contador.style.opacity = '0';
    contador.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      contador.style.transition = 'all 0.6s ease';
      contador.style.opacity = '1';
      contador.style.transform = 'translateY(0)';
    }, index * 200);
  });
}

// Função para mostrar notificações
function mostrarNotificacao(mensagem, tipo = 'info') {
  const notificacao = document.createElement('div');
  notificacao.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
  notificacao.style.top = '20px';
  notificacao.style.right = '20px';
  notificacao.style.zIndex = '9999';
  notificacao.style.minWidth = '300px';
  
  notificacao.innerHTML = `
    ${mensagem}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(notificacao);
  
  // Remove automaticamente após 5 segundos
  setTimeout(() => {
    if (notificacao.parentNode) {
      notificacao.remove();
    }
  }, 5000);
}

// Função para atualizar dados em tempo real
function atualizarDadosTempoReal() {
  setInterval(() => {
    carregarDados();
  }, 30000); // Atualiza a cada 30 segundos
}

// Inicializar atualização em tempo real
document.addEventListener('DOMContentLoaded', () => {
  atualizarDadosTempoReal();
  
  // Mostrar notificação de boas-vindas
  setTimeout(() => {
    mostrarNotificacao('Bem-vindo ao MotoShop Pro! 🏍️', 'success');
  }, 1000);
});

// Função para alternar tema (para implementação futura)
function alternarTema() {
  const body = document.body;
  body.classList.toggle('tema-claro');
  
  const tema = body.classList.contains('tema-claro') ? 'claro' : 'escuro';
  localStorage.setItem('tema', tema);
}

// Carregar tema salvo
document.addEventListener('DOMContentLoaded', () => {
  const temaSalvo = localStorage.getItem('tema');
  if (temaSalvo === 'claro') {
    document.body.classList.add('tema-claro');
  }
});

// Função para responsividade avançada
function ajustarResponsividade() {
  const sidebar = document.getElementById('sidebarMenu');
  const main = document.querySelector('main');
  
  if (window.innerWidth <= 768) {
    sidebar.classList.add('sidebar-mobile');
    main.classList.add('main-mobile');
  } else {
    sidebar.classList.remove('sidebar-mobile');
    main.classList.remove('main-mobile');
  }
}

// Listener para redimensionamento
window.addEventListener('resize', ajustarResponsividade);
document.addEventListener('DOMContentLoaded', ajustarResponsividade);
