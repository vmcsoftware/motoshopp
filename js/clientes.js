// Aguardar inicialização do Firebase
let db, auth;

// Estado da conexão Firebase
let firebaseStatus = {
  connected: false,
  authenticated: false,
  permissions: false,
  error: null
};

// Configuração Firebase (fallback se não houver arquivo de config)
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

// Função para inicializar Firebase
function initializeFirebaseLocal() {
  try {
    console.log('🔥 Inicializando Firebase...');
    
    // Verificar se o Firebase já foi inicializado
    if (firebase.apps.length === 0) {
      // Inicializa o Firebase
      firebase.initializeApp(firebaseConfig);
      console.log('✅ Firebase App inicializado');
    }
    
    // Inicializa os serviços do Firebase
    db = firebase.firestore();
    auth = firebase.auth();
    
    // Configurar persistência offline do Firestore
    db.enablePersistence({ synchronizeTabs: true })
      .then(() => {
        console.log('✅ Persistência offline habilitada');
      })
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('⚠️ Persistência offline não disponível - múltiplas abas abertas');
        } else if (err.code === 'unimplemented') {
          console.warn('⚠️ Persistência offline não suportada pelo navegador');
        } else {
          console.error('❌ Erro ao habilitar persistência offline:', err);
        }
      });
    
    console.log('🎉 Firebase inicializado com sucesso!');
    return { db, auth };
    
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error);
    throw error;
  }
}

// Inicializar Firebase quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM carregado, inicializando Firebase...');
  
  // Aguardar um pouco para garantir que todos os scripts foram carregados
  setTimeout(() => {
    try {
      // Tentar usar a configuração centralizada primeiro
      if (typeof window.initializeFirebase === 'function') {
        console.log('🔧 Usando configuração centralizada do Firebase');
        const firebaseServices = window.initializeFirebase();
        db = firebaseServices.db;
        auth = firebaseServices.auth;
      } else {
        console.log('🔧 Usando configuração local do Firebase');
        const firebaseServices = initializeFirebaseLocal();
        db = firebaseServices.db;
        auth = firebaseServices.auth;
      }
      
      // Inicializar a página após Firebase estar pronto
      setTimeout(() => {
        inicializarPagina();
      }, 500);
      
    } catch (error) {
      console.error('❌ Erro ao inicializar Firebase:', error);
      console.log('🔄 Tentando inicializar em modo demo...');
      
      // Em caso de erro, continuar em modo demo
      setTimeout(() => {
        inicializarPagina();
      }, 1000);
    }
  }, 100);
});

// Variáveis globais
let clientes = [];
let clientesFiltrados = [];
let clienteEditando = null;
let paginaAtual = 1;
const itensPorPagina = 10;

// Diagnóstico do Firebase e exibição de status
function diagnosticarFirebase() {
  const statusElement = document.getElementById('firebase-status');
  if (!statusElement) {
    // Criar elemento de status se não existir
    createFirebaseStatusElement();
  }
  
  let statusHTML = '';
  let statusClass = '';
  
  if (!db) {
    statusHTML = '🔴 Firebase não inicializado';
    statusClass = 'alert-danger';
    firebaseStatus.connected = false;
  } else if (!firebaseStatus.authenticated) {
    statusHTML = '🟡 Conectado mas não autenticado - funcionalidade limitada';
    statusClass = 'alert-warning';
  } else if (!firebaseStatus.permissions) {
    statusHTML = '🔴 Sem permissões de acesso aos dados - verifique as regras do Firestore';
    statusClass = 'alert-danger';
  } else {
    statusHTML = '🟢 Conectado e autenticado com sucesso';
    statusClass = 'alert-success';
  }
  
  if (firebaseStatus.error) {
    statusHTML += `<br><small>Erro: ${firebaseStatus.error}</small>`;
  }
  
  updateFirebaseStatus(statusHTML, statusClass);
}

// Criar elemento de status do Firebase na interface
function createFirebaseStatusElement() {
  const container = document.querySelector('.container-fluid');
  if (container) {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'firebase-status';
    statusDiv.className = 'alert alert-info mt-2';
    statusDiv.style.display = 'none';
    statusDiv.innerHTML = '🔄 Verificando conexão...';
    container.insertBefore(statusDiv, container.firstChild);
  }
}

// Atualizar status do Firebase na interface
function updateFirebaseStatus(message, alertClass) {
  const statusElement = document.getElementById('firebase-status');
  if (statusElement) {
    statusElement.innerHTML = message;
    statusElement.className = `alert ${alertClass} mt-2`;
    statusElement.style.display = 'block';
    
    // Auto-ocultar status de sucesso após 5 segundos
    if (alertClass === 'alert-success') {
      setTimeout(() => {
        statusElement.style.display = 'none';
      }, 5000);
    }
  }
}

// Verificar se está logado
function verificarAutenticacao() {
  if (!auth) {
    console.log('⚠️ Firebase Auth não disponível');
    firebaseStatus.authenticated = false;
    diagnosticarFirebase();
    return;
  }
  
  auth.onAuthStateChanged((user) => {
    if (!user) {
      console.log('⚠️ Usuário não autenticado - usando modo demo');
      firebaseStatus.authenticated = false;
      firebaseStatus.permissions = false;
      mostrarNotificacao('Sistema em modo demonstração - faça login para acessar todos os recursos', 'warning');
    } else {
      console.log('✅ Usuário autenticado:', user.email);
      firebaseStatus.authenticated = true;
      // Testar permissões após autenticação
      testarPermissoesFirestore();
    }
    diagnosticarFirebase();
  });
}

