// Configuração do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getFirestore, 
    collection, 
    getDocs, 
    query,
    orderBy,
    where,
    onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Variáveis Firebase
let db;
let clientesCollection;
let motosCollection;
let ordensCollection;
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
            clientesCollection = collection(db, 'clientes');
            motosCollection = collection(db, 'motos');
            ordensCollection = collection(db, 'ordens');
            produtosCollection = collection(db, 'produtos');
            
            console.log('Firebase inicializado com sucesso para relatórios');
            
            // Carregar dados do Firebase
            await carregarDadosDoFirebase();
            
            return true;
        }
    } catch (error) {
        console.error('Erro ao inicializar Firebase:', error);
        // Usar dados simulados em caso de erro
        await carregarDadosSimulados();
        return false;
    }
}

// Carregar dados do Firebase
async function carregarDadosDoFirebase() {
    try {
        console.log('Carregando dados do Firebase para relatórios...');
        
        // Carregar dados das collections
        const [clientesSnapshot, motosSnapshot, ordensSnapshot, produtosSnapshot] = await Promise.all([
            getDocs(clientesCollection),
            getDocs(motosCollection),
            getDocs(ordensCollection),
            getDocs(produtosCollection)
        ]);
        
        // Processar dados
        const clientes = [];
        const motos = [];
        const ordens = [];
        const produtos = [];
        
        clientesSnapshot.forEach(doc => clientes.push({ id: doc.id, ...doc.data() }));
        motosSnapshot.forEach(doc => motos.push({ id: doc.id, ...doc.data() }));
        ordensSnapshot.forEach(doc => ordens.push({ id: doc.id, ...doc.data() }));
        produtosSnapshot.forEach(doc => produtos.push({ id: doc.id, ...doc.data() }));
        
        // Atualizar dados dos gráficos com dados reais
        updateChartsWithRealData(clientes, motos, ordens, produtos);
        
        console.log('Dados carregados do Firebase:', {
            clientes: clientes.length,
            motos: motos.length,
            ordens: ordens.length,
            produtos: produtos.length
        });
        
    } catch (error) {
        console.error('Erro ao carregar dados do Firebase:', error);
        await carregarDadosSimulados();
    }
}

// Carregar dados simulados (fallback)
async function carregarDadosSimulados() {
    console.log('Usando dados simulados para relatórios');
    // Usar dados mockados
    loadReportData();
}

// Relatórios JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando página de relatórios...');
    
    // Aguardar o Chart.js carregar
    if (typeof Chart === 'undefined') {
        console.log('⏳ Aguardando Chart.js carregar...');
        setTimeout(() => {
            initializeReports();
        }, 1000);
    } else {
        initializeReports();
    }
});

function initializeReports() {
    console.log('📊 Inicializando relatórios...');
    updateStatusIndicator('loading', 'Inicializando...');
    
    // Inicializar Firebase
    initializeFirebase();
    
    // Inicializar dados e gráficos
    initializeCharts();
    loadReportData();
    setupEventListeners();
    
    // Configurar filtros
    setupFilters();
    
    // Atualizar dados a cada 30 segundos
    setInterval(loadReportData, 30000);
    
    console.log('✅ Relatórios inicializados com sucesso!');
    updateStatusIndicator('success', 'Sistema Ativo');
}

// Dados simulados para os gráficos
const mockData = {
    revenue: [12500, 15000, 18000, 16500, 19000, 21000, 23000, 25000, 22000, 24000, 26000, 28000],
    services: {
        labels: ['Troca de Óleo', 'Revisão Geral', 'Freios', 'Pneus', 'Suspensão', 'Embreagem'],
        data: [35, 25, 20, 15, 12, 8]
    },
    products: {
        labels: ['Óleo Motor', 'Filtro de Ar', 'Vela', 'Pastilha Freio', 'Correia', 'Bateria'],
        data: [45, 30, 25, 20, 15, 10]
    },
    weekly: {
        labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
        data: [1200, 1500, 1800, 2100, 2400, 3000, 800]
    }
};

let charts = {};

