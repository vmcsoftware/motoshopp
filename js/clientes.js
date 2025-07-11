// Aguardar inicialização do Firebase
let db, auth;

// Função para aguardar inicialização do Firebase
function waitForFirebaseInit() {
  return new Promise((resolve) => {
    if (window.isFirebaseInitialized && window.isFirebaseInitialized()) {
      db = window.getFirestore();
      auth = window.getAuth();
      resolve();
    } else {
      setTimeout(() => waitForFirebaseInit().then(resolve), 100);
    }
  });
}

// Inicializar Firebase quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
    // Inicializar Firebase usando a configuração centralizada
    const firebaseServices = initializeFirebase();
    db = firebaseServices.db;
    auth = firebaseServices.auth;
    
    // Inicializar a página após Firebase estar pronto
    setTimeout(() => {
      inicializarPagina();
    }, 500);
  } else {
    // Firebase já foi inicializado
    waitForFirebaseInit().then(() => {
      inicializarPagina();
    });
  }
});

// Variáveis globais
let clientes = [];
let clientesFiltrados = [];
let clienteEditando = null;
let paginaAtual = 1;
const itensPorPagina = 10;

// Verificar se está logado
function verificarAutenticacao() {
  if (!auth) {
    console.log('⚠️ Firebase Auth não disponível');
    return;
  }
  
  auth.onAuthStateChanged((user) => {
    if (!user) {
      console.log('⚠️ Usuário não autenticado - usando modo demo');
      // Para demo, vamos continuar funcionando
    } else {
      console.log('✅ Usuário autenticado:', user.email);
    }
  });
}

// Inicializar página
function inicializarPagina() {
  console.log('🚀 Inicializando página de clientes...');
  
  // Verificar se o Firebase está disponível
  if (!db) {
    console.warn('⚠️ Firebase não disponível - usando modo demo');
    // Em modo demo, pode continuar com dados mock
  }
  
  verificarAutenticacao();
  configurarEventos();
  carregarClientes();
  configurarMascaras();
  configurarBuscaCEP();
  
  console.log('✅ Página de clientes inicializada com sucesso!');
}

// Configurar eventos
function configurarEventos() {
  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja sair?')) {
      auth.signOut().then(() => {
        window.location.href = 'login.html';
      });
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
    if (!db) {
      console.warn('⚠️ Firebase não disponível - usando dados simulados');
      carregarDadosSimulados();
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
        // Converter timestamps do Firebase para Date usando utilitário
        dataCadastro: window.FirestoreUtils ? 
          window.FirestoreUtils.timestampToDate(clienteData.dataCadastro) : 
          (clienteData.dataCadastro ? clienteData.dataCadastro.toDate() : new Date()),
        ultimaVisita: window.FirestoreUtils ? 
          window.FirestoreUtils.timestampToDate(clienteData.ultimaVisita) : 
          (clienteData.ultimaVisita ? clienteData.ultimaVisita.toDate() : null)
      });
    });
    
    console.log(`✅ ${clientes.length} clientes carregados do Firebase`);
    
    // Se não há clientes, criar alguns dados de exemplo
    if (clientes.length === 0) {
      console.log('📝 Criando dados de exemplo...');
      await criarDadosExemplo();
    }
    
    clientesFiltrados = [...clientes];
    renderizarTabela();
    atualizarEstatisticas();
    
  } catch (error) {
    console.error('❌ Erro ao carregar clientes:', error);
    mostrarNotificacao('Erro ao carregar clientes do banco de dados', 'danger');
    
    // Fallback para dados simulados em caso de erro
    console.log('🔄 Usando dados simulados como fallback...');
    carregarDadosSimulados();
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
      observacoes: 'Cliente VIP',
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
      observacoes: 'Cliente desde 2020',
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
      observacoes: '',
      dataCadastro: new Date('2023-03-20'),
      ultimaVisita: new Date('2024-06-25')
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
    // Verificar se o Firebase está disponível
    if (!db) {
      console.warn('⚠️ Firebase não disponível - simulando salvamento');
      simularSalvamento(dadosCliente);
      return;
    }
    
    if (clienteEditando) {
      // Editar cliente existente
      console.log('🔄 Atualizando cliente no Firebase...');
      
      dadosCliente.ultimaVisita = window.FirestoreUtils ? 
        window.FirestoreUtils.serverTimestamp() : 
        firebase.firestore.Timestamp.fromDate(new Date());
      
      await db.collection('clientes').doc(clienteEditando.id).update(dadosCliente);
      
      mostrarNotificacao('Cliente atualizado com sucesso!', 'success');
      console.log('✅ Cliente atualizado no Firebase');
      
    } else {
      // Novo cliente
      console.log('🔄 Adicionando novo cliente no Firebase...');
      
      dadosCliente.dataCadastro = window.FirestoreUtils ? 
        window.FirestoreUtils.serverTimestamp() : 
        firebase.firestore.Timestamp.fromDate(new Date());
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
    mostrarNotificacao('Erro ao salvar cliente no banco de dados', 'danger');
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
        clientes[index] = { ...clientes[index], ...dadosCliente };
      }
      mostrarNotificacao('Cliente atualizado com sucesso! (Modo Demo)', 'success');
    } else {
      // Adicionar novo cliente na lista local
      const novoCliente = {
        id: Date.now().toString(),
        ...dadosCliente,
        dataCadastro: new Date(),
        ultimaVisita: null
      };
      clientes.push(novoCliente);
      mostrarNotificacao('Cliente cadastrado com sucesso! (Modo Demo)', 'success');
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
      console.log('🔄 Excluindo cliente do Firebase...');
      
      await db.collection('clientes').doc(id).delete();
      
      mostrarNotificacao('Cliente excluído com sucesso!', 'success');
      console.log('✅ Cliente excluído do Firebase');
      
      // Recarregar lista de clientes
      await carregarClientes();
      
    } catch (error) {
      console.error('❌ Erro ao excluir cliente:', error);
      mostrarNotificacao('Erro ao excluir cliente do banco de dados', 'danger');
    } finally {
      mostrarLoading(false);
    }
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmarModal'));
    modal.hide();
  };

  const modal = new bootstrap.Modal(document.getElementById('confirmarModal'));
  modal.show();
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
