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

// Variáveis Firebase
let db;
let produtosCollection;

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
            produtosCollection = collection(db, 'produtos');
            
            console.log('Firebase inicializado com sucesso para produtos');
            
            // Carregar dados do Firebase
            await carregarProdutosDoFirebase();
            
            return true;
        }
    } catch (error) {
        console.error('Erro ao inicializar Firebase:', error);
        // Usar dados simulados em caso de erro
        await carregarDadosSimulados();
        return false;
    }
}

// Dados simulados de produtos (fallback)
let produtos = [];

async function carregarDadosSimulados() {
    produtos = [
        {
            id: 1,
            nome: 'Óleo Motor 15W40',
            codigo: 'OL001',
            categoria: 'oleo',
            fornecedor: 'honda',
            precoCusto: 25.00,
            precoVenda: 45.00,
            quantidadeEstoque: 50,
            estoqueMinimo: 10,
            localizacao: 'A1',
            descricao: 'Óleo para motor de moto, viscosidade 15W40',
            vendas: 25,
            faturamento: 1125.00
        },
        {
            id: 2,
            nome: 'Pastilha de Freio Dianteira',
            codigo: 'FR001',
            categoria: 'pecas',
            fornecedor: 'yamaha',
            precoCusto: 80.00,
            precoVenda: 150.00,
            quantidadeEstoque: 8,
            estoqueMinimo: 5,
            localizacao: 'B2',
            descricao: 'Pastilha de freio dianteira para motos esportivas',
            vendas: 15,
            faturamento: 2250.00
        },
        {
            id: 3,
            nome: 'Pneu Traseiro 140/70-17',
            codigo: 'PN001',
            categoria: 'pneus',
            fornecedor: 'generico',
            precoCusto: 180.00,
            precoVenda: 320.00,
            quantidadeEstoque: 0,
            estoqueMinimo: 3,
            localizacao: 'C1',
            descricao: 'Pneu traseiro medida 140/70-17 para motos de média cilindrada',
            vendas: 8,
            faturamento: 2560.00
        },
        {
            id: 4,
            codigo: 'AC001',
            categoria: 'acessorios',
            fornecedor: 'generico',
            precoCusto: 120.00,
            precoVenda: 280.00,
            quantidadeEstoque: 15,
            estoqueMinimo: 5,
            localizacao: 'D1',
            descricao: 'Capacete integral com viseira, várias cores disponíveis',
            vendas: 12,
            faturamento: 3360.00
        }
    ];
    
    renderizarProdutos();
    atualizarEstatisticas();
}

// Carregar produtos do Firebase
async function carregarProdutosDoFirebase() {
    try {
        const q = query(produtosCollection, orderBy('nome'));
        const querySnapshot = await getDocs(q);
        
        produtos = [];
        querySnapshot.forEach((doc) => {
            produtos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log('Produtos carregados do Firebase:', produtos.length);
        renderizarProdutos();
        atualizarEstatisticas();
    } catch (error) {
        console.error('Erro ao carregar produtos do Firebase:', error);
        await carregarDadosSimulados();
    }
}

let vendas = [
  {
    id: 1,
    data: '2024-01-15',
    cliente: 'João Silva',
    clienteId: 1,
    itens: [
      { produtoId: 1, produto: 'Óleo Motor 15W40', quantidade: 2, precoUnitario: 45.00, total: 90.00 },
      { produtoId: 2, produto: 'Pastilha de Freio Dianteira', quantidade: 1, precoUnitario: 150.00, total: 150.00 }
    ],
    subtotal: 240.00,
    desconto: 10.00,
    total: 230.00,
    formaPagamento: 'cartao',
    status: 'pago'
  },
  {
    id: 2,
    data: '2024-01-16',
    cliente: 'Maria Oliveira',
    clienteId: 2,
    itens: [
      { produtoId: 4, produto: 'Capacete Integral', quantidade: 1, precoUnitario: 280.00, total: 280.00 }
    ],
    subtotal: 280.00,
    desconto: 0.00,
    total: 280.00,
    formaPagamento: 'pix',
    status: 'pago'
  },
  {
    id: 3,
    data: new Date().toISOString().split('T')[0],
    cliente: 'Pedro Santos',
    clienteId: 3,
    itens: [
      { produtoId: 5, produto: 'Filtro de Ar', quantidade: 2, precoUnitario: 65.00, total: 130.00 },
      { produtoId: 1, produto: 'Óleo Motor 15W40', quantidade: 1, precoUnitario: 45.00, total: 45.00 }
    ],
    subtotal: 175.00,
    desconto: 5.00,
    total: 170.00,
    formaPagamento: 'dinheiro',
    status: 'pago'
  },
  {
    id: 4,
    data: new Date().toISOString().split('T')[0],
    cliente: 'Ana Costa',
    clienteId: 4,
    itens: [
      { produtoId: 6, produto: 'Chave de Fenda Conjunto', quantidade: 1, precoUnitario: 85.00, total: 85.00 }
    ],
    subtotal: 85.00,
    desconto: 0.00,
    total: 85.00,
    formaPagamento: 'prazo',
    status: 'pendente'
  }
];

// Simulação de clientes
const clientes = [
  { id: 1, nome: 'João Silva' },
  { id: 2, nome: 'Maria Oliveira' },
  { id: 3, nome: 'Pedro Santos' },
  { id: 4, nome: 'Ana Costa' }
];

// Variáveis globais
let produtosFiltrados = [];
let vendasFiltradas = [];
let produtoEditandoId = null;
let vendaEditandoId = null;
let paginaAtualProdutos = 1;
let paginaAtualVendas = 1;
let itensVendaAtual = [];
const itensPorPagina = 12;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  inicializarEventos();
  carregarClientes();
  carregarProdutosSelect();
  initializeFirebase();
  definirDataAtual();
  atualizarEstatisticas();
});