// Testar permissões do Firestore
async function testarPermissoesFirestore() {
  if (!db) {
    firebaseStatus.permissions = false;
    return;
  }
  
  try {
    // Teste simples de leitura
    await db.collection('clientes').limit(1).get();
    firebaseStatus.permissions = true;
    firebaseStatus.error = null;
    console.log('✅ Permissões de leitura OK');
    
    // Teste de escrita (tentativa)
    try {
      const testDoc = db.collection('clientes').doc('permission-test');
      await testDoc.set({ test: true });
      await testDoc.delete();
      console.log('✅ Permissões de escrita OK');
    } catch (writeError) {
      console.warn('⚠️ Sem permissões de escrita:', writeError.code);
      firebaseStatus.error = 'Sem permissões de escrita';
    }
    
  } catch (error) {
    firebaseStatus.permissions = false;
    firebaseStatus.error = error.code || error.message;
    console.error('❌ Erro de permissões:', error);
    
    // Tratar diferentes tipos de erro
    if (error.code === 'permission-denied') {
      mostrarNotificacao('Acesso negado - verifique as regras de segurança do Firestore', 'error');
    } else if (error.code === 'unavailable') {
      mostrarNotificacao('Servidor Firebase indisponível - tentando novamente...', 'warning');
    } else {
      mostrarNotificacao('Erro de conexão com o banco de dados', 'error');
    }
  }
  
  diagnosticarFirebase();
}

// Inicializar página
function inicializarPagina() {
  console.log('🚀 Inicializando página de clientes...');
  
  // Criar elemento de status do Firebase
  createFirebaseStatusElement();
  
  // Inicializar com array vazio - não carregar dados demo
  clientes = [];
  clientesFiltrados = [];
  
  // Verificar se o Firebase está disponível para carregar dados reais
  if (db && typeof db.collection === 'function') {
    console.log('🔥 Firebase disponível - testando conexão...');
    firebaseStatus.connected = true;
    
    setTimeout(() => {
      tentarCarregarFirebase();
    }, 1000);
  } else {
    console.log('📱 Modo local ativo - lista vazia');
    firebaseStatus.connected = false;
    renderizarTabela();
    atualizarEstatisticas();
    mostrarNotificacao('Sistema em modo local - sem conexão com servidor', 'info');
  }
  
  verificarAutenticacao();
  configurarEventos();
  configurarMascaras();
  configurarBuscaCEP();
  
  // Atualizar diagnóstico após inicialização
  setTimeout(() => {
    diagnosticarFirebase();
  }, 2000);
  
  console.log('✅ Página de clientes inicializada com sucesso!');
}

// Configurar eventos
function configurarEventos() {
  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja sair?')) {
      if (auth && typeof auth.signOut === 'function') {
        auth.signOut().then(() => {
          window.location.href = 'login.html';
        }).catch((error) => {
          console.error('Erro no logout:', error);
          // Mesmo com erro, redirecionar para login
          window.location.href = 'login.html';
        });
      } else {
        // Se não há auth disponível, apenas redirecionar
        console.log('Auth não disponível, redirecionando...');
        window.location.href = 'login.html';
      }
    }
  });

  // Busca de CEP
  document.getElementById('cepCliente').addEventListener('input', function(e) {
    let cep = e.target.value.replace(/\D/g, '');
    if (cep.length <= 8) {
      cep = cep.replace(/(\d{5})(\d)/, '$1-$2');
      e.target.value = cep;
    }
    
    // Buscar automaticamente quando CEP estiver completo
    if (cep.replace('-', '').length === 8) {
      buscarEnderecoPorCep(cep.replace('-', ''));
    }
  });

  // Botão de buscar CEP
  document.getElementById('buscarCep').addEventListener('click', () => {
    const cep = document.getElementById('cepCliente').value.replace(/\D/g, '');
    if (cep.length === 8) {
      buscarEnderecoPorCep(cep);
    } else {
      mostrarNotificacao('CEP deve ter 8 dígitos', 'warning');
    }
  });

  // Limpar campos de endereço quando CEP for limpo
  document.getElementById('cepCliente').addEventListener('blur', function(e) {
    if (!e.target.value.trim()) {
      limparCamposEndereco();
    }
  });

  // Busca em tempo real
  document.getElementById('buscarCliente').addEventListener('input', (e) => {
    filtrarClientes();
  });

  // Filtros
  document.getElementById('filtroStatus').addEventListener('change', filtrarClientes);
  document.getElementById('filtroOrdem').addEventListener('change', filtrarClientes);
  document.getElementById('limparFiltros').addEventListener('click', limparFiltros);

  // Salvar cliente
  document.getElementById('salvarCliente').addEventListener('click', salvarCliente);

  // Selecionar todos
  document.getElementById('selecionarTodos').addEventListener('change', (e) => {
    const checkboxes = document.querySelectorAll('input[name="selecionarCliente"]');
    checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
  });

  // Exportar dados
  document.getElementById('exportarBtn').addEventListener('click', exportarDados);

  // Limpar formulário ao fechar modal
  document.getElementById('clienteModal').addEventListener('hidden.bs.modal', () => {
    limparFormulario();
  });
}

// Configurar máscaras de input
function configurarMascaras() {
  // Máscara para CPF
  document.getElementById('cpfCliente').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = value;
  });

  // Máscara para telefone
  document.getElementById('telefoneCliente').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d)/, '($1) $2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      value = value.replace(/(\d{2})(\d)/, '($1) $2');
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    e.target.value = value;
  });
}

