/**
 * Gerenciamento de Ordens de Serviço - MotoShop Pro
 * Sistema completo para gestão de ordens de serviço
 */

// Configuração do Firebase embutida
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "motoshop-pro.firebaseapp.com",
  projectId: "motoshop-pro",
  storageBucket: "motoshop-pro.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Variáveis globais
let db;
let auth;
let ordensCollection;
let isFirebaseReady = false;

// Dados simulados de ordens (fallback)
let ordens = [];

// Inicializar Firebase
async function initializeFirebase() {
  try {
    console.log('🔄 Inicializando Firebase para ordens...');
    
    // Verificar se Firebase está disponível
    if (typeof firebase === 'undefined') {
      throw new Error('Firebase SDK não carregado');
    }

    // Inicializar Firebase se ainda não foi inicializado
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Obter referências
    auth = firebase.auth();
    db = firebase.firestore();
    
    console.log('✅ Firebase inicializado com sucesso para ordens');
    isFirebaseReady = true;
    
    // Carregar dados do Firebase
    await carregarOrdensDoFirebase();
    
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error);
    console.log('📦 Usando dados simulados como fallback');
    
    // Usar dados simulados em caso de erro
    await carregarDadosSimulados();
    isFirebaseReady = false;
    
    return false;
  }
}

async function carregarDadosSimulados() {
    ordens = [
        {
            id: 1,
            numero: 'OS-2024-001',
            cliente: 'João Silva',
            clienteId: 1,
            moto: 'Honda CB 600F Hornet - 2018',
            motoId: 1,
            tipoServico: 'revisao',
            prioridade: 'media',
            status: 'aberta',
            dataAbertura: '2024-01-15',
            prazoEntrega: '2024-01-20',
            descricaoProblema: 'Revisão dos 10.000 km',
            observacoesTecnico: 'Verificar freios e trocar óleo',
            kmAtual: 10000,
            nivelCombustivel: '1/2',
            servicos: [
                { descricao: 'Troca de óleo', quantidade: 1, valor: 80.00 },
                { descricao: 'Revisão dos freios', quantidade: 1, valor: 150.00 }
            ],
            valorMaoObra: 100.00,
            valorPecas: 230.00,
            desconto: 0.00,
            valorTotal: 330.00,
            dataFinalizacao: null,
            tecnico: 'Carlos Santos'
        },
        {
            id: 2,
            numero: 'OS-2024-002',
            cliente: 'Maria Oliveira',
            clienteId: 2,
            moto: 'Yamaha YZF-R3 - 2020',
            motoId: 2,
            tipoServico: 'reparo',
            prioridade: 'alta',
            status: 'em_andamento',
            dataAbertura: '2024-01-16',
            prazoEntrega: '2024-01-18',
            descricaoProblema: 'Problema na embreagem',
            observacoesTecnico: 'Cabo da embreagem precisa ser substituído',
            kmAtual: 5500,
            nivelCombustivel: '1/4',
            servicos: [
                { descricao: 'Troca do cabo da embreagem', quantidade: 1, valor: 120.00 },
                { descricao: 'Regulagem da embreagem', quantidade: 1, valor: 80.00 }
            ],
            valorPecas: 200.00,
            desconto: 20.00,
            valorTotal: 300.00,
            dataFinalizacao: null,
            tecnico: 'Roberto Lima'
        }
    ];
    
    renderizarOrdens();
    atualizarEstatisticas();
}

// Carregar ordens do Firebase
async function carregarOrdensDoFirebase() {
  try {
    if (!isFirebaseReady || !db) {
      console.log('⚠️ Firebase não disponível, usando dados simulados');
      await carregarDadosSimulados();
      return;
    }

    console.log('🔄 Carregando ordens do Firebase...');
    
    const ordensRef = db.collection('ordens');
    const snapshot = await ordensRef.orderBy('dataAbertura', 'desc').get();
    
    ordens = [];
    snapshot.forEach((doc) => {
      ordens.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('✅ Ordens carregadas do Firebase:', ordens.length);
    renderizarOrdens();
    atualizarEstatisticas();
    
  } catch (error) {
    console.error('❌ Erro ao carregar ordens do Firebase:', error);
    console.log('📦 Usando dados simulados como fallback');
    await carregarDadosSimulados();
  }
}

// Simulação de clientes e motos (em produção, buscar do Firebase)
const clientes = [
  { id: 1, nome: 'João Silva', telefone: '(11) 99999-1111' },
  { id: 2, nome: 'Maria Oliveira', telefone: '(11) 99999-2222' },
  { id: 3, nome: 'Pedro Santos', telefone: '(11) 99999-3333' },
  { id: 4, nome: 'Ana Costa', telefone: '(11) 99999-4444' }
];

const motos = [
  { id: 1, marca: 'Honda', modelo: 'CB 600F Hornet', ano: 2018, clienteId: 1 },
  { id: 2, marca: 'Yamaha', modelo: 'YZF-R3', ano: 2020, clienteId: 2 },
  { id: 3, marca: 'Kawasaki', modelo: 'Ninja 300', ano: 2019, clienteId: 3 },
  { id: 4, marca: 'Suzuki', modelo: 'GSX-R 750', ano: 2017, clienteId: 4 }
];

// Variáveis globais
let ordensFiltradas = [];
let ordemEditandoId = null;
let paginaAtual = 1;
const itensPorPagina = 12;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  inicializarEventos();
  carregarClientes();
  carregarMotos();
  initializeFirebase();
  atualizarEstatisticas();
});