function initializeCharts() {
    console.log('📈 Inicializando gráficos...');
    
    try {
        // Verificar se Chart.js está disponível
        if (typeof Chart === 'undefined') {
            console.error('Chart.js não está disponível!');
            showNotification('Erro ao carregar gráficos. Atualize a página.', 'danger');
            return;
        }
        
        // Gráfico de Receita
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            charts.revenue = new Chart(revenueCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    datasets: [{
                        label: 'Receita (R$)',
                        data: mockData.revenue,
                        borderColor: '#0d6efd',
                        backgroundColor: 'rgba(13, 110, 253, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'R$ ' + value.toLocaleString('pt-BR');
                                }
                            }
                        }
                    }
                }
            });
            console.log('✅ Gráfico de receita criado');
        }

        // Gráfico de Serviços
        const servicesCtx = document.getElementById('servicesChart');
        if (servicesCtx) {
            charts.services = new Chart(servicesCtx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: mockData.services.labels,
                    datasets: [{
                        data: mockData.services.data,
                        backgroundColor: [
                            '#0d6efd',
                            '#6f42c1',
                            '#d63384',
                            '#fd7e14',
                            '#ffc107',
                            '#20c997'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
            console.log('✅ Gráfico de serviços criado');
        }

        // Gráfico de Produtos
        const productsCtx = document.getElementById('productsChart');
        if (productsCtx) {
            charts.products = new Chart(productsCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: mockData.products.labels,
                    datasets: [{
                        label: 'Vendas',
                        data: mockData.products.data,
                        backgroundColor: [
                            '#0d6efd',
                            '#6f42c1',
                            '#d63384',
                            '#fd7e14',
                            '#ffc107',
                            '#20c997'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            console.log('✅ Gráfico de produtos criado');
        }

        // Gráfico Semanal
        const weeklyCtx = document.getElementById('weeklyChart');
        if (weeklyCtx) {
            charts.weekly = new Chart(weeklyCtx.getContext('2d'), {
                type: 'radar',
                data: {
                    labels: mockData.weekly.labels,
                    datasets: [{
                        label: 'Vendas por Dia',
                        data: mockData.weekly.data,
                        borderColor: '#20c997',
                        backgroundColor: 'rgba(32, 201, 151, 0.2)',
                        pointBackgroundColor: '#20c997',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#20c997'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        r: {
                            beginAtZero: true
                        }
                    }
                }
            });
            console.log('✅ Gráfico semanal criado');
        }
        
        console.log('🎉 Todos os gráficos inicializados com sucesso!');
        
    } catch (error) {
        console.error('Erro ao inicializar gráficos:', error);
        showNotification('Erro ao carregar gráficos. Tente atualizar a página.', 'danger');
    }
}

function loadReportData() {
    console.log('🔄 Carregando dados do relatório...');
    
    // Simular carregamento de dados
    showLoadingState();
    
    setTimeout(() => {
        updateStatistics();
        updateReportTable();
        hideLoadingState();
        
        // Mostrar notificação de sucesso na primeira carga
        if (!window.reportDataLoaded) {
            showNotification('Relatórios carregados com sucesso!', 'success');
            window.reportDataLoaded = true;
        }
        
        console.log('✅ Dados do relatório carregados!');
    }, 1000);
}

function updateStatistics() {
    // Atualizar cards de estatísticas
    const stats = {
        totalRevenue: 89750.00,
        completedOrders: 156,
        newClients: 23,
        avgTicket: 575.32
    };

    document.getElementById('totalRevenue').textContent = 
        'R$ ' + stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    document.getElementById('completedOrders').textContent = stats.completedOrders;
    document.getElementById('newClients').textContent = stats.newClients;
    document.getElementById('avgTicket').textContent = 
        'R$ ' + stats.avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function updateReportTable() {
    const tableBody = document.getElementById('reportTable');
    const sampleData = [
        {
            date: '2023-12-01',
            type: 'Serviço',
            description: 'Troca de Óleo - Honda CB600',
            client: 'João Silva',
            value: 150.00,
            status: 'Concluído'
        },
        {
            date: '2023-12-01',
            type: 'Produto',
            description: 'Venda de Capacete',
            client: 'Maria Santos',
            value: 280.00,
            status: 'Pago'
        },
        {
            date: '2023-12-02',
            type: 'Serviço',
            description: 'Revisão Geral - Yamaha R1',
            client: 'Carlos Oliveira',
            value: 450.00,
            status: 'Em Andamento'
        },
        {
            date: '2023-12-02',
            type: 'Produto',
            description: 'Filtro de Ar',
            client: 'Ana Costa',
            value: 85.00,
            status: 'Entregue'
        },
        {
            date: '2023-12-03',
            type: 'Serviço',
            description: 'Troca de Pneus - Kawasaki Ninja',
            client: 'Pedro Almeida',
            value: 320.00,
            status: 'Agendado'
        }
    ];

    tableBody.innerHTML = '';
    sampleData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(item.date)}</td>
            <td>
                <span class="badge ${item.type === 'Serviço' ? 'bg-primary' : 'bg-success'}">
                    ${item.type}
                </span>
            </td>
            <td>${item.description}</td>
            <td>${item.client}</td>
            <td>R$ ${item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(item.status)}">
                    ${item.status}
                </span>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function setupEventListeners() {
    // Filtro de período
    document.getElementById('periodFilter').addEventListener('change', function() {
        const isPersonalized = this.value === 'personalizado';
        document.getElementById('startDate').disabled = !isPersonalized;
        document.getElementById('endDate').disabled = !isPersonalized;
        
        if (!isPersonalized) {
            updateChartsByPeriod(this.value);
        }
    });

    // Filtro de tipo de relatório
    document.getElementById('reportTypeFilter').addEventListener('change', function() {
        updateChartsByType(this.value);
    });

    // Exportar relatório
    document.getElementById('exportReportBtn').addEventListener('click', exportReport);

    // Imprimir relatório
    document.getElementById('printReportBtn').addEventListener('click', printReport);

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('Tem certeza que deseja sair?')) {
            window.location.href = 'login.html';
        }
    });
}

function setupFilters() {
    // Configurar datas padrão
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    document.getElementById('startDate').value = firstDayOfMonth.toISOString().split('T')[0];
    document.getElementById('endDate').value = today.toISOString().split('T')[0];
}

function updateChartsByPeriod(period) {
    // Simular atualização dos gráficos baseado no período
    let newData = [...mockData.revenue];
    
    switch (period) {
        case 'hoje':
            newData = [2800];
            break;
        case 'semana':
            newData = [4200, 3800, 4500, 5100, 4800, 5500, 3200];
            break;
        case 'mes':
            newData = mockData.revenue;
            break;
        case 'trimestre':
            newData = [78000, 85000, 92000];
            break;
        case 'ano':
            newData = [280000];
            break;
    }

    charts.revenue.data.datasets[0].data = newData;
    charts.revenue.update();
}

function updateChartsByType(type) {
    // Simular atualização dos gráficos baseado no tipo
    console.log('Filtrando relatório por tipo:', type);
    
    // Aqui você implementaria a lógica para filtrar os dados
    // baseado no tipo de relatório selecionado
}

function exportReport() {
    showNotification('Relatório exportado com sucesso!', 'success');
    
    // Simular download
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        period: document.getElementById('periodFilter').value,
        type: document.getElementById('reportTypeFilter').value,
        data: mockData,
        timestamp: new Date().toISOString()
    }));
    
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "relatorio_motoshop.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function printReport() {
    window.print();
}

function showLoadingState() {
    // Mostrar indicadores de carregamento
    document.querySelectorAll('.card-body').forEach(card => {
        card.style.opacity = '0.5';
    });
}

function hideLoadingState() {
    // Esconder indicadores de carregamento
    document.querySelectorAll('.card-body').forEach(card => {
        card.style.opacity = '1';
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function getStatusBadgeClass(status) {
    const statusClasses = {
        'Concluído': 'bg-success',
        'Pago': 'bg-success',
        'Em Andamento': 'bg-warning',
        'Entregue': 'bg-info',
        'Agendado': 'bg-secondary',
        'Cancelado': 'bg-danger'
    };
    return statusClasses[status] || 'bg-secondary';
}

function showNotification(message, type = 'info') {
    // Criar notificação toast
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remover toast após ser escondido
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '1050';
    document.body.appendChild(container);
    return container;
}

// Função para atualizar o indicador de status
function updateStatusIndicator(status, message) {
    const indicator = document.getElementById('statusIndicator');
    if (indicator) {
        switch (status) {
            case 'loading':
                indicator.className = 'badge bg-warning';
                indicator.innerHTML = '<i class="bi bi-hourglass-split"></i> ' + message;
                break;
            case 'success':
                indicator.className = 'badge bg-success';
                indicator.innerHTML = '<i class="bi bi-check-circle"></i> ' + message;
                break;
            case 'error':
                indicator.className = 'badge bg-danger';
                indicator.innerHTML = '<i class="bi bi-exclamation-triangle"></i> ' + message;
                break;
            default:
                indicator.className = 'badge bg-secondary';
                indicator.innerHTML = '<i class="bi bi-info-circle"></i> ' + message;
        }
    }
}

// Função para atualizar gráficos com dados reais
function updateChartsWithRealData(clientes, motos, ordens, produtos) {
    console.log('Atualizando gráficos com dados reais...');
    
    // Processar dados de ordens para receita por mês
    const revenueByMonth = Array(12).fill(0);
    const currentYear = new Date().getFullYear();
    
    ordens.forEach(ordem => {
        if (ordem.dataAbertura && ordem.status === 'concluida') {
            const date = new Date(ordem.dataAbertura);
            if (date.getFullYear() === currentYear) {
                const month = date.getMonth();
                revenueByMonth[month] += ordem.valorTotal || 0;
            }
        }
    });
    
    // Processar dados de produtos mais vendidos
    const produtosMaisVendidos = produtos
        .filter(p => p.vendas > 0)
        .sort((a, b) => b.vendas - a.vendas)
        .slice(0, 6)
        .map(p => ({ label: p.nome, data: p.vendas }));
    
    // Processar dados de serviços
    const servicosPorTipo = {};
    ordens.forEach(ordem => {
        if (ordem.tipoServico) {
            servicosPorTipo[ordem.tipoServico] = (servicosPorTipo[ordem.tipoServico] || 0) + 1;
        }
    });
    
    // Atualizar dados dos gráficos
    mockData.revenue = revenueByMonth;
    
    if (produtosMaisVendidos.length > 0) {
        mockData.products = {
            labels: produtosMaisVendidos.map(p => p.label),
            data: produtosMaisVendidos.map(p => p.data)
        };
    }
    
    if (Object.keys(servicosPorTipo).length > 0) {
        mockData.services = {
            labels: Object.keys(servicosPorTipo),
            data: Object.values(servicosPorTipo)
        };
    }
    
    // Atualizar estatísticas
    updateStatistics(clientes, motos, ordens, produtos);
    
    console.log('Gráficos atualizados com dados reais');
}

// Função para atualizar estatísticas
function updateStatistics(clientes, motos, ordens, produtos) {
    // Atualizar cards de estatísticas
    const totalClientes = clientes.length;
    const totalMotos = motos.length;
    const ordensAbertas = ordens.filter(o => o.status === 'aberta').length;
    const produtosEstoque = produtos.reduce((sum, p) => sum + (p.quantidadeEstoque || 0), 0);
    
    // Atualizar elementos do DOM se existirem
    const clientesCard = document.querySelector('[data-stat="clientes"]');
    const motosCard = document.querySelector('[data-stat="motos"]');
    const ordensCard = document.querySelector('[data-stat="ordens"]');
    const estoquesCard = document.querySelector('[data-stat="estoque"]');
    
    if (clientesCard) clientesCard.textContent = totalClientes;
    if (motosCard) motosCard.textContent = totalMotos;
    if (ordensCard) ordensCard.textContent = ordensAbertas;
    if (estoquesCard) estoquesCard.textContent = produtosEstoque;
}

// Animações e efeitos visuais
function addAnimations() {
    // Adicionar animação aos cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s both`;
    });
    
    // Adicionar efeito hover aos gráficos
    const chartContainers = document.querySelectorAll('canvas');
    chartContainers.forEach(canvas => {
        canvas.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        canvas.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Inicializar animações após o carregamento
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addAnimations, 100);
});

// Estilo CSS adicional via JavaScript
const additionalStyles = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .card {
        transition: all 0.3s ease;
    }
    
    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    
    .text-success-light {
        color: #d4edda !important;
    }
    
    .text-info-light {
        color: #d1ecf1 !important;
    }
    
    .text-warning-light {
        color: #fff3cd !important;
    }
    
    .text-danger-light {
        color: #f8d7da !important;
    }
`;

// Injetar estilos adicionais
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