// Carregar clientes do Firebase
async function carregarClientes() {
  mostrarLoading(true);
  
  try {
    console.log('🔄 Carregando clientes...');
    
    // Verificar se o Firebase está disponível
    if (!db || typeof db.collection !== 'function') {
      console.warn('⚠️ Firebase Firestore não disponível');
      clientes = [];
      clientesFiltrados = [];
      renderizarTabela();
      atualizarEstatisticas();
      mostrarNotificacao('Firebase indisponível - use o modo local', 'warning');
      return;
    }

    // Primeiro tentar um teste simples de permissão
    try {
      await db.collection('clientes').limit(1).get();
      console.log('✅ Permissões Firebase OK');
    } catch (permissionError) {
      console.warn('⚠️ Sem permissões Firebase:', permissionError.code);
      clientes = [];
      clientesFiltrados = [];
      renderizarTabela();
      atualizarEstatisticas();
      mostrarNotificacao('Sistema pronto - adicione seus clientes', 'info');
      return;
    }
    
    // Buscar clientes no Firestore
    const querySnapshot = await db.collection('clientes').orderBy('nome').get();
    
    clientes = [];
    querySnapshot.forEach((doc) => {
      const clienteData = doc.data();
      clientes.push({
        id: doc.id,
        ...clienteData,
        // Converter timestamps do Firebase para Date
        dataCadastro: clienteData.dataCadastro && clienteData.dataCadastro.toDate ? 
          clienteData.dataCadastro.toDate() : 
          (clienteData.dataCadastro ? new Date(clienteData.dataCadastro) : new Date()),
        ultimaVisita: clienteData.ultimaVisita && clienteData.ultimaVisita.toDate ? 
          clienteData.ultimaVisita.toDate() : 
          (clienteData.ultimaVisita ? new Date(clienteData.ultimaVisita) : null)
      });
    });
    
    console.log(`✅ ${clientes.length} clientes carregados do Firebase`);
    
    if (clientes.length === 0) {
      console.log('📝 Nenhum cliente encontrado no banco');
      mostrarNotificacao('Nenhum cliente cadastrado - adicione o primeiro!', 'info');
    } else {
      mostrarNotificacao(`${clientes.length} clientes carregados`, 'success');
    }
    
    clientesFiltrados = [...clientes];
    renderizarTabela();
    atualizarEstatisticas();
    
  } catch (error) {
    console.error('❌ Erro ao carregar clientes:', error);
    
    // Inicializar com lista vazia em caso de erro
    atualizarEstatisticas();
    
  } catch (error) {
    console.error('❌ Erro ao carregar clientes:', error);
    
    // Inicializar com lista vazia em caso de erro
    clientes = [];
    clientesFiltrados = [];
    renderizarTabela();
    atualizarEstatisticas();
    
    // Verificar tipo de erro para melhor tratamento
    if (error.code === 'permission-denied' || error.message?.includes('permission')) {
      mostrarNotificacao('Sistema pronto - adicione seus clientes', 'info');
    } else {
      mostrarNotificacao('Erro de conexão - usando modo local', 'warning');
    }
  } finally {
    mostrarLoading(false);
  }
}

// Criar dados de exemplo no Firebase
async function criarDadosExemplo() {
  const clientesExemplo = [
    {
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '(11) 99999-9999',
      cpf: '123.456.789-00',
      cep: '01310-100',
      endereco: 'Av. Paulista, 123',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      status: 'ativo',
      tipo: 'pessoa_fisica',
      observacoes: 'Cliente VIP',
      dataCadastro: firebase.firestore.FieldValue.serverTimestamp(),
      ultimaVisita: firebase.firestore.FieldValue.serverTimestamp()
    },
    {
      nome: 'Maria Santos',
      email: 'maria@email.com',
      telefone: '(11) 88888-8888',
      cpf: '987.654.321-00',
      cep: '04038-001',
      endereco: 'Rua Vergueiro, 456',
      bairro: 'Vila Mariana',
      cidade: 'São Paulo',
      uf: 'SP',
      status: 'vip',
      tipo: 'pessoa_fisica',
      observacoes: 'Cliente desde 2020',
      dataCadastro: firebase.firestore.FieldValue.serverTimestamp(),
      ultimaVisita: firebase.firestore.FieldValue.serverTimestamp()
    },
    {
      nome: 'Pedro Oliveira',
      email: 'pedro@email.com',
      telefone: '(11) 77777-7777',
      cpf: '456.789.123-00',
      cep: '07023-070',
      endereco: 'Rua dos Mecânicos, 789',
      bairro: 'Vila Galvão',
      cidade: 'Guarulhos',
      uf: 'SP',
      status: 'ativo',
      tipo: 'pessoa_fisica',
      observacoes: '',
      dataCadastro: firebase.firestore.FieldValue.serverTimestamp(),
      ultimaVisita: firebase.firestore.FieldValue.serverTimestamp()
    }
  ];

  try {
    console.log('📝 Criando dados de exemplo no Firebase...');
    
    // Usar Promise.all para criar todos os clientes
    const promises = clientesExemplo.map(cliente => 
      db.collection('clientes').add(cliente)
    );
    
    await Promise.all(promises);
    console.log('✅ Dados de exemplo criados no Firebase');
    
    // Recarregar clientes
    await carregarClientes();
    
  } catch (error) {
    console.error('❌ Erro ao criar dados de exemplo:', error);
    throw error;
  }
}