// Event Listeners
function inicializarEventos() {
  // Filtros e busca
  document.getElementById('buscarOrdem').addEventListener('input', filtrarOrdens);
  document.getElementById('filtroStatus').addEventListener('change', filtrarOrdens);
  document.getElementById('filtroPrioridade').addEventListener('change', filtrarOrdens);
  document.getElementById('filtroTipo').addEventListener('change', filtrarOrdens);
  document.getElementById('filtroOrdem').addEventListener('change', filtrarOrdens);
  document.getElementById('limparFiltros').addEventListener('click', limparFiltros);

  // Botões principais
  document.getElementById('exportarBtn').addEventListener('click', exportarCSV);
  document.getElementById('salvarOrdem').addEventListener('click', salvarOrdem);
  
  // Modal de ordem
  document.getElementById('ordemModal').addEventListener('show.bs.modal', function() {
    if (ordemEditandoId === null) {
      resetarFormulario();
      document.getElementById('ordemModalLabel').innerHTML = '<i class="bi bi-tools"></i> Nova Ordem de Serviço';
    }
  });

  // Cliente/Moto relacionamento
  document.getElementById('clienteOrdem').addEventListener('change', function() {
    const clienteId = parseInt(this.value);
    carregarMotosCliente(clienteId);
  });

  // Serviços dinâmicos
  document.getElementById('adicionarServico').addEventListener('click', adicionarServico);
  document.getElementById('servicosContainer').addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-servico') || e.target.parentElement.classList.contains('remove-servico')) {
      removerServico(e.target.closest('.servico-item'));
    }
  });

  // Cálculos automáticos
  document.getElementById('servicosContainer').addEventListener('input', calcularValores);
  document.getElementById('valorMaoObra').addEventListener('input', calcularValores);
  document.getElementById('desconto').addEventListener('input', calcularValores);

  // Detalhes da ordem
  document.getElementById('imprimirOrdem').addEventListener('click', imprimirOrdem);

  // Drag and drop para Kanban
  adicionarEventosDragDrop();

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('Tem certeza que deseja sair?')) {
      // Logout do Firebase se disponível
      if (isFirebaseReady && auth) {
        auth.signOut().then(() => {
          console.log('✅ Logout realizado com sucesso');
          window.location.href = 'login.html';
        }).catch((error) => {
          console.error('❌ Erro no logout:', error);
          window.location.href = 'login.html';
        });
      } else {
        // Logout local
        console.log('📱 Logout local realizado');
        window.location.href = 'login.html';
      }
    }
  });
}

// Carregar dados
function carregarClientes() {
  const select = document.getElementById('clienteOrdem');
  select.innerHTML = '<option value="">Selecione o cliente</option>';
  
  clientes.forEach(cliente => {
    const option = document.createElement('option');
    option.value = cliente.id;
    option.textContent = cliente.nome;
    select.appendChild(option);
  });
}

function carregarMotos() {
  const select = document.getElementById('motoOrdem');
  select.innerHTML = '<option value="">Selecione a moto</option>';
  
  motos.forEach(moto => {
    const option = document.createElement('option');
    option.value = moto.id;
    option.textContent = `${moto.marca} ${moto.modelo} - ${moto.ano}`;
    option.dataset.clienteId = moto.clienteId;
    select.appendChild(option);
  });
}

function carregarMotosCliente(clienteId) {
  const select = document.getElementById('motoOrdem');
  select.innerHTML = '<option value="">Selecione a moto</option>';
  
  const motosCliente = motos.filter(moto => moto.clienteId === clienteId);
  
  motosCliente.forEach(moto => {
    const option = document.createElement('option');
    option.value = moto.id;
    option.textContent = `${moto.marca} ${moto.modelo} - ${moto.ano}`;
    select.appendChild(option);
  });
}