// Event Listeners
function inicializarEventos() {
  // Filtros produtos
  document.getElementById('buscarProduto').addEventListener('input', filtrarProdutos);
  document.getElementById('filtroCategoria').addEventListener('change', filtrarProdutos);
  document.getElementById('filtroEstoque').addEventListener('change', filtrarProdutos);
  document.getElementById('filtroFornecedor').addEventListener('change', filtrarProdutos);
  document.getElementById('ordenarProdutos').addEventListener('change', filtrarProdutos);
  document.getElementById('limparFiltrosProdutos').addEventListener('click', limparFiltrosProdutos);

  // Filtros vendas
  document.getElementById('buscarVenda').addEventListener('input', filtrarVendas);
  document.getElementById('filtroStatusVenda').addEventListener('change', filtrarVendas);
  document.getElementById('filtroPagamento').addEventListener('change', filtrarVendas);
  document.getElementById('dataInicio').addEventListener('change', filtrarVendas);
  document.getElementById('dataFim').addEventListener('change', filtrarVendas);
  document.getElementById('limparFiltrosVendas').addEventListener('click', limparFiltrosVendas);

  // Botões principais
  document.getElementById('exportarBtn').addEventListener('click', exportarDados);
  document.getElementById('salvarProduto').addEventListener('click', salvarProduto);
  document.getElementById('salvarVenda').addEventListener('click', salvarVenda);

  // Modal de produto
  document.getElementById('produtoModal').addEventListener('show.bs.modal', function() {
    if (produtoEditandoId === null) {
      resetarFormularioProduto();
      document.getElementById('produtoModalLabel').innerHTML = '<i class="bi bi-box-seam"></i> Novo Produto';
    }
  });

  // Modal de venda
  document.getElementById('vendaModal').addEventListener('show.bs.modal', function() {
    if (vendaEditandoId === null) {
      resetarFormularioVenda();
      document.getElementById('vendaModalLabel').innerHTML = '<i class="bi bi-cart-plus"></i> Nova Venda';
    }
  });

  // Cálculos automáticos produto
  document.getElementById('precoCusto').addEventListener('input', calcularMargem);
  document.getElementById('precoVenda').addEventListener('input', calcularMargem);

  // Venda - adicionar item
  document.getElementById('adicionarItem').addEventListener('click', adicionarItemVenda);
  document.getElementById('descontoVenda').addEventListener('input', calcularTotalVenda);

  // Detalhes e impressão
  document.getElementById('imprimirVenda').addEventListener('click', imprimirVenda);

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('Tem certeza que deseja sair?')) {
      window.location.href = 'login.html';
    }
  });

  // Tabs
  document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
    tab.addEventListener('shown.bs.tab', function(e) {
      const target = e.target.getAttribute('data-bs-target');
      if (target === '#dashboard-pane') {
        setTimeout(() => {
          carregarGraficos();
        }, 100);
      }
    });
  });
}

// Carregar dados
function carregarClientes() {
  const select = document.getElementById('clienteVenda');
  select.innerHTML = '<option value="">Selecione o cliente</option>';
  
  clientes.forEach(cliente => {
    const option = document.createElement('option');
    option.value = cliente.id;
    option.textContent = cliente.nome;
    select.appendChild(option);
  });
}

function carregarProdutosSelect() {
  const select = document.getElementById('produtoVenda');
  select.innerHTML = '<option value="">Selecione um produto</option>';
  
  produtos.forEach(produto => {
    if (produto.quantidadeEstoque > 0) {
      const option = document.createElement('option');
      option.value = produto.id;
      option.textContent = `${produto.nome} - R$ ${produto.precoVenda.toFixed(2)} (Estoque: ${produto.quantidadeEstoque})`;
      option.dataset.preco = produto.precoVenda;
      option.dataset.estoque = produto.quantidadeEstoque;
      select.appendChild(option);
    }
  });
}