// Carregar dados simulados (fallback)
function carregarDadosSimulados() {
  const clientesSimulados = [
    {
      id: '1',
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '(11) 99999-9999',
      cpf: '123.456.789-00',
      cep: '01310-100',
      endereco: 'Av. Paulista, 123',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      status: 'ativo',
      tipo: 'pessoa_fisica',
      observacoes: 'Cliente VIP - Honda CB 600F',
      dataCadastro: new Date('2024-01-15'),
      ultimaVisita: new Date('2024-07-05')
    },
    {
      id: '2',
      nome: 'Maria Santos',
      email: 'maria@email.com',
      telefone: '(11) 88888-8888',
      cpf: '987.654.321-00',
      cep: '04038-001',
      endereco: 'Rua Vergueiro, 456',
      bairro: 'Vila Mariana',
      cidade: 'São Paulo',
      uf: 'SP',
      status: 'vip',
      tipo: 'pessoa_fisica',
      observacoes: 'Cliente desde 2020 - Yamaha R3',
      dataCadastro: new Date('2020-05-10'),
      ultimaVisita: new Date('2024-07-08')
    },
    {
      id: '3',
      nome: 'Pedro Oliveira',
      email: 'pedro@email.com',
      telefone: '(11) 77777-7777',
      cpf: '456.789.123-00',
      cep: '07023-070',
      endereco: 'Rua dos Mecânicos, 789',
      bairro: 'Vila Galvão',
      cidade: 'Guarulhos',
      uf: 'SP',
      status: 'ativo',
      tipo: 'pessoa_fisica',
      observacoes: 'Kawasaki Ninja 300',
      dataCadastro: new Date('2023-03-20'),
      ultimaVisita: new Date('2024-06-25')
    },
    {
      id: '4',
      nome: 'Ana Costa',
      email: 'ana@email.com',
      telefone: '(11) 66666-6666',
      cpf: '789.123.456-00',
      cep: '02101-300',
      endereco: 'Av. Cruzeiro do Sul, 321',
      bairro: 'Santana',
      cidade: 'São Paulo',
      uf: 'SP',
      status: 'vip',
      tipo: 'pessoa_fisica',
      observacoes: 'Cliente fidelizada - Suzuki GSX-R 750',
      dataCadastro: new Date('2022-08-12'),
      ultimaVisita: new Date('2024-07-10')
    },
    {
      id: '5',
      nome: 'Carlos Rodrigues',
      email: 'carlos@email.com',
      telefone: '(11) 55555-5555',
      cpf: '321.654.987-00',
      cep: '03084-000',
      endereco: 'Rua do Gasômetro, 654',
      bairro: 'Brás',
      cidade: 'São Paulo',
      uf: 'SP',
      status: 'ativo',
      tipo: 'pessoa_fisica',
      observacoes: 'BMW F 850 GS',
      dataCadastro: new Date('2024-06-01'),
      ultimaVisita: new Date('2024-07-11')
    },
    {
      id: '6',
      nome: 'MotoSpeed Ltda',
      email: 'contato@motospeed.com',
      telefone: '(11) 4444-4444',
      cpf: '12.345.678/0001-90',
      cep: '09210-580',
      endereco: 'Av. Industrial, 1000',
      bairro: 'Centro',
      cidade: 'Santo André',
      uf: 'SP',
      status: 'ativo',
      tipo: 'pessoa_juridica',
      observacoes: 'Empresa parceira - Frota de motos',
      dataCadastro: new Date('2023-11-15'),
      ultimaVisita: new Date('2024-07-09')
    }
  ];

  clientes = clientesSimulados;
  clientesFiltrados = [...clientes];
  renderizarTabela();
  atualizarEstatisticas();
  console.log('✅ Dados simulados carregados como fallback');
}

// Filtrar clientes
function filtrarClientes() {
  const busca = document.getElementById('buscarCliente').value.toLowerCase();
  const statusFiltro = document.getElementById('filtroStatus').value;
  const ordenacao = document.getElementById('filtroOrdem').value;

  clientesFiltrados = clientes.filter(cliente => {
    const matchBusca = cliente.nome.toLowerCase().includes(busca) ||
                      cliente.email.toLowerCase().includes(busca) ||
                      cliente.telefone.includes(busca);
    
    const matchStatus = !statusFiltro || cliente.status === statusFiltro;
    
    return matchBusca && matchStatus;
  });

  // Ordenar resultados
  clientesFiltrados.sort((a, b) => {
    switch (ordenacao) {
      case 'nome':
        return a.nome.localeCompare(b.nome);
      case 'data':
        return new Date(b.dataCadastro) - new Date(a.dataCadastro);
      case 'ultima_visita':
        return new Date(b.ultimaVisita) - new Date(a.ultimaVisita);
      default:
        return 0;
    }
  });

  paginaAtual = 1;
  renderizarTabela();
}

// Limpar filtros
function limparFiltros() {
  document.getElementById('buscarCliente').value = '';
  document.getElementById('filtroStatus').value = '';
  document.getElementById('filtroOrdem').value = 'nome';
  
  clientesFiltrados = [...clientes];
  paginaAtual = 1;
  renderizarTabela();
}

// Renderizar tabela
function renderizarTabela() {
  const corpoTabela = document.getElementById('corpoTabela');
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const clientesPagina = clientesFiltrados.slice(inicio, fim);

  corpoTabela.innerHTML = '';

  if (clientesPagina.length === 0) {
    corpoTabela.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-4">
          <i class="bi bi-inbox fs-1 text-muted"></i>
          <p class="text-muted mt-2">Nenhum cliente encontrado</p>
        </td>
      </tr>
    `;
  } else {
    clientesPagina.forEach(cliente => {
      const linha = document.createElement('tr');
      linha.classList.add('fade-in');
      
      const statusClass = {
        'ativo': 'success',
        'inativo': 'secondary',
        'vip': 'warning'
      }[cliente.status] || 'secondary';

      const statusIcon = {
        'ativo': 'check-circle',
        'inativo': 'x-circle',
        'vip': 'star'
      }[cliente.status] || 'circle';

      linha.innerHTML = `
        <td>
          <input type="checkbox" name="selecionarCliente" value="${cliente.id}" class="form-check-input">
        </td>
        <td>
          <div class="d-flex align-items-center">
            <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 32px; height: 32px;">
              <i class="bi bi-person text-white"></i>
            </div>
            <div>
              <div class="fw-bold">${cliente.nome}</div>
              <small class="text-muted">${cliente.cpf || 'CPF não informado'}</small>
            </div>
          </div>
        </td>
        <td>${cliente.email || '-'}</td>
        <td>${cliente.telefone}</td>
        <td>
          <span class="badge bg-${statusClass}">
            <i class="bi bi-${statusIcon}"></i> ${cliente.status.toUpperCase()}
          </span>
        </td>
        <td>
          <small class="text-muted">
            ${cliente.ultimaVisita ? formatarData(cliente.ultimaVisita) : 'Nunca'}
          </small>
        </td>
        <td>
          <div class="btn-group" role="group">
            <button class="btn btn-sm btn-outline-primary" onclick="editarCliente('${cliente.id}')" title="Editar">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-outline-info" onclick="visualizarCliente('${cliente.id}')" title="Visualizar">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="excluirCliente('${cliente.id}')" title="Excluir">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `;
      
      corpoTabela.appendChild(linha);
    });
  }

  renderizarPaginacao();
  atualizarInfoResultados();
}