function carregarOrdens() {
  ordensFiltradas = [...ordens];
  aplicarFiltros();
  renderizarKanban();
  atualizarEstatisticas();
}

// Filtros
function filtrarOrdens() {
  const busca = document.getElementById('buscarOrdem').value.toLowerCase();
  const status = document.getElementById('filtroStatus').value;
  const prioridade = document.getElementById('filtroPrioridade').value;
  const tipo = document.getElementById('filtroTipo').value;
  const ordenacao = document.getElementById('filtroOrdem').value;

  ordensFiltradas = ordens.filter(ordem => {
    const matchBusca = !busca || 
      ordem.numero.toLowerCase().includes(busca) ||
      ordem.cliente.toLowerCase().includes(busca) ||
      ordem.moto.toLowerCase().includes(busca) ||
      ordem.descricaoProblema.toLowerCase().includes(busca);

    const matchStatus = !status || ordem.status === status;
    const matchPrioridade = !prioridade || ordem.prioridade === prioridade;
    const matchTipo = !tipo || ordem.tipoServico === tipo;

    return matchBusca && matchStatus && matchPrioridade && matchTipo;
  });

  // Aplicar ordenação
  switch (ordenacao) {
    case 'numero':
      ordensFiltradas.sort((a, b) => a.numero.localeCompare(b.numero));
      break;
    case 'data':
      ordensFiltradas.sort((a, b) => new Date(b.dataAbertura) - new Date(a.dataAbertura));
      break;
    case 'prazo':
      ordensFiltradas.sort((a, b) => new Date(a.prazoEntrega) - new Date(b.prazoEntrega));
      break;
    case 'cliente':
      ordensFiltradas.sort((a, b) => a.cliente.localeCompare(b.cliente));
      break;
  }

  paginaAtual = 1;
  renderizarKanban();
  atualizarEstatisticas();
}

function aplicarFiltros() {
  filtrarOrdens();
}

function limparFiltros() {
  document.getElementById('buscarOrdem').value = '';
  document.getElementById('filtroStatus').value = '';
  document.getElementById('filtroPrioridade').value = '';
  document.getElementById('filtroTipo').value = '';
  document.getElementById('filtroOrdem').value = 'numero';
  
  setTimeout(() => {
    filtrarOrdens();
  }, 100);
}

// Renderização do Kanban
function renderizarKanban() {
  const colunas = {
    aberta: document.getElementById('columnAbertas'),
    em_andamento: document.getElementById('columnAndamento'),
    aguardando_pecas: document.getElementById('columnAguardando'),
    concluida: document.getElementById('columnConcluidas')
  };

  // Limpar colunas
  Object.values(colunas).forEach(coluna => {
    coluna.innerHTML = '';
  });

  // Contadores
  const contadores = {
    aberta: 0,
    em_andamento: 0,
    aguardando_pecas: 0,
    concluida: 0
  };

  ordensFiltradas.forEach(ordem => {
    const card = criarCardOrdem(ordem);
    
    if (colunas[ordem.status]) {
      colunas[ordem.status].appendChild(card);
      contadores[ordem.status]++;
    }
  });

  // Atualizar contadores
  document.getElementById('countAbertas').textContent = contadores.aberta;
  document.getElementById('countAndamento').textContent = contadores.em_andamento;
  document.getElementById('countAguardando').textContent = contadores.aguardando_pecas;
  document.getElementById('countConcluidas').textContent = contadores.concluida;

  // Atualizar info de resultados
  atualizarInfoResultados();
}

