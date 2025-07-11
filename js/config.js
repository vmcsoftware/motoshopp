// Configurações do Sistema MotoShop Pro
const CONFIG = {
  // Configurações gerais
  APP_NAME: 'MotoShop Pro',
  VERSION: '1.0.0',
  
  // Configurações de paginação
  ITEMS_PER_PAGE: 12,
  
  // Configurações de tempo
  NOTIFICATION_TIMEOUT: 5000,
  AUTO_SAVE_INTERVAL: 30000,
  
  // Configurações de validação
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  
  // Configurações de formato
  DATE_FORMAT: 'DD/MM/YYYY',
  CURRENCY_FORMAT: 'R$ 0,00',
  
  // Configurações de status
  STATUS_COLORS: {
    'aberta': '#6c757d',
    'em_andamento': '#ffc107',
    'aguardando_pecas': '#17a2b8',
    'concluida': '#28a745',
    'cancelada': '#dc3545'
  },
  
  // Configurações de prioridade
  PRIORITY_COLORS: {
    'baixa': '#28a745',
    'media': '#ffc107',
    'alta': '#fd7e14',
    'urgente': '#dc3545'
  },
  
  // Configurações de Firebase (para produção)
  FIREBASE_CONFIG: {
    apiKey: "your-api-key",
    authDomain: "your-domain.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
  },
  
  // Configurações de exportação
  EXPORT_FORMATS: {
    CSV: 'csv',
    PDF: 'pdf',
    EXCEL: 'xlsx'
  },
  
  // Configurações de impressão
  PRINT_SETTINGS: {
    margin: '1cm',
    format: 'A4',
    orientation: 'portrait'
  },
  
  // Configurações de animação
  ANIMATION_DURATION: 300,
  TRANSITION_DURATION: 500,
  
  // Configurações de drag and drop
  DRAG_DELAY: 100,
  DROP_ZONES: ['aberta', 'em_andamento', 'aguardando_pecas', 'concluida'],
  
  // Configurações de formulário
  FORM_AUTO_SAVE: true,
  FORM_VALIDATION: true,
  
  // Configurações de cache
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 horas
  
  // Configurações de API
  API_TIMEOUT: 10000,
  API_RETRY_ATTEMPTS: 3,
  
  // Configurações de desenvolvimento
  DEBUG_MODE: false,
  CONSOLE_LOGS: false,
  
  // Configurações de notificação
  NOTIFICATION_TYPES: {
    SUCCESS: 'success',
    ERROR: 'danger',
    WARNING: 'warning',
    INFO: 'info'
  },
  
  // Configurações de tema
  THEME: {
    PRIMARY: '#667eea',
    SECONDARY: '#764ba2',
    SUCCESS: '#28a745',
    DANGER: '#dc3545',
    WARNING: '#ffc107',
    INFO: '#17a2b8',
    LIGHT: '#f8f9fa',
    DARK: '#1a1a2e'
  }
};

// Função para inicializar configurações
function initializeConfig() {
  // Verificar se está em modo de desenvolvimento
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    CONFIG.DEBUG_MODE = true;
    CONFIG.CONSOLE_LOGS = true;
  }
  
  // Aplicar configurações de tema
  document.documentElement.style.setProperty('--primary-color', CONFIG.THEME.PRIMARY);
  document.documentElement.style.setProperty('--secondary-color', CONFIG.THEME.SECONDARY);
  
  // Configurar formatação de moeda
  if (typeof Intl !== 'undefined') {
    CONFIG.CURRENCY_FORMATTER = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
  
  // Configurar formatação de data
  if (typeof Intl !== 'undefined') {
    CONFIG.DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR');
  }
  
  return CONFIG;
}

// Função para log de debug
function debugLog(message, ...args) {
  if (CONFIG.DEBUG_MODE && CONFIG.CONSOLE_LOGS) {
    console.log(`[${CONFIG.APP_NAME}] ${message}`, ...args);
  }
}

// Função para formatação de moeda
function formatCurrency(value) {
  if (CONFIG.CURRENCY_FORMATTER) {
    return CONFIG.CURRENCY_FORMATTER.format(value);
  }
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

// Função para formatação de data
function formatDate(date) {
  if (CONFIG.DATE_FORMATTER) {
    return CONFIG.DATE_FORMATTER.format(new Date(date));
  }
  return new Date(date).toLocaleDateString('pt-BR');
}

// Função para obter cor por status
function getStatusColor(status) {
  return CONFIG.STATUS_COLORS[status] || CONFIG.STATUS_COLORS.aberta;
}

// Função para obter cor por prioridade
function getPriorityColor(priority) {
  return CONFIG.PRIORITY_COLORS[priority] || CONFIG.PRIORITY_COLORS.media;
}

// Função para validar arquivo
function validateFile(file) {
  if (file.size > CONFIG.MAX_FILE_SIZE) {
    return { valid: false, error: 'Arquivo muito grande' };
  }
  
  if (!CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Tipo de arquivo não permitido' };
  }
  
  return { valid: true };
}

// Função para configurar timeout
function setApiTimeout(request) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timeout da requisição'));
    }, CONFIG.API_TIMEOUT);
    
    request.then(resolve).catch(reject).finally(() => {
      clearTimeout(timeout);
    });
  });
}

// Exportar configurações
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CONFIG,
    initializeConfig,
    debugLog,
    formatCurrency,
    formatDate,
    getStatusColor,
    getPriorityColor,
    validateFile,
    setApiTimeout
  };
}

// Inicializar configurações quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeConfig);