// Renderizar paginação
function renderizarPaginacao() {
  const paginacao = document.getElementById('paginacao');
  const totalPaginas = Math.ceil(clientesFiltrados.length / itensPorPagina);
  
  paginacao.innerHTML = '';

  if (totalPaginas <= 1) return;

  // Botão anterior
  const anterior = document.createElement('li');
  anterior.className = `page-item ${paginaAtual === 1 ? 'disabled' : ''}`;
  anterior.innerHTML = `
    <a class="page-link" href="#" onclick="mudarPagina(${paginaAtual - 1})">
      <i class="bi bi-chevron-left"></i>
    </a>
  `;
  paginacao.appendChild(anterior);

  // Páginas
  for (let i = 1; i <= totalPaginas; i++) {
    if (i === 1 || i === totalPaginas || (i >= paginaAtual - 1 && i <= paginaAtual + 1)) {
      const pagina = document.createElement('li');
      pagina.className = `page-item ${i === paginaAtual ? 'active' : ''}`;
      pagina.innerHTML = `
        <a class="page-link" href="#" onclick="mudarPagina(${i})">${i}</a>
      `;
      paginacao.appendChild(pagina);
    } else if (i === paginaAtual - 2 || i === paginaAtual + 2) {
      const reticencias = document.createElement('li');
      reticencias.className = 'page-item disabled';
      reticencias.innerHTML = '<span class="page-link">...</span>';
      paginacao.appendChild(reticencias);
    }
  }

  // Botão próximo
  const proximo = document.createElement('li');
  proximo.className = `page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}`;
  proximo.innerHTML = `
    <a class="page-link" href="#" onclick="mudarPagina(${paginaAtual + 1})">
      <i class="bi bi-chevron-right"></i>
    </a>
  `;
  paginacao.appendChild(proximo);
}

// Mudar página
function mudarPagina(pagina) {
  const totalPaginas = Math.ceil(clientesFiltrados.length / itensPorPagina);
  if (pagina >= 1 && pagina <= totalPaginas) {
    paginaAtual = pagina;
    renderizarTabela();
  }
}

// Atualizar informações de resultados
function atualizarInfoResultados() {
  const inicio = (paginaAtual - 1) * itensPorPagina + 1;
  const fim = Math.min(inicio + itensPorPagina - 1, clientesFiltrados.length);
  const total = clientesFiltrados.length;
  
  document.getElementById('resultadosInfo').textContent = `${inicio}-${fim} de ${total}`;
}

// Atualizar estatísticas
function atualizarEstatisticas() {
  const total = clientes.length;
  const ativos = clientes.filter(c => c.status === 'ativo').length;
  const vips = clientes.filter(c => c.status === 'vip').length;
  const novos = clientes.filter(c => {
    const agora = new Date();
    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();
    const dataCadastro = new Date(c.dataCadastro);
    return dataCadastro.getMonth() === mesAtual && dataCadastro.getFullYear() === anoAtual;
  }).length;

  animarContador('totalClientes', total);
  animarContador('clientesAtivos', ativos);
  animarContador('clientesVIP', vips);
  animarContador('novosClientes', novos);
}

// Salvar cliente no Firebase
async function salvarCliente() {
  const form = document.getElementById('formCliente');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const dadosCliente = {
    nome: document.getElementById('nomeCliente').value,
    email: document.getElementById('emailCliente').value,
    telefone: document.getElementById('telefoneCliente').value,
    cpf: document.getElementById('cpfCliente').value,
    cep: document.getElementById('cepCliente').value,
    endereco: document.getElementById('enderecoCliente').value,
    bairro: document.getElementById('bairroCliente').value,
    cidade: document.getElementById('cidadeCliente').value,
    uf: document.getElementById('ufCliente').value,
    status: document.getElementById('statusCliente').value,
    tipo: document.getElementById('tipoCliente').value,
    observacoes: document.getElementById('observacoesCliente').value
  };

  mostrarLoading(true);

  try {
    // Verificar se o Firebase está disponível e tem permissões
    if (!db || typeof db.collection !== 'function' || !firebaseStatus.permissions) {
      console.warn('⚠️ Firebase não disponível ou sem permissões - salvando localmente');
      
      if (!firebaseStatus.connected) {
        mostrarNotificacao('Sem conexão - salvando dados localmente', 'warning');
      } else if (!firebaseStatus.permissions) {
        mostrarNotificacao('Sem permissões do servidor - salvando localmente', 'warning');
      }
      
      simularSalvamento(dadosCliente);
      return;
    }
    
    if (clienteEditando) {
      // Editar cliente existente
      console.log('🔄 Atualizando cliente no Firebase...');
      
      dadosCliente.ultimaVisita = firebase.firestore.Timestamp.fromDate(new Date());
      
      await db.collection('clientes').doc(clienteEditando.id).update(dadosCliente);
      
      mostrarNotificacao('Cliente atualizado com sucesso!', 'success');
      console.log('✅ Cliente atualizado no Firebase');
      
    } else {
      // Novo cliente
      console.log('🔄 Adicionando novo cliente no Firebase...');
      
      dadosCliente.dataCadastro = firebase.firestore.Timestamp.fromDate(new Date());
      dadosCliente.ultimaVisita = null;
      
      await db.collection('clientes').add(dadosCliente);
      
      mostrarNotificacao('Cliente cadastrado com sucesso!', 'success');
      console.log('✅ Cliente adicionado no Firebase');
    }
    
    // Recarregar lista de clientes
    await carregarClientes();
    
    // Fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('clienteModal'));
    modal.hide();
    
  } catch (error) {
    console.error('❌ Erro ao salvar cliente:', error);
    
    // Atualizar status do Firebase baseado no erro
    if (error.code === 'permission-denied') {
      firebaseStatus.permissions = false;
      firebaseStatus.error = 'permission-denied';
      mostrarNotificacao('Sem permissão para salvar - verifique configurações do Firestore', 'error');
      updateFirebaseStatus('🔴 Erro de permissão - dados salvos localmente', 'alert-danger');
    } else if (error.code === 'unavailable') {
      mostrarNotificacao('Servidor indisponível - salvando localmente', 'warning');
      updateFirebaseStatus('🟡 Servidor indisponível - modo offline', 'alert-warning');
    } else {
      mostrarNotificacao('Erro de conexão - salvando localmente', 'warning');
      updateFirebaseStatus('🔴 Erro de conexão - modo local ativo', 'alert-danger');
    }
    
    // Fallback para salvamento local
    simularSalvamento(dadosCliente);
    
    // Atualizar diagnóstico
    diagnosticarFirebase();
  } finally {
    mostrarLoading(false);
  }
}