function carregarDados() {
  produtosFiltrados = [...produtos];
  vendasFiltradas = [...vendas];
  aplicarFiltrosProdutos();
  aplicarFiltrosVendas();
  renderizarProdutos();
  renderizarVendas();
  atualizarEstatisticas();
}

function definirDataAtual() {
  const hoje = new Date().toISOString().split('T')[0];
  document.getElementById('dataVenda').value = hoje;
}

// Filtros Produtos
function filtrarProdutos() {
  const busca = document.getElementById('buscarProduto').value.toLowerCase();
  const categoria = document.getElementById('filtroCategoria').value;
  const estoque = document.getElementById('filtroEstoque').value;
  const fornecedor = document.getElementById('filtroFornecedor').value;
  const ordenacao = document.getElementById('ordenarProdutos').value;

  produtosFiltrados = produtos.filter(produto => {
    const matchBusca = !busca || 
      produto.nome.toLowerCase().includes(busca) ||
      produto.codigo.toLowerCase().includes(busca) ||
      produto.descricao.toLowerCase().includes(busca);

    const matchCategoria = !categoria || produto.categoria === categoria;
    const matchFornecedor = !fornecedor || produto.fornecedor === fornecedor;
    
    let matchEstoque = true;
    if (estoque === 'disponivel') {
      matchEstoque = produto.quantidadeEstoque > produto.estoqueMinimo;
    } else if (estoque === 'baixo') {
      matchEstoque = produto.quantidadeEstoque <= produto.estoqueMinimo && produto.quantidadeEstoque > 0;
    } else if (estoque === 'esgotado') {
      matchEstoque = produto.quantidadeEstoque === 0;
    }

    return matchBusca && matchCategoria && matchFornecedor && matchEstoque;
  });

  // Aplicar ordenação
  switch (ordenacao) {
    case 'nome':
      produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
      break;
    case 'preco':
      produtosFiltrados.sort((a, b) => a.precoVenda - b.precoVenda);
      break;
    case 'estoque':
      produtosFiltrados.sort((a, b) => b.quantidadeEstoque - a.quantidadeEstoque);
      break;
    case 'categoria':
      produtosFiltrados.sort((a, b) => a.categoria.localeCompare(b.categoria));
      break;
  }

  paginaAtualProdutos = 1;
  renderizarProdutos();
  atualizarEstatisticas();
}

function aplicarFiltrosProdutos() {
  filtrarProdutos();
}

function limparFiltrosProdutos() {
  document.getElementById('buscarProduto').value = '';
  document.getElementById('filtroCategoria').value = '';
  document.getElementById('filtroEstoque').value = '';
  document.getElementById('filtroFornecedor').value = '';
  document.getElementById('ordenarProdutos').value = 'nome';
  
  setTimeout(() => {
    filtrarProdutos();
  }, 100);
}

// Filtros Vendas
function filtrarVendas() {
  const busca = document.getElementById('buscarVenda').value.toLowerCase();
  const status = document.getElementById('filtroStatusVenda').value;
  const pagamento = document.getElementById('filtroPagamento').value;
  const dataInicio = document.getElementById('dataInicio').value;
  const dataFim = document.getElementById('dataFim').value;

  vendasFiltradas = vendas.filter(venda => {
    const matchBusca = !busca || 
      venda.id.toString().includes(busca) ||
      venda.cliente.toLowerCase().includes(busca) ||
      venda.itens.some(item => item.produto.toLowerCase().includes(busca));

    const matchStatus = !status || venda.status === status;
    const matchPagamento = !pagamento || venda.formaPagamento === pagamento;
    
    let matchData = true;
    if (dataInicio && dataFim) {
      const vendaData = new Date(venda.data);
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      matchData = vendaData >= inicio && vendaData <= fim;
    } else if (dataInicio) {
      matchData = new Date(venda.data) >= new Date(dataInicio);
    } else if (dataFim) {
      matchData = new Date(venda.data) <= new Date(dataFim);
    }

    return matchBusca && matchStatus && matchPagamento && matchData;
  });

  // Ordenar por data (mais recentes primeiro)
  vendasFiltradas.sort((a, b) => new Date(b.data) - new Date(a.data));

  paginaAtualVendas = 1;
  renderizarVendas();
  atualizarEstatisticas();
}

function aplicarFiltrosVendas() {
  filtrarVendas();
}

function limparFiltrosVendas() {
  document.getElementById('buscarVenda').value = '';
  document.getElementById('filtroStatusVenda').value = '';
  document.getElementById('filtroPagamento').value = '';
  document.getElementById('dataInicio').value = '';
  document.getElementById('dataFim').value = '';
  
  setTimeout(() => {
    filtrarVendas();
  }, 100);
}