function criarCardOrdem(ordem) {
  const card = document.createElement('div');
  card.className = 'kanban-card';
  card.draggable = true;
  card.dataset.ordemId = ordem.id;

  const prioridadeClass = {
    baixa: 'success',
    media: 'warning',
    alta: 'danger',
    urgente: 'dark'
  };

  const statusClass = {
    aberta: 'secondary',
    em_andamento: 'warning',
    aguardando_pecas: 'info',
    concluida: 'success',
    cancelada: 'danger'
  };

  const isAtrasada = new Date(ordem.prazoEntrega) < new Date() && ordem.status !== 'concluida';

  card.innerHTML = `
    <div class="card-header d-flex justify-content-between align-items-center">
      <small class="text-muted">${ordem.numero}</small>
      <div class="d-flex gap-1">
        <span class="badge bg-${prioridadeClass[ordem.prioridade]}">${formatarPrioridade(ordem.prioridade)}</span>
        ${isAtrasada ? '<span class="badge bg-danger">Atrasada</span>' : ''}
      </div>
    </div>
    <div class="card-body">
      <h6 class="card-title">${ordem.cliente}</h6>
      <p class="card-text small text-muted">${ordem.moto}</p>
      <p class="card-text">${ordem.descricaoProblema}</p>
      <div class="d-flex justify-content-between align-items-center">
        <small class="text-muted">
          <i class="bi bi-calendar"></i> ${formatarData(ordem.prazoEntrega)}
        </small>
        <strong class="text-success">R$ ${ordem.valorTotal.toFixed(2)}</strong>
      </div>
    </div>
    <div class="card-footer">
      <div class="d-flex justify-content-between">
        <button class="btn btn-sm btn-outline-info" onclick="visualizarOrdem(${ordem.id})">
          <i class="bi bi-eye"></i>
        </button>
        <button class="btn btn-sm btn-outline-primary" onclick="editarOrdem(${ordem.id})">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="excluirOrdem(${ordem.id})">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  `;

  return card;
}

// Drag and Drop
function adicionarEventosDragDrop() {
  const colunas = document.querySelectorAll('.kanban-content');
  
  colunas.forEach(coluna => {
    coluna.addEventListener('dragover', function(e) {
      e.preventDefault();
      this.classList.add('drag-over');
    });

    coluna.addEventListener('dragleave', function(e) {
      e.preventDefault();
      this.classList.remove('drag-over');
    });

    coluna.addEventListener('drop', function(e) {
      e.preventDefault();
      this.classList.remove('drag-over');
      
      const ordemId = parseInt(e.dataTransfer.getData('text/plain'));
      const novoStatus = this.id.replace('column', '').toLowerCase();
      
      // Mapear IDs das colunas para status
      const statusMap = {
        'abertas': 'aberta',
        'andamento': 'em_andamento',
        'aguardando': 'aguardando_pecas',
        'concluidas': 'concluida'
      };
      
      const statusFinal = statusMap[novoStatus] || novoStatus;
      atualizarStatusOrdem(ordemId, statusFinal);
    });
  });

  // Adicionar evento de dragstart aos cards
  document.addEventListener('dragstart', function(e) {
    if (e.target.classList.contains('kanban-card')) {
      e.dataTransfer.setData('text/plain', e.target.dataset.ordemId);
    }
  });
}

function atualizarStatusOrdem(ordemId, novoStatus) {
  const ordem = ordens.find(o => o.id === ordemId);
  if (ordem) {
    ordem.status = novoStatus;
    
    // Se concluída, definir data de finalização
    if (novoStatus === 'concluida') {
      ordem.dataFinalizacao = new Date().toISOString().split('T')[0];
    } else {
      ordem.dataFinalizacao = null;
    }
    
    // Simular salvamento no Firebase
    mostrarNotificacao('Status da ordem atualizado com sucesso!', 'success');
    
    // Recarregar visualização
    carregarOrdens();
  }
}

// Estatísticas
function atualizarEstatisticas() {
  const hoje = new Date().toISOString().split('T')[0];
  
  const stats = {
    total: ordens.length,
    andamento: ordens.filter(o => o.status === 'em_andamento').length,
    concluidasHoje: ordens.filter(o => o.dataFinalizacao === hoje).length,
    atrasadas: ordens.filter(o => 
      new Date(o.prazoEntrega) < new Date() && 
      o.status !== 'concluida'
    ).length
  };

  document.getElementById('totalOrdens').textContent = stats.total;
  document.getElementById('ordensAndamento').textContent = stats.andamento;
  document.getElementById('ordensHoje').textContent = stats.concluidasHoje;
  document.getElementById('ordensAtraso').textContent = stats.atrasadas;
}

function atualizarInfoResultados() {
  const total = ordensFiltradas.length;
  const inicio = (paginaAtual - 1) * itensPorPagina + 1;
  const fim = Math.min(inicio + itensPorPagina - 1, total);
  
  document.getElementById('resultadosInfo').textContent = 
    `${inicio}-${fim} de ${total}`;
}

