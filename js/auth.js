/**
 * Sistema de Autenticação - MotoShop Pro
 * Suporte para login com email/senha e Google
 */

// Variáveis globais
let auth;
let googleProvider;

// Aguardar inicialização do Firebase
document.addEventListener('DOMContentLoaded', function() {
  // Verificar se o Firebase está disponível
  if (typeof firebase === 'undefined') {
    console.error('❌ Firebase não está disponível');
    mostrarErro('Erro ao carregar sistema de autenticação');
    return;
  }

  // Inicializar Firebase
  try {
    if (typeof initializeFirebase === 'function') {
      const firebaseServices = initializeFirebase();
      auth = firebaseServices.auth;
    } else {
      console.warn('⚠️ Configuração centralizada não encontrada - usando configuração local');
      // Fallback para configuração local
      const firebaseConfig = {
        apiKey: "AIzaSyB_pg9QDlL-7Il2DFb5uNTEburyPntoIVA",
        authDomain: "motoshopp-779d7.firebaseapp.com",
        databaseURL: "https://motoshopp-779d7-default-rtdb.firebaseio.com",
        projectId: "motoshopp-779d7",
        storageBucket: "motoshopp-779d7.firebasestorage.app",
        messagingSenderId: "806457181928",
        appId: "1:806457181928:web:205645f2b35f76770d6b5d",
        measurementId: "G-MQG7PMCHJL"
      };

      if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
      }
      auth = firebase.auth();
    }

    // Configurar provedor do Google
    googleProvider = new firebase.auth.GoogleAuthProvider();
    googleProvider.addScope('email');
    googleProvider.addScope('profile');

    // Configurar eventos
    configurarEventos();

    // Verificar se já está logado
    verificarAutenticacao();

    console.log('✅ Sistema de autenticação inicializado');

  } catch (error) {
    console.error('❌ Erro ao inicializar autenticação:', error);
    mostrarErro('Erro ao inicializar sistema de autenticação');
  }
});

// Configurar eventos dos formulários
function configurarEventos() {
  // Login com email/senha
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', loginComEmail);
  }

  // Login com Google
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', loginComGoogle);
  }
}

// Verificar se o usuário já está autenticado
function verificarAutenticacao() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('✅ Usuário já está logado:', user.email);
      // Redirecionar para dashboard se já estiver logado
      if (window.location.pathname.includes('login.html')) {
        window.location.href = 'dashboard.html';
      }
    } else {
      console.log('ℹ️ Usuário não está logado');
    }
  });
}

// Login com email e senha
async function loginComEmail(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const rememberMe = document.getElementById('rememberMe').checked;

  if (!email || !password) {
    mostrarErro('Por favor, preencha todos os campos');
    return;
  }

  mostrarCarregando(true);
  limparErros();

  try {
    // Configurar persistência baseada no checkbox "lembrar-me"
    const persistence = rememberMe ? 
      firebase.auth.Auth.Persistence.LOCAL : 
      firebase.auth.Auth.Persistence.SESSION;
    
    await auth.setPersistence(persistence);

    // Fazer login
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    console.log('✅ Login realizado com sucesso:', user.email);
    
    // Mostrar mensagem de sucesso
    mostrarSucesso('Login realizado com sucesso!');
    
    // Redirecionar após um breve delay
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);

  } catch (error) {
    console.error('❌ Erro no login:', error);
    
    let mensagemErro = 'Erro ao fazer login';
    
    switch (error.code) {
      case 'auth/user-not-found':
        mensagemErro = 'Usuário não encontrado';
        break;
      case 'auth/wrong-password':
        mensagemErro = 'Senha incorreta';
        break;
      case 'auth/invalid-email':
        mensagemErro = 'Email inválido';
        break;
      case 'auth/too-many-requests':
        mensagemErro = 'Muitas tentativas. Tente novamente mais tarde';
        break;
      case 'auth/network-request-failed':
        mensagemErro = 'Erro de conexão. Verifique sua internet';
        break;
      default:
        mensagemErro = error.message || 'Erro desconhecido';
    }
    
    mostrarErro(mensagemErro);
  } finally {
    mostrarCarregando(false);
  }
}

// Login com Google
async function loginComGoogle() {
  if (!googleProvider) {
    mostrarErro('Provedor Google não configurado');
    return;
  }

  mostrarCarregando(true);
  limparErros();

  try {
    console.log('🔄 Iniciando login com Google...');
    
    // Configurar persistência local para login com Google
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    
    // Fazer login com popup
    const result = await auth.signInWithPopup(googleProvider);
    const user = result.user;

    console.log('✅ Login com Google realizado com sucesso:', user.email);
    
    // Obter token de acesso do Google (opcional)
    const credential = firebase.auth.GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    
    // Mostrar mensagem de sucesso
    mostrarSucesso(`Bem-vindo, ${user.displayName || user.email}!`);
    
    // Redirecionar após um breve delay
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);

  } catch (error) {
    console.error('❌ Erro no login com Google:', error);
    
    let mensagemErro = 'Erro ao fazer login com Google';
    
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        mensagemErro = 'Login cancelado pelo usuário';
        break;
      case 'auth/popup-blocked':
        mensagemErro = 'Popup bloqueado. Permita popups para este site';
        break;
      case 'auth/network-request-failed':
        mensagemErro = 'Erro de conexão. Verifique sua internet';
        break;
      case 'auth/account-exists-with-different-credential':
        mensagemErro = 'Conta já existe com credenciais diferentes';
        break;
      default:
        mensagemErro = error.message || 'Erro desconhecido';
    }
    
    mostrarErro(mensagemErro);
  } finally {
    mostrarCarregando(false);
  }
}

// Logout
function logout() {
  if (auth) {
    auth.signOut().then(() => {
      console.log('✅ Logout realizado com sucesso');
      window.location.href = 'login.html';
    }).catch((error) => {
      console.error('❌ Erro no logout:', error);
    });
  }
}

// Funções utilitárias para UI
function mostrarErro(mensagem) {
  const errorDiv = document.getElementById('error');
  if (errorDiv) {
    errorDiv.textContent = mensagem;
    errorDiv.style.display = 'block';
    
    // Remover mensagem após 5 segundos
    setTimeout(() => {
      errorDiv.textContent = '';
      errorDiv.style.display = 'none';
    }, 5000);
  }
}

function mostrarSucesso(mensagem) {
  const errorDiv = document.getElementById('error');
  if (errorDiv) {
    errorDiv.textContent = mensagem;
    errorDiv.className = 'text-success mt-2';
    errorDiv.style.display = 'block';
  }
}

function limparErros() {
  const errorDiv = document.getElementById('error');
  if (errorDiv) {
    errorDiv.textContent = '';
    errorDiv.className = 'text-danger mt-2';
    errorDiv.style.display = 'none';
  }
}

function mostrarCarregando(mostrar) {
  const submitBtn = document.querySelector('button[type="submit"]');
  const googleBtn = document.getElementById('googleLoginBtn');
  
  if (mostrar) {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Entrando...';
    }
    if (googleBtn) {
      googleBtn.disabled = true;
      googleBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Entrando...';
    }
  } else {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> Entrar';
    }
    if (googleBtn) {
      googleBtn.disabled = false;
      googleBtn.innerHTML = `
        <svg class="me-2" width="18" height="18" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Entrar com Google
      `;
    }
  }
}

// Disponibilizar logout globalmente
window.logout = logout;
