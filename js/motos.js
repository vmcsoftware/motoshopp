// Configuração do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    doc,
    orderBy,
    query,
    onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Importar configuração do Firebase
let db;
let motosCollection;

// Inicializar Firebase
async function initializeFirebase() {
    try {
        // Buscar configuração do Firebase
        const response = await fetch('./js/firebase-config.js');
        const configText = await response.text();
        
        // Extrair configuração do texto
        const configMatch = configText.match(/const firebaseConfig = ({[\s\S]*?});/);
        if (configMatch) {
            const firebaseConfig = eval('(' + configMatch[1] + ')');
            
            // Inicializar Firebase
            const app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            motosCollection = collection(db, 'motos');
            
            console.log('Firebase inicializado com sucesso para motos');
            
            // Carregar dados do Firebase
            await carregarMotosDoFirebase();
            
            return true;
        }
    } catch (error) {
        console.error('Erro ao inicializar Firebase:', error);
        // Usar dados simulados em caso de erro
        await carregarDadosSimulados();
        return false;
    }
}

// Variáveis globais
let motos = [];
let motosFiltradas = [];
let motoEditando = null;
let clientes = [];
let paginaAtual = 1;
const itensPorPagina = 12;

// Dados simulados de motos (fallback)
async function carregarDadosSimulados() {
    motos = [
        {
            id: 1,
            marca: 'Honda',
            modelo: 'CB 600F Hornet',
            ano: 2020,
            proprietario: 'João Silva',
            placa: 'ABC-1234',
            telefone: '(11) 99999-9999',
            status: 'Em serviço',
            ultimaRevisao: '2024-01-15',
            proximaRevisao: '2024-07-15',
            km: 15000,
            observacoes: 'Troca de óleo pendente'
        },
        {
            id: 2,
            marca: 'Yamaha',
            modelo: 'MT-07',
            ano: 2021,
            proprietario: 'Maria Santos',
            placa: 'XYZ-5678',
            telefone: '(11) 88888-8888',
            status: 'Aguardando peças',
            ultimaRevisao: '2024-02-20',
            proximaRevisao: '2024-08-20',
            km: 8500,
            observacoes: 'Problema no freio traseiro'
        },
        {
            id: 3,
            marca: 'Suzuki',
            modelo: 'GSX-R 750',
            ano: 2019,
            proprietario: 'Pedro Costa',
            placa: 'DEF-9876',
            telefone: '(11) 77777-7777',
            status: 'Concluído',
            ultimaRevisao: '2024-03-10',
            proximaRevisao: '2024-09-10',
            km: 22000,
            observacoes: 'Revisão completa realizada'
        }
    ];
    
    motosFiltradas = [...motos];
    renderizarMotos();
}

// Carregar motos do Firebase
async function carregarMotosDoFirebase() {
    try {
        const q = query(motosCollection, orderBy('marca'));
        const querySnapshot = await getDocs(q);
        
        motos = [];
        querySnapshot.forEach((doc) => {
            motos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log('Motos carregadas do Firebase:', motos.length);
        motosFiltradas = [...motos];
        renderizarMotos();
    } catch (error) {
        console.error('Erro ao carregar motos do Firebase:', error);
        await carregarDadosSimulados();
    }
}

// Inicializar página
async function inicializarPagina() {
    configurarEventos();
    await initializeFirebase();
    carregarClientes();
    configurarMascaras();
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

  // Busca em tempo real
  document.getElementById('buscarMoto').addEventListener('input', filtrarMotos);

  // Filtros
  document.getElementById('filtroMarca').addEventListener('change', filtrarMotos);
  document.getElementById('filtroStatus').addEventListener('change', filtrarMotos);
  document.getElementById('filtroAno').addEventListener('change', filtrarMotos);
  document.getElementById('filtroOrdem').addEventListener('change', filtrarMotos);
  document.getElementById('limparFiltros').addEventListener('click', limparFiltros);

  // Salvar moto
  document.getElementById('salvarMoto').addEventListener('click', salvarMoto);

  // Exportar dados
  document.getElementById('exportarBtn').addEventListener('click', exportarDados);

  // Limpar formulário ao fechar modal
  document.getElementById('motoModal').addEventListener('hidden.bs.modal', limparFormulario);
}

// Configurar máscaras de input
function configurarMascaras() {
  // Máscara para placa
  document.getElementById('placa').addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (value.length <= 7) {
      if (value.length >= 4) {
        value = value.slice(0, 3) + '-' + value.slice(3);
      }
      e.target.value = value;
    }
  });

  // Máscara para RENAVAM
  document.getElementById('renavam').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    e.target.value = value;
  });

  // Máscara para chassi
  document.getElementById('chassi').addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (value.length > 17) {
      value = value.slice(0, 17);
    }
    e.target.value = value;
  });
}