// Simulação de salvamento para modo demo
function simularSalvamento(dadosCliente) {
  setTimeout(() => {
    if (clienteEditando) {
      // Atualizar cliente na lista local
      const index = clientes.findIndex(c => c.id === clienteEditando.id);
      if (index !== -1) {
        clientes[index] = { 
          ...clientes[index], 
          ...dadosCliente,
          ultimaVisita: new Date()
        };
      }
      mostrarNotificacao('Cliente atualizado com sucesso!', 'success');
    } else {
      // Adicionar novo cliente na lista local
      const novoCliente = {
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...dadosCliente,
        dataCadastro: new Date(),
        ultimaVisita: null
      };
      clientes.push(novoCliente);
      mostrarNotificacao('Cliente cadastrado com sucesso!', 'success');
    }
    
    clientesFiltrados = [...clientes];
    renderizarTabela();
    atualizarEstatisticas();
    
    // Fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('clienteModal'));
    modal.hide();
    
    mostrarLoading(false);
  }, 1000);
}

// Editar cliente
function editarCliente(id) {
  const cliente = clientes.find(c => c.id === id);
  if (!cliente) return;

  clienteEditando = cliente;
  
  document.getElementById('nomeCliente').value = cliente.nome;
  document.getElementById('emailCliente').value = cliente.email || '';
  document.getElementById('telefoneCliente').value = cliente.telefone;
  document.getElementById('cpfCliente').value = cliente.cpf || '';
  document.getElementById('cepCliente').value = cliente.cep || '';
  document.getElementById('enderecoCliente').value = cliente.endereco || '';
  document.getElementById('bairroCliente').value = cliente.bairro || '';
  document.getElementById('cidadeCliente').value = cliente.cidade || '';
  document.getElementById('ufCliente').value = cliente.uf || '';
  document.getElementById('statusCliente').value = cliente.status;
  document.getElementById('tipoCliente').value = cliente.tipo;
  document.getElementById('observacoesCliente').value = cliente.observacoes || '';

  document.getElementById('clienteModalLabel').innerHTML = `
    <i class="bi bi-pencil"></i> Editar Cliente
  `;

  const modal = new bootstrap.Modal(document.getElementById('clienteModal'));
  modal.show();
}

// Visualizar cliente
function visualizarCliente(id) {
  const cliente = clientes.find(c => c.id === id);
  if (!cliente) return;

  const detalhes = `
    <strong>Nome:</strong> ${cliente.nome}<br>
    <strong>Email:</strong> ${cliente.email || 'Não informado'}<br>
    <strong>Telefone:</strong> ${cliente.telefone}<br>
    <strong>CPF:</strong> ${cliente.cpf || 'Não informado'}<br>
    <strong>Endereço:</strong> ${cliente.endereco || 'Não informado'}<br>
    <strong>Cidade:</strong> ${cliente.cidade || 'Não informado'}<br>
    <strong>Status:</strong> ${cliente.status.toUpperCase()}<br>
    <strong>Tipo:</strong> ${cliente.tipo === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}<br>
    <strong>Data de Cadastro:</strong> ${formatarData(cliente.dataCadastro)}<br>
    <strong>Última Visita:</strong> ${cliente.ultimaVisita ? formatarData(cliente.ultimaVisita) : 'Nunca'}<br>
    <strong>Observações:</strong> ${cliente.observacoes || 'Nenhuma observação'}
  `;

  document.getElementById('confirmarModalLabel').textContent = 'Detalhes do Cliente';
  document.getElementById('confirmarTexto').innerHTML = detalhes;
  document.getElementById('confirmarAcao').style.display = 'none';

  const modal = new bootstrap.Modal(document.getElementById('confirmarModal'));
  modal.show();
}