// CRUD de Ordens
function resetarFormulario() {
  document.getElementById('formOrdem').reset();
  document.getElementById('clienteOrdem').value = '';
  document.getElementById('motoOrdem').innerHTML = '<option value="">Selecione a moto</option>';
  document.getElementById('prioridade').value = 'media';
  document.getElementById('valorMaoObra').value = '0';
  document.getElementById('valorPecas').value = '0';
  document.getElementById('desconto').value = '0';
  document.getElementById('valorTotal').value = '0';
  
  // Resetar serviços
  const container = document.getElementById('servicosContainer');
  container.innerHTML = `
    <div class="servico-item mb-3">
      <div class="row g-2">
        <div class="col-md-5">
          <input type="text" class="form-control" placeholder="Descrição do serviço" name="servicoDescricao">
        </div>
        <div class="col-md-2">
          <input type="number" class="form-control" placeholder="Qtd" name="servicoQuantidade" value="1" min="1">
        </div>
        <div class="col-md-3">
          <input type="number" class="form-control" placeholder="Valor unitário" name="servicoValor" step="0.01" min="0">
        </div>
        <div class="col-md-2">
          <button type="button" class="btn btn-outline-danger remove-servico" disabled>
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  
  ordemEditandoId = null;
}

function salvarOrdem() {
  const form = document.getElementById('formOrdem');
  
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const cliente = clientes.find(c => c.id === parseInt(document.getElementById('clienteOrdem').value));
  const moto = motos.find(m => m.id === parseInt(document.getElementById('motoOrdem').value));
  
  const servicos = [];
  document.querySelectorAll('.servico-item').forEach(item => {
    const descricao = item.querySelector('[name="servicoDescricao"]').value;
    const quantidade = parseInt(item.querySelector('[name="servicoQuantidade"]').value) || 1;
    const valor = parseFloat(item.querySelector('[name="servicoValor"]').value) || 0;
    
    if (descricao.trim()) {
      servicos.push({ descricao, quantidade, valor });
    }
  });

  const ordem = {
    id: ordemEditandoId || Date.now(),
    numero: ordemEditandoId ? ordens.find(o => o.id === ordemEditandoId).numero : gerarNumeroOrdem(),
    cliente: cliente.nome,
    clienteId: cliente.id,
    moto: `${moto.marca} ${moto.modelo} - ${moto.ano}`,
    motoId: moto.id,
    tipoServico: document.getElementById('tipoServico').value,
    prioridade: document.getElementById('prioridade').value,
    status: ordemEditandoId ? ordens.find(o => o.id === ordemEditandoId).status : 'aberta',
    dataAbertura: ordemEditandoId ? ordens.find(o => o.id === ordemEditandoId).dataAbertura : new Date().toISOString().split('T')[0],
    prazoEntrega: document.getElementById('prazoEntrega').value,
    descricaoProblema: document.getElementById('descricaoProblema').value,
    observacoesTecnico: document.getElementById('observacoesTecnico').value,
    kmAtual: parseInt(document.getElementById('kmAtual').value) || 0,
    nivelCombustivel: document.getElementById('nivelCombustivel').value,
    servicos: servicos,
    valorMaoObra: parseFloat(document.getElementById('valorMaoObra').value) || 0,
    valorPecas: parseFloat(document.getElementById('valorPecas').value) || 0,
    desconto: parseFloat(document.getElementById('desconto').value) || 0,
    valorTotal: parseFloat(document.getElementById('valorTotal').value) || 0,
    dataFinalizacao: ordemEditandoId ? ordens.find(o => o.id === ordemEditandoId).dataFinalizacao : null,
    tecnico: 'Usuário Atual'
  };

  if (ordemEditandoId) {
    const index = ordens.findIndex(o => o.id === ordemEditandoId);
    ordens[index] = ordem;
    mostrarNotificacao('Ordem atualizada com sucesso!', 'success');
  } else {
    ordens.push(ordem);
    mostrarNotificacao('Ordem criada com sucesso!', 'success');
  }

  // Fechar modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('ordemModal'));
  modal.hide();

  // Recarregar dados
  carregarOrdens();
}

function editarOrdem(id) {
  const ordem = ordens.find(o => o.id === id);
  if (!ordem) return;

  ordemEditandoId = id;
  
  // Preencher formulário
  document.getElementById('clienteOrdem').value = ordem.clienteId;
  carregarMotosCliente(ordem.clienteId);
  
  setTimeout(() => {
    document.getElementById('motoOrdem').value = ordem.motoId;
    document.getElementById('tipoServico').value = ordem.tipoServico;
    document.getElementById('prioridade').value = ordem.prioridade;
    document.getElementById('prazoEntrega').value = ordem.prazoEntrega;
    document.getElementById('descricaoProblema').value = ordem.descricaoProblema;
    document.getElementById('observacoesTecnico').value = ordem.observacoesTecnico;
    document.getElementById('kmAtual').value = ordem.kmAtual;
    document.getElementById('nivelCombustivel').value = ordem.nivelCombustivel;
    document.getElementById('valorMaoObra').value = ordem.valorMaoObra;
    document.getElementById('desconto').value = ordem.desconto;
    
    // Preencher serviços
    const container = document.getElementById('servicosContainer');
    container.innerHTML = '';
    
    ordem.servicos.forEach((servico, index) => {
      const servicoDiv = document.createElement('div');
      servicoDiv.className = 'servico-item mb-3';
      servicoDiv.innerHTML = `
        <div class="row g-2">
          <div class="col-md-5">
            <input type="text" class="form-control" placeholder="Descrição do serviço" name="servicoDescricao" value="${servico.descricao}">
          </div>
          <div class="col-md-2">
            <input type="number" class="form-control" placeholder="Qtd" name="servicoQuantidade" value="${servico.quantidade}" min="1">
          </div>
          <div class="col-md-3">
            <input type="number" class="form-control" placeholder="Valor unitário" name="servicoValor" step="0.01" min="0" value="${servico.valor}">
          </div>
          <div class="col-md-2">
            <button type="button" class="btn btn-outline-danger remove-servico" ${index === 0 ? 'disabled' : ''}>
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      `;
      container.appendChild(servicoDiv);
    });
    
    if (ordem.servicos.length === 0) {
      adicionarServico();
    }
    
    calcularValores();
  }, 100);

  // Atualizar título do modal
  document.getElementById('ordemModalLabel').innerHTML = '<i class="bi bi-pencil"></i> Editar Ordem de Serviço';
  
  // Abrir modal
  const modal = new bootstrap.Modal(document.getElementById('ordemModal'));
  modal.show();
}

function visualizarOrdem(id) {
  const ordem = ordens.find(o => o.id === id);
  if (!ordem) return;

  const content = document.getElementById('detalhesOrdemContent');
  content.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <h6 class="text-primary">Informações Básicas</h6>
        <table class="table table-borderless table-sm">
          <tr><td><strong>Número:</strong></td><td>${ordem.numero}</td></tr>
          <tr><td><strong>Cliente:</strong></td><td>${ordem.cliente}</td></tr>
          <tr><td><strong>Moto:</strong></td><td>${ordem.moto}</td></tr>
          <tr><td><strong>Tipo:</strong></td><td>${formatarTipoServico(ordem.tipoServico)}</td></tr>
          <tr><td><strong>Prioridade:</strong></td><td><span class="badge bg-${getPrioridadeClass(ordem.prioridade)}">${formatarPrioridade(ordem.prioridade)}</span></td></tr>
          <tr><td><strong>Status:</strong></td><td><span class="badge bg-${getStatusClass(ordem.status)}">${formatarStatus(ordem.status)}</span></td></tr>
        </table>
      </div>
      <div class="col-md-6">
        <h6 class="text-primary">Datas e Prazos</h6>
        <table class="table table-borderless table-sm">
          <tr><td><strong>Data Abertura:</strong></td><td>${formatarData(ordem.dataAbertura)}</td></tr>
          <tr><td><strong>Prazo Entrega:</strong></td><td>${formatarData(ordem.prazoEntrega)}</td></tr>
          <tr><td><strong>Data Finalização:</strong></td><td>${ordem.dataFinalizacao ? formatarData(ordem.dataFinalizacao) : 'Não finalizada'}</td></tr>
          <tr><td><strong>Técnico:</strong></td><td>${ordem.tecnico}</td></tr>
          <tr><td><strong>KM Atual:</strong></td><td>${ordem.kmAtual.toLocaleString()} km</td></tr>
          <tr><td><strong>Combustível:</strong></td><td>${ordem.nivelCombustivel}</td></tr>
        </table>
      </div>
    </div>
    
    <div class="row mt-3">
      <div class="col-12">
        <h6 class="text-primary">Descrição do Problema</h6>
        <p>${ordem.descricaoProblema}</p>
      </div>
    </div>
    
    ${ordem.observacoesTecnico ? `
    <div class="row mt-3">
      <div class="col-12">
        <h6 class="text-primary">Observações do Técnico</h6>
        <p>${ordem.observacoesTecnico}</p>
      </div>
    </div>
    ` : ''}
    
    <div class="row mt-3">
      <div class="col-12">
        <h6 class="text-primary">Serviços</h6>
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Qtd</th>
                <th>Valor Unit.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${ordem.servicos.map(servico => `
                <tr>
                  <td>${servico.descricao}</td>
                  <td>${servico.quantidade}</td>
                  <td>R$ ${servico.valor.toFixed(2)}</td>
                  <td>R$ ${(servico.quantidade * servico.valor).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div class="row mt-3">
      <div class="col-md-6 offset-md-6">
        <table class="table table-borderless">
          <tr><td><strong>Mão de Obra:</strong></td><td class="text-end">R$ ${ordem.valorMaoObra.toFixed(2)}</td></tr>
          <tr><td><strong>Peças:</strong></td><td class="text-end">R$ ${ordem.valorPecas.toFixed(2)}</td></tr>
          <tr><td><strong>Desconto:</strong></td><td class="text-end">R$ ${ordem.desconto.toFixed(2)}</td></tr>
          <tr class="table-success"><td><strong>Total:</strong></td><td class="text-end"><strong>R$ ${ordem.valorTotal.toFixed(2)}</strong></td></tr>
        </table>
      </div>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById('detalhesOrdemModal'));
  modal.show();
}