// Carregar clientes para o select
function carregarClientes() {
  // Simulando dados de clientes
  const clientesSimulados = [
    { id: '1', nome: 'João Silva' },
    { id: '2', nome: 'Maria Santos' },
    { id: '3', nome: 'Pedro Oliveira' },
    { id: '4', nome: 'Ana Costa' },
    { id: '5', nome: 'Carlos Ferreira' }
  ];

  clientes = clientesSimulados;
  
  const selectProprietario = document.getElementById('proprietario');
  selectProprietario.innerHTML = '<option value="">Selecione o proprietário</option>';
  
  clientes.forEach(cliente => {
    const option = document.createElement('option');
    option.value = cliente.id;
    option.textContent = cliente.nome;
    selectProprietario.appendChild(option);
  });

  // Versão com Firebase (comentada)
  /*
  db.collection('clientes').orderBy('nome').get().then((snapshot) => {
    clientes = [];
    snapshot.forEach((doc) => {
      clientes.push({
        id: doc.id,
        nome: doc.data().nome
      });
    });
    
    const selectProprietario = document.getElementById('proprietario');
    selectProprietario.innerHTML = '<option value="">Selecione o proprietário</option>';
    
    clientes.forEach(cliente => {
      const option = document.createElement('option');
      option.value = cliente.id;
      option.textContent = cliente.nome;
      selectProprietario.appendChild(option);
    });
  });
  */
}

// Carregar motos (removido - agora usa Firebase)
// Esta função foi substituída por carregarMotosDoFirebase()
// (O trecho de código de motos simuladas está duplicado e fora de contexto, causando erro de sintaxe. Remova este bloco.)

// Filtrar motos
function filtrarMotos() {
  const busca = document.getElementById('buscarMoto').value.toLowerCase();
  const marcaFiltro = document.getElementById('filtroMarca').value;
  const statusFiltro = document.getElementById('filtroStatus').value;
  const anoFiltro = document.getElementById('filtroAno').value;
  const ordenacao = document.getElementById('filtroOrdem').value;

  motosFiltradas = motos.filter(moto => {
    const matchBusca = moto.modelo.toLowerCase().includes(busca) ||
                      moto.marca.toLowerCase().includes(busca) ||
                      moto.placa.toLowerCase().includes(busca) ||
                      moto.proprietarioNome.toLowerCase().includes(busca);
    
    const matchMarca = !marcaFiltro || moto.marca === marcaFiltro;
    const matchStatus = !statusFiltro || moto.status === statusFiltro;
    
    let matchAno = true;
    if (anoFiltro) {
      if (anoFiltro === 'antigo') {
        matchAno = moto.ano < 2020;
      } else {
        matchAno = moto.ano.toString() === anoFiltro;
      }
    }
    
    return matchBusca && matchMarca && matchStatus && matchAno;
  });

  // Ordenar resultados
  motosFiltradas.sort((a, b) => {
    switch (ordenacao) {
      case 'modelo':
        return a.modelo.localeCompare(b.modelo);
      case 'marca':
        return a.marca.localeCompare(b.marca);
      case 'ano':
        return b.ano - a.ano;
      case 'cliente':
        return a.proprietarioNome.localeCompare(b.proprietarioNome);
      default:
        return 0;
    }
  });

  paginaAtual = 1;
  renderizarMotos();
}

// Limpar filtros
function limparFiltros() {
  document.getElementById('buscarMoto').value = '';
  document.getElementById('filtroMarca').value = '';
  document.getElementById('filtroStatus').value = '';
  document.getElementById('filtroAno').value = '';
  document.getElementById('filtroOrdem').value = 'modelo';
  
  motosFiltradas = [...motos];
  paginaAtual = 1;
  renderizarMotos();
}