// Renderização
function renderizarProdutos() {
  const grid = document.getElementById('produtosGrid');
  grid.innerHTML = '';

  const inicio = (paginaAtualProdutos - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const produtosPagina = produtosFiltrados.slice(inicio, fim);

  produtosPagina.forEach(produto => {
    const card = criarCardProduto(produto);
    grid.appendChild(card);
  });

  atualizarInfoProdutos();
}

function criarCardProduto(produto) {
  const col = document.createElement('div');
  col.className = 'col-md-6 col-lg-4';

  const statusEstoque = getStatusEstoque(produto);
  const corStatus = getCorStatusEstoque(statusEstoque);
  const margem = ((produto.precoVenda - produto.precoCusto) / produto.precoCusto * 100).toFixed(1);

  col.innerHTML = `
    <div class="card produto-card h-100">
      <div class="card-header d-flex justify-content-between align-items-center">
        <small class="text-muted">${produto.codigo}</small>
        <span class="badge bg-${corStatus}">${statusEstoque}</span>
      </div>
      <div class="card-body">
        <h6 class="card-title">${produto.nome}</h6>
        <p class="card-text small text-muted">${formatarCategoria(produto.categoria)}</p>
        <p class="card-text">${produto.descricao}</p>
        <div class="row g-2 mb-3">
          <div class="col-6">
            <small class="text-muted">Estoque:</small>
            <div class="fw-bold">${produto.quantidadeEstoque}</div>
          </div>
          <div class="col-6">
            <small class="text-muted">Localização:</small>
            <div class="fw-bold">${produto.localizacao}</div>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <small class="text-muted">Preço:</small>
            <div class="h5 text-success mb-0">R$ ${produto.precoVenda.toFixed(2)}</div>
          </div>
          <div class="text-end">
            <small class="text-muted">Margem:</small>
            <div class="small text-info">${margem}%</div>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <div class="d-flex justify-content-between">
          <button class="btn btn-sm btn-outline-info" onclick="visualizarProduto(${produto.id})">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-sm btn-outline-primary" onclick="editarProduto(${produto.id})">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-success" onclick="adicionarEstoque(${produto.id})">
            <i class="bi bi-plus-circle"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="excluirProduto(${produto.id})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  return col;
}

function renderizarVendas() {
  const tbody = document.getElementById('vendasTable');
  tbody.innerHTML = '';

  const inicio = (paginaAtualVendas - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const vendasPagina = vendasFiltradas.slice(inicio, fim);

  vendasPagina.forEach(venda => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>#${venda.id.toString().padStart(4, '0')}</td>
      <td>${formatarData(venda.data)}</td>
      <td>${venda.cliente}</td>
      <td>${venda.itens.length} item(s)</td>
      <td class="text-success fw-bold">R$ ${venda.total.toFixed(2)}</td>
      <td><span class="badge bg-${getCorFormaPagamento(venda.formaPagamento)}">${formatarFormaPagamento(venda.formaPagamento)}</span></td>
      <td><span class="badge bg-${getCorStatusVenda(venda.status)}">${formatarStatusVenda(venda.status)}</span></td>
      <td>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-info" onclick="visualizarVenda(${venda.id})">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-outline-danger" onclick="excluirVenda(${venda.id})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  atualizarInfoVendas();
}

// Estatísticas
function atualizarEstatisticas() {
  // Estatísticas produtos
  const totalProdutos = produtos.length;
  const valorEstoque = produtos.reduce((total, produto) => 
    total + (produto.quantidadeEstoque * produto.precoCusto), 0);
  const estoqueBaixo = produtos.filter(p => 
    p.quantidadeEstoque <= p.estoqueMinimo && p.quantidadeEstoque > 0).length;
  const produtosEsgotados = produtos.filter(p => p.quantidadeEstoque === 0).length;

  document.getElementById('totalProdutos').textContent = totalProdutos;
  document.getElementById('valorEstoque').textContent = `R$ ${valorEstoque.toFixed(2)}`;
  document.getElementById('estoqueBaixo').textContent = estoqueBaixo;
  document.getElementById('produtosEsgotados').textContent = produtosEsgotados;

  // Estatísticas vendas
  const hoje = new Date().toISOString().split('T')[0];
  const vendasHoje = vendas.filter(v => v.data === hoje).length;
  const faturamentoHoje = vendas
    .filter(v => v.data === hoje && v.status === 'pago')
    .reduce((total, venda) => total + venda.total, 0);
  const vendasPendentes = vendas.filter(v => v.status === 'pendente').length;
  const totalVendas = vendas.length;

  document.getElementById('vendasHoje').textContent = vendasHoje;
  document.getElementById('faturamentoHoje').textContent = `R$ ${faturamentoHoje.toFixed(2)}`;
  document.getElementById('vendasPendentes').textContent = vendasPendentes;
  document.getElementById('totalVendas').textContent = totalVendas;
}

// CRUD Produtos
function resetarFormularioProduto() {
  document.getElementById('formProduto').reset();
  document.getElementById('margemLucro').value = '';
  produtoEditandoId = null;
}

function calcularMargem() {
  const custo = parseFloat(document.getElementById('precoCusto').value) || 0;
  const venda = parseFloat(document.getElementById('precoVenda').value) || 0;
  
  if (custo > 0 && venda > 0) {
    const margem = ((venda - custo) / custo * 100).toFixed(2);
    document.getElementById('margemLucro').value = margem;
  } else {
    document.getElementById('margemLucro').value = '';
  }
}

function salvarProduto() {
  const form = document.getElementById('formProduto');
  
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const produto = {
    nome: document.getElementById('nomeProduto').value,
    codigo: document.getElementById('codigoProduto').value || `PR${Date.now()}`,
    categoria: document.getElementById('categoriaProduto').value,
    fornecedor: document.getElementById('fornecedorProduto').value,
    precoCusto: parseFloat(document.getElementById('precoCusto').value) || 0,
    precoVenda: parseFloat(document.getElementById('precoVenda').value),
    quantidadeEstoque: parseInt(document.getElementById('quantidadeEstoque').value) || 0,
    estoqueMinimo: parseInt(document.getElementById('estoqueMinimo').value) || 5,
    localizacao: document.getElementById('localizacao').value,
    descricao: document.getElementById('descricaoProduto').value,
    vendas: produtoEditandoId ? produtos.find(p => p.id === produtoEditandoId).vendas : 0,
    faturamento: produtoEditandoId ? produtos.find(p => p.id === produtoEditandoId).faturamento : 0
  };

  if (produtoEditandoId) {
    // Editar produto existente
    if (db && produtosCollection) {
      const produtoRef = doc(db, 'produtos', produtoEditandoId);
      updateDoc(produtoRef, produto).then(() => {
        mostrarNotificacao('Produto atualizado com sucesso!', 'success');
        carregarProdutosDoFirebase();
      }).catch((error) => {
        console.error('Erro ao atualizar produto:', error);
        mostrarNotificacao('Erro ao atualizar produto', 'danger');
      });
    } else {
      // Fallback para dados simulados
      const index = produtos.findIndex(p => p.id === produtoEditandoId);
      produtos[index] = { ...produto, id: produtoEditandoId };
      renderizarProdutos();
      mostrarNotificacao('Produto atualizado com sucesso!', 'success');
    }
  } else {
    // Novo produto
    if (db && produtosCollection) {
      addDoc(produtosCollection, produto).then(() => {
        mostrarNotificacao('Produto criado com sucesso!', 'success');
        carregarProdutosDoFirebase();
      }).catch((error) => {
        console.error('Erro ao criar produto:', error);
        mostrarNotificacao('Erro ao criar produto', 'danger');
      });
    } else {
      // Fallback para dados simulados
      const novoProduto = { ...produto, id: Date.now() };
      produtos.push(novoProduto);
      renderizarProdutos();
      mostrarNotificacao('Produto criado com sucesso!', 'success');
    }
  }

  // Fechar modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('produtoModal'));
  modal.hide();

  // Recarregar dados
  carregarProdutosSelect();
}

function editarProduto(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  produtoEditandoId = id;
  
  document.getElementById('nomeProduto').value = produto.nome;
  document.getElementById('codigoProduto').value = produto.codigo;
  document.getElementById('categoriaProduto').value = produto.categoria;
  document.getElementById('fornecedorProduto').value = produto.fornecedor;
  document.getElementById('precoCusto').value = produto.precoCusto;
  document.getElementById('precoVenda').value = produto.precoVenda;
  document.getElementById('quantidadeEstoque').value = produto.quantidadeEstoque;
  document.getElementById('estoqueMinimo').value = produto.estoqueMinimo;
  document.getElementById('localizacao').value = produto.localizacao;
  document.getElementById('descricaoProduto').value = produto.descricao;
  
  calcularMargem();

  document.getElementById('produtoModalLabel').innerHTML = '<i class="bi bi-pencil"></i> Editar Produto';
  
  const modal = new bootstrap.Modal(document.getElementById('produtoModal'));
  modal.show();
}

function visualizarProduto(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  // Implementar modal de visualização se necessário
  alert(`Produto: ${produto.nome}\nEstoque: ${produto.quantidadeEstoque}\nPreço: R$ ${produto.precoVenda.toFixed(2)}`);
}

function adicionarEstoque(id) {
  const quantidade = prompt('Quantidade a adicionar no estoque:');
  if (quantidade && !isNaN(quantidade)) {
    const produto = produtos.find(p => p.id === id);
    if (produto) {
      produto.quantidadeEstoque += parseInt(quantidade);
      mostrarNotificacao('Estoque atualizado com sucesso!', 'success');
      carregarDados();
      carregarProdutosSelect();
    }
  }
}

function excluirProduto(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  if (confirm(`Tem certeza que deseja excluir o produto "${produto.nome}"?`)) {
    if (db && produtosCollection) {
      const produtoRef = doc(db, 'produtos', id);
      deleteDoc(produtoRef).then(() => {
        mostrarNotificacao('Produto excluído com sucesso!', 'success');
        carregarProdutosDoFirebase();
      }).catch((error) => {
        console.error('Erro ao excluir produto:', error);
        mostrarNotificacao('Erro ao excluir produto', 'danger');
      });
    } else {
      // Fallback para dados simulados
      const index = produtos.findIndex(p => p.id === id);
      produtos.splice(index, 1);
      renderizarProdutos();
      mostrarNotificacao('Produto excluído com sucesso!', 'success');
    }
    carregarProdutosSelect();
  }
}

// CRUD Vendas
function resetarFormularioVenda() {
  document.getElementById('formVenda').reset();
  definirDataAtual();
  itensVendaAtual = [];
  atualizarItensVenda();
  calcularTotalVenda();
  vendaEditandoId = null;
}

function adicionarItemVenda() {
  const produtoId = parseInt(document.getElementById('produtoVenda').value);
  const quantidade = parseInt(document.getElementById('quantidadeVenda').value) || 1;
  
  if (!produtoId) {
    alert('Selecione um produto');
    return;
  }

  const produto = produtos.find(p => p.id === produtoId);
  if (!produto) return;

  if (quantidade > produto.quantidadeEstoque) {
    alert('Quantidade maior que o estoque disponível');
    return;
  }

  // Verificar se produto já está na lista
  const itemExistente = itensVendaAtual.find(item => item.produtoId === produtoId);
  if (itemExistente) {
    if (itemExistente.quantidade + quantidade > produto.quantidadeEstoque) {
      alert('Quantidade total maior que o estoque disponível');
      return;
    }
    itemExistente.quantidade += quantidade;
    itemExistente.total = itemExistente.quantidade * itemExistente.precoUnitario;
  } else {
    itensVendaAtual.push({
      produtoId: produtoId,
      produto: produto.nome,
      quantidade: quantidade,
      precoUnitario: produto.precoVenda,
      total: quantidade * produto.precoVenda
    });
  }

  // Limpar seleção
  document.getElementById('produtoVenda').value = '';
  document.getElementById('quantidadeVenda').value = '1';

  atualizarItensVenda();
  calcularTotalVenda();
}

function atualizarItensVenda() {
  const tbody = document.getElementById('itensVenda');
  tbody.innerHTML = '';

  itensVendaAtual.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.produto}</td>
      <td>${item.quantidade}</td>
      <td>R$ ${item.precoUnitario.toFixed(2)}</td>
      <td>R$ ${item.total.toFixed(2)}</td>
      <td>
        <button type="button" class="btn btn-sm btn-outline-danger" onclick="removerItemVenda(${index})">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function removerItemVenda(index) {
  itensVendaAtual.splice(index, 1);
  atualizarItensVenda();
  calcularTotalVenda();
}

function calcularTotalVenda() {
  const subtotal = itensVendaAtual.reduce((total, item) => total + item.total, 0);
  const desconto = parseFloat(document.getElementById('descontoVenda').value) || 0;
  const total = subtotal - desconto;

  document.getElementById('subtotalVenda').textContent = `R$ ${subtotal.toFixed(2)}`;
  document.getElementById('descontoTexto').textContent = `R$ ${desconto.toFixed(2)}`;
  document.getElementById('totalVenda').textContent = `R$ ${total.toFixed(2)}`;
}

function salvarVenda() {
  const form = document.getElementById('formVenda');
  
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (itensVendaAtual.length === 0) {
    alert('Adicione pelo menos um item à venda');
    return;
  }

  const cliente = clientes.find(c => c.id === parseInt(document.getElementById('clienteVenda').value));
  const subtotal = itensVendaAtual.reduce((total, item) => total + item.total, 0);
  const desconto = parseFloat(document.getElementById('descontoVenda').value) || 0;

  const venda = {
    id: vendaEditandoId || Date.now(),
    data: document.getElementById('dataVenda').value,
    cliente: cliente.nome,
    clienteId: cliente.id,
    itens: [...itensVendaAtual],
    subtotal: subtotal,
    desconto: desconto,
    total: subtotal - desconto,
    formaPagamento: document.getElementById('formaPagamento').value,
    status: 'pago' // Por padrão, considerar como pago
  };

  // Atualizar estoque dos produtos
  itensVendaAtual.forEach(item => {
    const produto = produtos.find(p => p.id === item.produtoId);
    if (produto) {
      produto.quantidadeEstoque -= item.quantidade;
      produto.vendas = (produto.vendas || 0) + item.quantidade;
      produto.faturamento = (produto.faturamento || 0) + item.total;
    }
  });

  if (vendaEditandoId) {
    const index = vendas.findIndex(v => v.id === vendaEditandoId);
    vendas[index] = venda;
    mostrarNotificacao('Venda atualizada com sucesso!', 'success');
  } else {
    vendas.push(venda);
    mostrarNotificacao('Venda realizada com sucesso!', 'success');
  }

  // Fechar modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('vendaModal'));
  modal.hide();

  // Recarregar dados
  carregarDados();
  carregarProdutosSelect();
}

function visualizarVenda(id) {
  const venda = vendas.find(v => v.id === id);
  if (!venda) return;

  const content = document.getElementById('detalhesVendaContent');
  content.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <h6 class="text-primary">Informações da Venda</h6>
        <table class="table table-borderless table-sm">
          <tr><td><strong>ID:</strong></td><td>#${venda.id.toString().padStart(4, '0')}</td></tr>
          <tr><td><strong>Data:</strong></td><td>${formatarData(venda.data)}</td></tr>
          <tr><td><strong>Cliente:</strong></td><td>${venda.cliente}</td></tr>
          <tr><td><strong>Pagamento:</strong></td><td><span class="badge bg-${getCorFormaPagamento(venda.formaPagamento)}">${formatarFormaPagamento(venda.formaPagamento)}</span></td></tr>
          <tr><td><strong>Status:</strong></td><td><span class="badge bg-${getCorStatusVenda(venda.status)}">${formatarStatusVenda(venda.status)}</span></td></tr>
        </table>
      </div>
      <div class="col-md-6">
        <h6 class="text-primary">Valores</h6>
        <table class="table table-borderless table-sm">
          <tr><td><strong>Subtotal:</strong></td><td>R$ ${venda.subtotal.toFixed(2)}</td></tr>
          <tr><td><strong>Desconto:</strong></td><td>R$ ${venda.desconto.toFixed(2)}</td></tr>
          <tr class="table-success"><td><strong>Total:</strong></td><td><strong>R$ ${venda.total.toFixed(2)}</strong></td></tr>
        </table>
      </div>
    </div>
    
    <div class="row mt-3">
      <div class="col-12">
        <h6 class="text-primary">Itens da Venda</h6>
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${venda.itens.map(item => `
                <tr>
                  <td>${item.produto}</td>
                  <td>${item.quantidade}</td>
                  <td>R$ ${item.precoUnitario.toFixed(2)}</td>
                  <td>R$ ${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById('detalhesVendaModal'));
  modal.show();
}

function excluirVenda(id) {
  const venda = vendas.find(v => v.id === id);
  if (!venda) return;

  if (confirm(`Tem certeza que deseja excluir a venda #${venda.id.toString().padStart(4, '0')}?`)) {
    // Restaurar estoque
    venda.itens.forEach(item => {
      const produto = produtos.find(p => p.id === item.produtoId);
      if (produto) {
        produto.quantidadeEstoque += item.quantidade;
        produto.vendas = Math.max(0, (produto.vendas || 0) - item.quantidade);
        produto.faturamento = Math.max(0, (produto.faturamento || 0) - item.total);
      }
    });

    const index = vendas.findIndex(v => v.id === id);
    vendas.splice(index, 1);
    
    mostrarNotificacao('Venda excluída com sucesso!', 'success');
    carregarDados();
    carregarProdutosSelect();
  }
}

// Gráficos
function carregarGraficos() {
  carregarGraficoCategorias();
  carregarGraficoFaturamento();
  carregarTopProdutos();
}

function carregarGraficoCategorias() {
  const ctx = document.getElementById('categoriasChart').getContext('2d');
  
  // Agrupar vendas por categoria
  const categorias = {};
  produtos.forEach(produto => {
    const cat = formatarCategoria(produto.categoria);
    categorias[cat] = (categorias[cat] || 0) + (produto.faturamento || 0);
  });

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(categorias),
      datasets: [{
        data: Object.values(categorias),
        backgroundColor: [
          '#667eea',
          '#764ba2',
          '#f093fb',
          '#f5576c',
          '#4facfe',
          '#00f2fe'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function carregarGraficoFaturamento() {
  const ctx = document.getElementById('faturamentoChart').getContext('2d');
  
  // Simular dados de faturamento mensal
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  const faturamento = [15000, 18000, 22000, 19000, 25000, 28000];

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: meses,
      datasets: [{
        label: 'Faturamento',
        data: faturamento,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return 'R$ ' + value.toLocaleString();
            }
          }
        }
      }
    }
  });
}