function excluirOrdem(id) {
  const ordem = ordens.find(o => o.id === id);
  if (!ordem) return;

  document.getElementById('confirmarTexto').textContent = 
    `Tem certeza que deseja excluir a ordem ${ordem.numero}?`;
  
  document.getElementById('confirmarAcao').onclick = function() {
    const index = ordens.findIndex(o => o.id === id);
    ordens.splice(index, 1);
    
    mostrarNotificacao('Ordem excluída com sucesso!', 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmarModal'));
    modal.hide();
    
    carregarOrdens();
  };

  const modal = new bootstrap.Modal(document.getElementById('confirmarModal'));
  modal.show();
}

// Serviços dinâmicos
function adicionarServico() {
  const container = document.getElementById('servicosContainer');
  const servicoDiv = document.createElement('div');
  servicoDiv.className = 'servico-item mb-3';
  servicoDiv.innerHTML = `
    <div class="row g-2">
      <div class="col-md-5">
        <input type="text" class="form-control" placeholder="Descrição do serviço" name="servicoDescricao">
      </div>
      <div class="col-md-2">
        <input type="number" class="form-control" placeholder="Qtd" name="servicoQuantidade" value="1" min="1">
      </div>
      <div class="col-md-3">
        <input type="number" class="form-control" placeholder="Valor unitário" name="servicoValor" step="0.01" min="0">
      </div>
      <div class="col-md-2">
        <button type="button" class="btn btn-outline-danger remove-servico">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  `;
  container.appendChild(servicoDiv);
  
  atualizarBotoesRemover();
}

function removerServico(servicoItem) {
  servicoItem.remove();
  atualizarBotoesRemover();
  calcularValores();
}

function atualizarBotoesRemover() {
  const servicos = document.querySelectorAll('.servico-item');
  servicos.forEach((servico, index) => {
    const botao = servico.querySelector('.remove-servico');
    botao.disabled = index === 0 && servicos.length === 1;
  });
}

// Cálculos
function calcularValores() {
  let valorPecas = 0;
  
  document.querySelectorAll('.servico-item').forEach(item => {
    const quantidade = parseInt(item.querySelector('[name="servicoQuantidade"]').value) || 0;
    const valor = parseFloat(item.querySelector('[name="servicoValor"]').value) || 0;
    valorPecas += quantidade * valor;
  });

  const valorMaoObra = parseFloat(document.getElementById('valorMaoObra').value) || 0;
  const desconto = parseFloat(document.getElementById('desconto').value) || 0;
  const valorTotal = valorMaoObra + valorPecas - desconto;

  document.getElementById('valorPecas').value = valorPecas.toFixed(2);
  document.getElementById('valorTotal').value = valorTotal.toFixed(2);
}

// Utilitários
function gerarNumeroOrdem() {
  const ano = new Date().getFullYear();
  const numero = (ordens.length + 1).toString().padStart(3, '0');
  return `OS-${ano}-${numero}`;
}

function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR');
}