// Renderizar motos
function renderizarMotos() {
  const container = document.getElementById('containerMotos');
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const motosPagina = motosFiltradas.slice(inicio, fim);

  container.innerHTML = '';

  if (motosPagina.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="card">
          <div class="card-body text-center py-5">
            <i class="bi bi-bicycle fs-1 text-muted"></i>
            <h5 class="mt-3 text-muted">Nenhuma moto encontrada</h5>
            <p class="text-muted">Tente ajustar os filtros ou cadastrar uma nova moto</p>
          </div>
        </div>
      </div>
    `;
  } else {
    motosPagina.forEach(moto => {
      const card = criarCardMoto(moto);
      container.appendChild(card);
    });
  }

  renderizarPaginacao();
  atualizarInfoResultados();
}

// Criar card de moto
function criarCardMoto(moto) {
  const col = document.createElement('div');
  col.className = 'col-lg-4 col-md-6 mb-4';
  
  const statusClass = {
    'ativo': 'success',
    'manutencao': 'warning',
    'vendido': 'info',
    'inativo': 'secondary'
  }[moto.status] || 'secondary';

  const statusIcon = {
    'ativo': 'check-circle',
    'manutencao': 'wrench',
    'vendido': 'cash',
    'inativo': 'x-circle'
  }[moto.status] || 'circle';

  const statusText = {
    'ativo': 'Ativo',
    'manutencao': 'Em Manutenção',
    'vendido': 'Vendido',
    'inativo': 'Inativo'
  }[moto.status] || 'Desconhecido';

  col.innerHTML = `
    <div class="card h-100 moto-card fade-in">
      <div class="card-header d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <div class="moto-icon bg-primary rounded-circle me-2">
            <i class="bi bi-bicycle text-white"></i>
          </div>
          <div>
            <h6 class="mb-0">${moto.marca} ${moto.modelo}</h6>
            <small class="text-muted">${moto.ano}</small>
          </div>
        </div>
        <span class="badge bg-${statusClass}">
          <i class="bi bi-${statusIcon}"></i> ${statusText}
        </span>
      </div>
      <div class="card-body">
        <div class="row g-2 mb-3">
          <div class="col-6">
            <small class="text-muted">Proprietário</small>
            <div class="fw-bold">${moto.proprietarioNome}</div>
          </div>
          <div class="col-6">
            <small class="text-muted">Placa</small>
            <div class="fw-bold">${moto.placa}</div>
          </div>
          <div class="col-6">
            <small class="text-muted">Cor</small>
            <div>${moto.cor || 'Não informado'}</div>
          </div>
          <div class="col-6">
            <small class="text-muted">Cilindrada</small>
            <div>${moto.cilindrada || '-'} cc</div>
          </div>
          <div class="col-6">
            <small class="text-muted">KM</small>
            <div>${moto.km ? moto.km.toLocaleString() : '-'} km</div>
          </div>
          <div class="col-6">
            <small class="text-muted">Combustível</small>
            <div>${moto.combustivel || '-'}</div>
          </div>
        </div>
        
        ${moto.observacoes ? `
          <div class="alert alert-info py-2 mb-3">
            <small><i class="bi bi-info-circle"></i> ${moto.observacoes}</small>
          </div>
        ` : ''}
        
        <div class="row g-2 text-center">
          <div class="col-4">
            <button class="btn btn-sm btn-outline-primary w-100" onclick="editarMoto('${moto.id}')" title="Editar">
              <i class="bi bi-pencil"></i>
            </button>
          </div>
          <div class="col-4">
            <button class="btn btn-sm btn-outline-info w-100" onclick="visualizarMoto('${moto.id}')" title="Detalhes">
              <i class="bi bi-eye"></i>
            </button>
          </div>
          <div class="col-4">
            <button class="btn btn-sm btn-outline-danger w-100" onclick="excluirMoto('${moto.id}')" title="Excluir">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return col;
}

// Renderizar paginação
function renderizarPaginacao() {
  const paginacao = document.getElementById('paginacao');
  const totalPaginas = Math.ceil(motosFiltradas.length / itensPorPagina);
  
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
  const totalPaginas = Math.ceil(motosFiltradas.length / itensPorPagina);
  if (pagina >= 1 && pagina <= totalPaginas) {
    paginaAtual = pagina;
    renderizarMotos();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Atualizar informações de resultados
function atualizarInfoResultados() {
  const inicio = (paginaAtual - 1) * itensPorPagina + 1;
  const fim = Math.min(inicio + itensPorPagina - 1, motosFiltradas.length);
  const total = motosFiltradas.length;
  
  document.getElementById('resultadosInfo').textContent = `${inicio}-${fim} de ${total}`;
}

// Atualizar estatísticas
function atualizarEstatisticas() {
  const total = motos.length;
  const manutencao = motos.filter(m => m.status === 'manutencao').length;
  const ativas = motos.filter(m => m.status === 'ativo').length;
  const hoje = motos.filter(m => {
    const agora = new Date();
    const dataCadastro = new Date(m.dataCadastro);
    return dataCadastro.toDateString() === agora.toDateString();
  }).length;

  animarContador('totalMotos', total);
  animarContador('motosManutencao', manutencao);
  animarContador('motosAtivas', ativas);
  animarContador('motosHoje', hoje);
}

// Salvar moto
function salvarMoto() {
  const form = document.getElementById('formMoto');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const dadosMoto = {
    proprietario: document.getElementById('proprietario').value,
    marca: document.getElementById('marca').value,
    modelo: document.getElementById('modelo').value,
    ano: parseInt(document.getElementById('ano').value),
    placa: document.getElementById('placa').value,
    telefone: document.getElementById('telefone').value,
    status: document.getElementById('statusMoto').value,
    ultimaRevisao: document.getElementById('ultimaRevisao').value,
    proximaRevisao: document.getElementById('proximaRevisao').value,
    km: parseInt(document.getElementById('km').value) || 0,
    observacoes: document.getElementById('observacoes').value
  };

  mostrarLoading(true);

  if (motoEditando) {
    // Editar moto existente
    if (db && motosCollection) {
      const motoRef = doc(db, 'motos', motoEditando.id);
      updateDoc(motoRef, dadosMoto).then(() => {
        mostrarNotificacao('Moto atualizada com sucesso!', 'success');
        carregarMotosDoFirebase();
      }).catch((error) => {
        console.error('Erro ao atualizar moto:', error);
        mostrarNotificacao('Erro ao atualizar moto', 'danger');
      });
    } else {
      // Fallback para dados simulados
      const index = motos.findIndex(m => m.id === motoEditando.id);
      motos[index] = { ...dadosMoto, id: motoEditando.id };
      motosFiltradas = [...motos];
      renderizarMotos();
      mostrarNotificacao('Moto atualizada com sucesso!', 'success');
    }
  } else {
    // Nova moto
    if (db && motosCollection) {
      addDoc(motosCollection, dadosMoto).then(() => {
        mostrarNotificacao('Moto cadastrada com sucesso!', 'success');
        carregarMotosDoFirebase();
      }).catch((error) => {
        console.error('Erro ao cadastrar moto:', error);
        mostrarNotificacao('Erro ao cadastrar moto', 'danger');
      });
    } else {
      // Fallback para dados simulados
      const novaMoto = { ...dadosMoto, id: Date.now().toString() };
      motos.push(novaMoto);
      motosFiltradas = [...motos];
      renderizarMotos();
      mostrarNotificacao('Moto cadastrada com sucesso!', 'success');
    }
  }

  mostrarLoading(false);
  
  // Fechar modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('motoModal'));
  modal.hide();
}

// Editar moto
function editarMoto(id) {
  const moto = motos.find(m => m.id === id);
  if (!moto) return;

  motoEditando = moto;
  
  document.getElementById('proprietario').value = moto.proprietarioId;
  document.getElementById('marca').value = moto.marca;
  document.getElementById('modelo').value = moto.modelo;
  document.getElementById('ano').value = moto.ano;
  document.getElementById('placa').value = moto.placa;
  document.getElementById('cor').value = moto.cor || '';
  document.getElementById('cilindrada').value = moto.cilindrada || '';
  document.getElementById('combustivel').value = moto.combustivel || '';
  document.getElementById('chassi').value = moto.chassi || '';
  document.getElementById('renavam').value = moto.renavam || '';
  document.getElementById('km').value = moto.km || '';
  document.getElementById('statusMoto').value = moto.status;
  document.getElementById('observacoes').value = moto.observacoes || '';

  document.getElementById('motoModalLabel').innerHTML = `
    <i class="bi bi-pencil"></i> Editar Moto
  `;

  const modal = new bootstrap.Modal(document.getElementById('motoModal'));
  modal.show();
}

// Visualizar moto
function visualizarMoto(id) {
  const moto = motos.find(m => m.id === id);
  if (!moto) return;

  const detalhes = `
    <div class="row g-3">
      <div class="col-md-6">
        <strong>Proprietário:</strong><br>
        ${moto.proprietarioNome}
      </div>
      <div class="col-md-6">
        <strong>Marca/Modelo:</strong><br>
        ${moto.marca} ${moto.modelo}
      </div>
      <div class="col-md-6">
        <strong>Ano:</strong><br>
        ${moto.ano}
      </div>
      <div class="col-md-6">
        <strong>Placa:</strong><br>
        ${moto.placa}
      </div>
      <div class="col-md-6">
        <strong>Cor:</strong><br>
        ${moto.cor || 'Não informado'}
      </div>
      <div class="col-md-6">
        <strong>Cilindrada:</strong><br>
        ${moto.cilindrada || '-'} cc
      </div>
      <div class="col-md-6">
        <strong>Combustível:</strong><br>
        ${moto.combustivel || 'Não informado'}
      </div>
      <div class="col-md-6">
        <strong>KM Atual:</strong><br>
        ${moto.km ? moto.km.toLocaleString() : 'Não informado'} km
      </div>
      <div class="col-md-6">
        <strong>Chassi:</strong><br>
        ${moto.chassi || 'Não informado'}
      </div>
      <div class="col-md-6">
        <strong>RENAVAM:</strong><br>
        ${moto.renavam || 'Não informado'}
      </div>
      <div class="col-md-6">
        <strong>Status:</strong><br>
        ${moto.status.charAt(0).toUpperCase() + moto.status.slice(1)}
      </div>
      <div class="col-md-6">
        <strong>Data de Cadastro:</strong><br>
        ${formatarData(moto.dataCadastro)}
      </div>
      <div class="col-12">
        <strong>Observações:</strong><br>
        ${moto.observacoes || 'Nenhuma observação'}
      </div>
    </div>
  `;

  document.getElementById('detalhesMotoContent').innerHTML = detalhes;
  const modal = new bootstrap.Modal(document.getElementById('detalhesMotoModal'));
  modal.show();
}

// Excluir moto
function excluirMoto(id) {
  const moto = motos.find(m => m.id === id);
  if (!moto) return;

  document.getElementById('confirmarModalLabel').textContent = 'Excluir Moto';
  document.getElementById('confirmarTexto').textContent = 
    `Tem certeza que deseja excluir a moto "${moto.marca} ${moto.modelo}" (${moto.placa})? Esta ação não pode ser desfeita.`;
  
  document.getElementById('confirmarAcao').onclick = () => {
    mostrarLoading(true);
    
    if (db && motosCollection) {
      const motoRef = doc(db, 'motos', id);
      deleteDoc(motoRef).then(() => {
        mostrarNotificacao('Moto excluída com sucesso!', 'success');
        carregarMotosDoFirebase();
      }).catch((error) => {
        console.error('Erro ao excluir moto:', error);
        mostrarNotificacao('Erro ao excluir moto', 'danger');
      });
    } else {
      // Fallback para dados simulados
      motos = motos.filter(m => m.id !== id);
      motosFiltradas = [...motos];
      renderizarMotos();
      mostrarNotificacao('Moto excluída com sucesso!', 'success');
    }
    
    mostrarLoading(false);
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmarModal'));
    modal.hide();
  };

  const modal = new bootstrap.Modal(document.getElementById('confirmarModal'));
  modal.show();
}

// Limpar formulário
function limparFormulario() {
  document.getElementById('formMoto').reset();
  motoEditando = null;
  document.getElementById('motoModalLabel').innerHTML = `
    <i class="bi bi-bicycle"></i> Nova Moto
  `;
}

// Exportar dados
function exportarDados() {
  const csv = gerarCSV();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `motos_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  mostrarNotificacao('Dados exportados com sucesso!', 'success');
}

// Gerar CSV
function gerarCSV() {
  const headers = ['Proprietário', 'Marca', 'Modelo', 'Ano', 'Placa', 'Cor', 'Cilindrada', 'Combustível', 'Chassi', 'RENAVAM', 'KM', 'Status', 'Data Cadastro', 'Observações'];
  const rows = motos.map(moto => [
    moto.proprietarioNome,
    moto.marca,
    moto.modelo,
    moto.ano,
    moto.placa,
    moto.cor || '',
    moto.cilindrada || '',
    moto.combustivel || '',
    moto.chassi || '',
    moto.renavam || '',
    moto.km || '',
    moto.status,
    formatarData(moto.dataCadastro),
    moto.observacoes || ''
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return '\uFEFF' + csvContent; // BOM para UTF-8
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
  // Inicializar página
  inicializarPagina();
  
  // Adicionar animações aos elementos
  setTimeout(() => {
    const elementos = document.querySelectorAll('.card');
    elementos.forEach((elemento, index) => {
      elemento.style.animationDelay = `${index * 0.1}s`;
      elemento.classList.add('fade-in');
    });
  }, 100);
});