function carregarTopProdutos() {
  const tbody = document.getElementById('topProdutos');
  tbody.innerHTML = '';

  // Ordenar produtos por faturamento
  const topProdutos = [...produtos]
    .sort((a, b) => (b.faturamento || 0) - (a.faturamento || 0))
    .slice(0, 5);

  topProdutos.forEach(produto => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${produto.nome}</td>
      <td><span class="badge bg-secondary">${formatarCategoria(produto.categoria)}</span></td>
      <td>${produto.vendas || 0}</td>
      <td class="text-success">R$ ${(produto.faturamento || 0).toFixed(2)}</td>
      <td><span class="badge bg-${getCorStatusEstoque(getStatusEstoque(produto))}">${produto.quantidadeEstoque}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// Utilitários
function getStatusEstoque(produto) {
  if (produto.quantidadeEstoque === 0) return 'Esgotado';
  if (produto.quantidadeEstoque <= produto.estoqueMinimo) return 'Baixo';
  return 'Disponível';
}

function getCorStatusEstoque(status) {
  switch (status) {
    case 'Disponível': return 'success';
    case 'Baixo': return 'warning';
    case 'Esgotado': return 'danger';
    default: return 'secondary';
  }
}

function getCorFormaPagamento(forma) {
  switch (forma) {
    case 'dinheiro': return 'success';
    case 'cartao': return 'primary';
    case 'pix': return 'info';
    case 'prazo': return 'warning';
    default: return 'secondary';
  }
}

function getCorStatusVenda(status) {
  switch (status) {
    case 'pago': return 'success';
    case 'pendente': return 'warning';
    case 'cancelado': return 'danger';
    default: return 'secondary';
  }
}

function formatarCategoria(categoria) {
  const categorias = {
    'pecas': 'Peças',
    'acessorios': 'Acessórios',
    'ferramentas': 'Ferramentas',
    'oleo': 'Óleo/Fluidos',
    'pneus': 'Pneus',
    'eletrica': 'Parte Elétrica'
  };
  return categorias[categoria] || categoria;
}

function formatarFormaPagamento(forma) {
  const formas = {
    'dinheiro': 'Dinheiro',
    'cartao': 'Cartão',
    'pix': 'PIX',
    'prazo': 'A Prazo'
  };
  return formas[forma] || forma;
}

function formatarStatusVenda(status) {
  const statuses = {
    'pago': 'Pago',
    'pendente': 'Pendente',
    'cancelado': 'Cancelado'
  };
  return statuses[status] || status;
}

function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR');
}

function atualizarInfoProdutos() {
  const total = produtosFiltrados.length;
  const inicio = (paginaAtualProdutos - 1) * itensPorPagina + 1;
  const fim = Math.min(inicio + itensPorPagina - 1, total);
  
  document.getElementById('produtosInfo').textContent = `${inicio}-${fim} de ${total}`;
}

function atualizarInfoVendas() {
  const total = vendasFiltradas.length;
  const inicio = (paginaAtualVendas - 1) * itensPorPagina + 1;
  const fim = Math.min(inicio + itensPorPagina - 1, total);
  
  document.getElementById('vendasInfo').textContent = `${inicio}-${fim} de ${total}`;
}

// Exportação
function exportarDados() {
  const tabAtiva = document.querySelector('.nav-link.active').getAttribute('data-bs-target');
  
  if (tabAtiva === '#produtos-pane') {
    exportarProdutos();
  } else if (tabAtiva === '#vendas-pane') {
    exportarVendas();
  }
}

function exportarProdutos() {
  const dados = produtosFiltrados.map(produto => ({
    'Código': produto.codigo,
    'Nome': produto.nome,
    'Categoria': formatarCategoria(produto.categoria),
    'Fornecedor': produto.fornecedor,
    'Preço Custo': `R$ ${produto.precoCusto.toFixed(2)}`,
    'Preço Venda': `R$ ${produto.precoVenda.toFixed(2)}`,
    'Estoque': produto.quantidadeEstoque,
    'Estoque Mínimo': produto.estoqueMinimo,
    'Localização': produto.localizacao,
    'Status': getStatusEstoque(produto)
  }));

  exportarCSV(dados, 'produtos');
}

function exportarVendas() {
  const dados = vendasFiltradas.map(venda => ({
    'ID': `#${venda.id.toString().padStart(4, '0')}`,
    'Data': formatarData(venda.data),
    'Cliente': venda.cliente,
    'Itens': venda.itens.length,
    'Subtotal': `R$ ${venda.subtotal.toFixed(2)}`,
    'Desconto': `R$ ${venda.desconto.toFixed(2)}`,
    'Total': `R$ ${venda.total.toFixed(2)}`,
    'Pagamento': formatarFormaPagamento(venda.formaPagamento),
    'Status': formatarStatusVenda(venda.status)
  }));

  exportarCSV(dados, 'vendas');
}

function exportarCSV(dados, tipo) {
  if (dados.length === 0) {
    alert('Nenhum dado para exportar');
    return;
  }
  
  const csv = gerarCSV(dados);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${tipo}_${new Date().toISOString().split('T')[0]}.csv`);
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
function imprimirVenda() {
  window.print();
}

// Notificações
function mostrarNotificacao(mensagem, tipo = 'info') {
  const notification = document.createElement('div');
  notification.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
  notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
  notification.innerHTML = `
    ${mensagem}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}