// Excluir cliente do Firebase
async function excluirCliente(id) {
  const cliente = clientes.find(c => c.id === id);
  if (!cliente) return;

  document.getElementById('confirmarModalLabel').textContent = 'Excluir Cliente';
  document.getElementById('confirmarTexto').textContent = 
    `Tem certeza que deseja excluir o cliente "${cliente.nome}"? Esta ação não pode ser desfeita.`;
  document.getElementById('confirmarAcao').style.display = 'block';
  
  document.getElementById('confirmarAcao').onclick = async () => {
    mostrarLoading(true);
    
    try {
      // Verificar se o Firebase está disponível e tem permissões
      if (!db || !firebaseStatus.permissions) {
        console.warn('⚠️ Firebase não disponível ou sem permissões - excluindo localmente');
        
        if (!firebaseStatus.connected) {
          mostrarNotificacao('Sem conexão - excluindo dados localmente', 'warning');
        } else if (!firebaseStatus.permissions) {
          mostrarNotificacao('Sem permissões do servidor - excluindo localmente', 'warning');
        }
        
        simularExclusao(id);
        return;
      }
      
      console.log('🔄 Excluindo cliente do Firebase...');
      
      await db.collection('clientes').doc(id).delete();
      
      mostrarNotificacao('Cliente excluído com sucesso!', 'success');
      console.log('✅ Cliente excluído do Firebase');
      
      // Recarregar lista de clientes
      await carregarClientes();
      
    } catch (error) {
      console.error('❌ Erro ao excluir cliente:', error);
      
      // Atualizar status baseado no erro
      if (error.code === 'permission-denied') {
        firebaseStatus.permissions = false;
        firebaseStatus.error = 'permission-denied';
        mostrarNotificacao('Sem permissão para excluir - item removido localmente', 'warning');
        updateFirebaseStatus('🔴 Erro de permissão - exclusão local', 'alert-danger');
      } else if (error.code === 'unavailable') {
        mostrarNotificacao('Servidor indisponível - excluindo localmente', 'warning');
        updateFirebaseStatus('🟡 Servidor indisponível - modo offline', 'alert-warning');
      } else {
      
      // Atualizar diagnóstico
      diagnosticarFirebase();
    } finally {
      mostrarLoading(false);
    }
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmarModal'));
    modal.hide();
  };

  const modal = new bootstrap.Modal(document.getElementById('confirmarModal'));
  modal.show();
}

// Simulação de exclusão para modo local
function simularExclusao(id) {
  const index = clientes.findIndex(c => c.id === id);
  if (index !== -1) {
    const clienteRemovido = clientes[index];
    clientes.splice(index, 1);
    clientesFiltrados = [...clientes];
    renderizarTabela();
    atualizarEstatisticas();
    mostrarNotificacao(`Cliente "${clienteRemovido.nome}" excluído com sucesso!`, 'success');
    console.log('✅ Cliente excluído localmente');
  } else {
    mostrarNotificacao('Cliente não encontrado', 'warning');
  }
}

// Limpar formulário
function limparFormulario() {
  document.getElementById('formCliente').reset();
  clienteEditando = null;
  document.getElementById('clienteModalLabel').innerHTML = `
    <i class="bi bi-person-plus"></i> Novo Cliente
  `;
  
  // Limpar campos de endereço específicos
  limparCamposEndereco();
  
  // Remover classes de erro
  document.getElementById('cepCliente').classList.remove('is-invalid');
  document.getElementById('cepError').textContent = '';
}

// Exportar dados
function exportarDados() {
  const csv = gerarCSV();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  mostrarNotificacao('Dados exportados com sucesso!', 'success');
}

// Gerar CSV
function gerarCSV() {
  const headers = ['Nome', 'Email', 'Telefone', 'CPF', 'Endereço', 'Cidade', 'Status', 'Tipo', 'Data Cadastro', 'Última Visita', 'Observações'];
  const rows = clientes.map(cliente => [
    cliente.nome,
    cliente.email || '',
    cliente.telefone,
    cliente.cpf || '',
    cliente.endereco || '',
    cliente.cidade || '',
    cliente.status,
    cliente.tipo,
    formatarData(cliente.dataCadastro),
    cliente.ultimaVisita ? formatarData(cliente.ultimaVisita) : '',
    cliente.observacoes || ''
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return '\uFEFF' + csvContent; // BOM para UTF-8
}

// Buscar endereço por CEP usando a API ViaCEP
async function buscarEnderecoPorCep(cep) {
  if (!cep || cep.length !== 8) {
    mostrarNotificacao('CEP inválido', 'warning');
    return;
  }

  // Validar formato do CEP
  if (!/^\d{8}$/.test(cep)) {
    mostrarNotificacao('CEP deve conter apenas números', 'warning');
    return;
  }

  try {
    // Mostrar loading no botão
    const btnBuscar = document.getElementById('buscarCep');
    const iconOriginal = btnBuscar.innerHTML;
    btnBuscar.innerHTML = '<i class="bi bi-arrow-clockwise spin"></i>';
    btnBuscar.disabled = true;

    // Fazer requisição para API ViaCEP
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    
    if (!response.ok) {
      throw new Error('Erro na requisição');
    }

    const dados = await response.json();

    if (dados.erro) {
      throw new Error('CEP não encontrado');
    }

    // Preencher campos com os dados retornados
    preencherCamposEndereco(dados);
    
    // Mostrar notificação de sucesso
    mostrarNotificacao('Endereço encontrado!', 'success');
    
    // Dar foco no campo complemento/número
    setTimeout(() => {
      document.getElementById('enderecoCliente').focus();
    }, 100);

  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    
    if (error.message === 'CEP não encontrado') {
      mostrarNotificacao('CEP não encontrado. Verifique o número digitado.', 'warning');
      document.getElementById('cepCliente').classList.add('is-invalid');
      document.getElementById('cepError').textContent = 'CEP não encontrado';
    } else {
      mostrarNotificacao('Erro ao buscar CEP. Tente novamente.', 'danger');
    }
  } finally {
    // Restaurar botão
    const btnBuscar = document.getElementById('buscarCep');
    btnBuscar.innerHTML = iconOriginal;
    btnBuscar.disabled = false;
  }
}

// Preencher campos de endereço com dados do CEP
function preencherCamposEndereco(dados) {
  const campos = {
    enderecoCliente: dados.logradouro || '',
    bairroCliente: dados.bairro || '',
    cidadeCliente: dados.localidade || '',
    ufCliente: dados.uf || ''
  };

  // Preencher campos
  Object.keys(campos).forEach(campo => {
    const elemento = document.getElementById(campo);
    if (elemento) {
      elemento.value = campos[campo];
      // Adicionar animação de preenchimento
      elemento.classList.add('campo-preenchido');
      setTimeout(() => {
        elemento.classList.remove('campo-preenchido');
      }, 1000);
    }
  });

  // Remover classe de erro do CEP
  document.getElementById('cepCliente').classList.remove('is-invalid');
  document.getElementById('cepError').textContent = '';
}

// Limpar campos de endereço
function limparCamposEndereco() {
  const campos = ['enderecoCliente', 'bairroCliente', 'cidadeCliente', 'ufCliente'];
  campos.forEach(campo => {
    const elemento = document.getElementById(campo);
    if (elemento) {
      elemento.value = '';
    }
  });
}

// Validar CEP
function validarCep(cep) {
  const cepLimpo = cep.replace(/\D/g, '');
  return cepLimpo.length === 8 && /^\d{8}$/.test(cepLimpo);
}

// Formatar CEP
function formatarCep(cep) {
  const cepLimpo = cep.replace(/\D/g, '');
  return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2');
}

// Funções utilitárias
function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR');
}

function mostrarLoading(mostrar) {
  const spinner = document.getElementById('loadingSpinner');
  if (mostrar) {
    spinner.classList.remove('d-none');
  } else {
    spinner.classList.add('d-none');
  }
}

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
  
  setTimeout(() => {
    if (notificacao.parentNode) {
      notificacao.remove();
    }
  }, 5000);
}

function animarContador(elementId, valorFinal) {
  const elemento = document.getElementById(elementId);
  const valorInicial = 0;
  const duracao = 1000;
  const incremento = valorFinal / (duracao / 16);
  
  let valorAtual = valorInicial;
  
  const timer = setInterval(() => {
    valorAtual += incremento;
    if (valorAtual >= valorFinal) {
      valorAtual = valorFinal;
      clearInterval(timer);
    }
    
    elemento.textContent = Math.floor(valorAtual);
  }, 16);
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  // Adicionar animações aos elementos
  setTimeout(() => {
    const elementos = document.querySelectorAll('.card, .table');
    elementos.forEach((elemento, index) => {
      elemento.style.animationDelay = `${index * 0.1}s`;
      elemento.classList.add('fade-in');
    });
  }, 100);
});