function formatarTipoServico(tipo) {
  const tipos = {
    'revisao': 'Revisão',
    'manutencao': 'Manutenção',
    'reparo': 'Reparo',
    'diagnostico': 'Diagnóstico'
  };
  return tipos[tipo] || tipo;
}

function formatarPrioridade(prioridade) {
  const prioridades = {
    'baixa': 'Baixa',
    'media': 'Média',
    'alta': 'Alta',
    'urgente': 'Urgente'
  };
  return prioridades[prioridade] || prioridade;
}

function formatarStatus(status) {
  const statuses = {
    'aberta': 'Aberta',
    'em_andamento': 'Em Andamento',
    'aguardando_pecas': 'Aguardando Peças',
    'concluida': 'Concluída',
    'cancelada': 'Cancelada'
  };
  return statuses[status] || status;
}

function getPrioridadeClass(prioridade) {
  const classes = {
    'baixa': 'success',
    'media': 'warning',
    'alta': 'danger',
    'urgente': 'dark'
  };
  return classes[prioridade] || 'secondary';
}

function getStatusClass(status) {
  const classes = {
    'aberta': 'secondary',
    'em_andamento': 'warning',
    'aguardando_pecas': 'info',
    'concluida': 'success',
    'cancelada': 'danger'
  };
  return classes[status] || 'secondary';
}