// Tentar carregar dados do Firebase opcionalmente (sem quebrar a página)
async function tentarCarregarFirebase() {
  try {
    console.log('🔄 Tentando sincronização com Firebase...');
    updateFirebaseStatus('🔄 Testando permissões...', 'alert-info');
    
    // Teste rápido de permissão
    await db.collection('clientes').limit(1).get();
    
    console.log('✅ Firebase acessível - carregando dados...');
    firebaseStatus.permissions = true;
    firebaseStatus.error = null;
    
    const querySnapshot = await db.collection('clientes').orderBy('nome').get();
    
    const clientesFirebase = [];
    querySnapshot.forEach((doc) => {
      const clienteData = doc.data();
      clientesFirebase.push({
        id: doc.id,
        ...clienteData,
        dataCadastro: clienteData.dataCadastro && clienteData.dataCadastro.toDate ? 
          clienteData.dataCadastro.toDate() : 
          (clienteData.dataCadastro ? new Date(clienteData.dataCadastro) : new Date()),
        ultimaVisita: clienteData.ultimaVisita && clienteData.ultimaVisita.toDate ? 
          clienteData.ultimaVisita.toDate() : 
          (clienteData.ultimaVisita ? new Date(clienteData.ultimaVisita) : null)
      });
    });
    
    // Atualizar dados com clientes do Firebase (mesmo que seja lista vazia)
    clientes = clientesFirebase;
    clientesFiltrados = [...clientes];
    renderizarTabela();
    atualizarEstatisticas();
    
    if (clientesFirebase.length > 0) {
      mostrarNotificacao(`${clientesFirebase.length} clientes carregados do servidor`, 'success');
      console.log(`✅ ${clientesFirebase.length} clientes sincronizados do Firebase`);
      updateFirebaseStatus(`🟢 ${clientesFirebase.length} clientes carregados com sucesso`, 'alert-success');
    } else {
      mostrarNotificacao('Conectado ao servidor - lista vazia', 'info');
      console.log('✅ Conectado ao Firebase - nenhum cliente cadastrado');
      updateFirebaseStatus('🟢 Conectado - lista vazia (adicione seus primeiros clientes)', 'alert-success');
    }
    
    diagnosticarFirebase();
    
  } catch (error) {
    console.log('⚠️ Firebase indisponível - mantendo estado atual:', error.code);
    firebaseStatus.permissions = false;
    firebaseStatus.error = error.code || error.message;
    
    // Tratar diferentes tipos de erro com feedback específico
    if (error.code === 'permission-denied') {
      updateFirebaseStatus('🔴 Acesso negado - verifique as regras de segurança do Firestore', 'alert-danger');
      mostrarNotificacao('Sem permissão para acessar dados - verifique configurações', 'error');
    } else if (error.code === 'unavailable') {
      updateFirebaseStatus('🟡 Servidor indisponível - modo offline ativo', 'alert-warning');
      mostrarNotificacao('Servidor Firebase indisponível - funcionando offline', 'warning');
    } else if (error.code === 'unauthenticated') {
      updateFirebaseStatus('🟡 Não autenticado - faça login para acessar dados', 'alert-warning');
      mostrarNotificacao('Faça login para acessar todos os recursos', 'warning');
    } else {
      updateFirebaseStatus(`🔴 Erro de conexão: ${error.code || 'desconhecido'}`, 'alert-danger');
      mostrarNotificacao('Erro de conexão com banco de dados', 'error');
    }
    
    // Manter estado atual (lista vazia ou com dados locais)
    if (clientes.length === 0) {
      mostrarNotificacao('Sistema pronto em modo local - adicione seus clientes', 'info');
    }
    
    diagnosticarFirebase();
  }
}