// Exportação
function exportarCSV() {
  const dados = ordensFiltradas.map(ordem => ({
    'Número': ordem.numero,
    'Cliente': ordem.cliente,
    'Moto': ordem.moto,
    'Tipo': formatarTipoServico(ordem.tipoServico),
    'Prioridade': formatarPrioridade(ordem.prioridade),
    'Status': formatarStatus(ordem.status),
    'Data Abertura': formatarData(ordem.dataAbertura),
    'Prazo Entrega': formatarData(ordem.prazoEntrega),
    'Problema': ordem.descricaoProblema,
    'Valor Total': `R$ ${ordem.valorTotal.toFixed(2)}`,
    'Técnico': ordem.tecnico
  }));

  const csv = gerarCSV(dados);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ordens_servico_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  mostrarNotificacao('Dados exportados com sucesso!', 'success');
}

function gerarCSV(dados) {
  if (dados.length === 0) return '';
  
  const headers = Object.keys(dados[0]);
  const csvContent = [
    headers.join(','),
    ...dados.map(linha => 
      headers.map(header => `"${linha[header] || ''}"`).join(',')
    )
  ].join('\n');
  
  return csvContent;
}

// Impressão
function imprimirOrdem() {
  const content = document.getElementById('detalhesOrdemContent');
  const printWindow = window.open('', '_blank');
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Ordem de Serviço</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .table { width: 100%; border-collapse: collapse; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background-color: #f2f2f2; }
          .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          .bg-success { background-color: #d4edda; color: #155724; }
          .bg-warning { background-color: #fff3cd; color: #856404; }
          .bg-danger { background-color: #f8d7da; color: #721c24; }
          .bg-info { background-color: #d1ecf1; color: #0c5460; }
          .bg-secondary { background-color: #f8f9fa; color: #6c757d; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <h1>MotoShop Pro - Ordem de Serviço</h1>
        ${content.innerHTML}
        <script>window.print();</script>
      </body>
    </html>
  `);
  
  printWindow.document.close();
}

// Notificações
function mostrarNotificacao(mensagem, tipo = 'info') {
  // Criar elemento de notificação
  const notification = document.createElement('div');
  notification.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
  notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
  notification.innerHTML = `
    ${mensagem}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  document.body.appendChild(notification);
  
  // Remover automaticamente após 5 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}

// Animações
function adicionarAnimacaoCard() {
  const cards = document.querySelectorAll('.kanban-card');
  cards.forEach((card, index) => {
    card.style.animation = `slideInUp 0.5s ease-out ${index * 0.1}s both`;
  });
}

// CSS para animações (adicionar ao style.css)
const styles = `
  @keyframes slideInUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .kanban-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .kanban-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
  
  .drag-over {
    background-color: #e3f2fd;
    border: 2px dashed #2196f3;
  }
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Funcionalidade de logout
document.getElementById('logoutBtn')?.addEventListener('click', function() {
  if (confirm('Tem certeza que deseja sair?')) {
    // Logout do Firebase se disponível
    if (isFirebaseReady && auth) {
      auth.signOut().then(() => {
        console.log('✅ Logout realizado com sucesso');
        window.location.href = 'login.html';
      }).catch((error) => {
        console.error('❌ Erro no logout:', error);
        window.location.href = 'login.html';
      });
    } else {
      // Logout local
      console.log('📱 Logout local realizado');
      window.location.href = 'login.html';
    }
  }
});

// Verificar autenticação
function verificarAutenticacao() {
  if (isFirebaseReady && auth) {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log('⚠️ Usuário não autenticado, redirecionando...');
        window.location.href = 'login.html';
      } else {
        console.log('✅ Usuário autenticado:', user.email);
        // Atualizar UI com nome do usuário
        const userSpan = document.querySelector('.text-light span');
        if (userSpan) {
          userSpan.innerHTML = `<i class="bi bi-person-circle"></i> ${user.displayName || user.email}`;
        }
      }
    });
  }
}

// Inicializar verificação de autenticação
setTimeout(verificarAutenticacao, 1000);
