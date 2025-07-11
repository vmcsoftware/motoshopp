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
    setDoc,
    getDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Variáveis Firebase
let db;
let configCollection;
let usersCollection;

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
            configCollection = collection(db, 'configuracoes');
            usersCollection = collection(db, 'usuarios');
            
            console.log('Firebase inicializado com sucesso para configurações');
            
            // Carregar configurações do Firebase
            await carregarConfiguracoes();
            
            return true;
        }
    } catch (error) {
        console.error('Erro ao inicializar Firebase:', error);
        // Usar configurações padrão em caso de erro
        await carregarConfiguracoesPadrao();
        return false;
    }
}

// Carregar configurações do Firebase
async function carregarConfiguracoes() {
    try {
        const configRef = doc(db, 'configuracoes', 'sistema');
        const configDoc = await getDoc(configRef);
        
        if (configDoc.exists()) {
            const settings = configDoc.data();
            console.log('Configurações carregadas do Firebase');
            applySettings(settings);
        } else {
            console.log('Nenhuma configuração encontrada, usando padrão');
            await carregarConfiguracoesPadrao();
        }
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        await carregarConfiguracoesPadrao();
    }
}

// Salvar configurações no Firebase
async function salvarConfiguracoes(settings) {
    try {
        if (db) {
            const configRef = doc(db, 'configuracoes', 'sistema');
            await setDoc(configRef, settings);
            console.log('Configurações salvas no Firebase');
            return true;
        }
    } catch (error) {
        console.error('Erro ao salvar configurações:', error);
        // Salvar localmente como fallback
        localStorage.setItem('motoshop_config', JSON.stringify(settings));
        return false;
    }
}

// Configurações JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Firebase
    initializeFirebase();
    
    // Inicializar configurações
    initializeSettings();
    loadUserSettings();
    setupEventListeners();
    loadUsersTable();
    
    // Aplicar configurações salvas
    applySettings();
});

// Dados simulados para usuários (fallback)
const mockUsers = [
    {
        id: 1,
        name: 'João Silva',
        email: 'joao@motoshop.com',
        role: 'admin',
        status: 'active',
        lastAccess: '2023-12-15 14:30'
    },
    {
        id: 2,
        name: 'Maria Santos',
        email: 'maria@motoshop.com',
        role: 'manager',
        status: 'active',
        lastAccess: '2023-12-15 13:45'
    },
    {
        id: 3,
        name: 'Carlos Oliveira',
        email: 'carlos@motoshop.com',
        role: 'mechanic',
        status: 'inactive',
        lastAccess: '2023-12-14 18:20'
    },
    {
        id: 4,
        name: 'Ana Costa',
        email: 'ana@motoshop.com',
        role: 'receptionist',
        status: 'active',
        lastAccess: '2023-12-15 09:15'
    }
];

// Configurações padrão
const defaultSettings = {
    theme: 'dark',
    primaryColor: '#0d6efd',
    language: 'pt-BR',
    enableAnimations: true,
    enableNotifications: true,
    enableSounds: true,
    enableAutoSave: true,
    companyName: 'MotoShop Pro',
    companyCnpj: '',
    companyPhone: '',
    companyEmail: '',
    companyAddress: '',
    companyCity: '',
    companyState: '',
    companyCep: '',
    autoBackup: 'weekly',
    twoFactorAuth: false,
    sessionTimeout: true,
    loginLogs: true,
    emailNewOrder: true,
    emailOrderComplete: true,
    emailNewClient: true,
    emailLowStock: true,
    pushNewOrder: true,
    pushReminders: true,
    pushPayments: true,
    pushMarketing: false
};

function initializeSettings() {
    // Verificar se há configurações salvas no localStorage
    const savedSettings = localStorage.getItem('motoshop_settings');
    if (!savedSettings) {
        localStorage.setItem('motoshop_settings', JSON.stringify(defaultSettings));
    }
}

function loadUserSettings() {
    const settings = JSON.parse(localStorage.getItem('motoshop_settings')) || defaultSettings;
    
    // Aplicar configurações aos elementos
    Object.keys(settings).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = settings[key];
            } else if (element.type === 'color') {
                element.value = settings[key];
            } else {
                element.value = settings[key];
            }
        }
    });
}

function saveSettings() {
    const settings = {};
    
    // Coletar todas as configurações
    Object.keys(defaultSettings).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                settings[key] = element.checked;
            } else {
                settings[key] = element.value;
            }
        }
    });
    
    // Salvar no localStorage
    localStorage.setItem('motoshop_settings', JSON.stringify(settings));
    
    // Aplicar configurações
    applySettings();
    
    showNotification('Configurações salvas com sucesso!', 'success');
}

function applySettings() {
    const settings = JSON.parse(localStorage.getItem('motoshop_settings')) || defaultSettings;
    
    // Aplicar tema
    document.body.className = settings.theme === 'dark' ? 'dark-theme' : 'light-theme';
    
    // Aplicar cor primária
    document.documentElement.style.setProperty('--bs-primary', settings.primaryColor);
    
    // Aplicar animações
    if (!settings.enableAnimations) {
        document.body.classList.add('no-animations');
    } else {
        document.body.classList.remove('no-animations');
    }
    
    // Aplicar nome da empresa
    document.querySelectorAll('.navbar-brand').forEach(brand => {
        brand.innerHTML = `<i class="bi bi-gear-fill"></i> ${settings.companyName}`;
    });
}

function setupEventListeners() {
    // Salvar todas as configurações
    document.getElementById('saveAllBtn').addEventListener('click', saveSettings);
    
    // Resetar configurações
    document.getElementById('resetBtn').addEventListener('click', function() {
        if (confirm('Tem certeza que deseja resetar todas as configurações?')) {
            localStorage.setItem('motoshop_settings', JSON.stringify(defaultSettings));
            loadUserSettings();
            applySettings();
            showNotification('Configurações resetadas com sucesso!', 'info');
        }
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('Tem certeza que deseja sair?')) {
            window.location.href = 'login.html';
        }
    });
    
    // Upload de logo
    document.getElementById('logoFile').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('companyLogo').src = e.target.result;
                showNotification('Logo carregada com sucesso!', 'success');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Mudança de tema em tempo real
    document.getElementById('themeSelect').addEventListener('change', function() {
        const theme = this.value;
        document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    });
    
    // Mudança de cor primária em tempo real
    document.getElementById('primaryColor').addEventListener('change', function() {
        document.documentElement.style.setProperty('--bs-primary', this.value);
    });
    
    // Backup manual
    document.getElementById('createBackupBtn').addEventListener('click', createBackup);
    document.getElementById('downloadBackupBtn').addEventListener('click', downloadBackup);
    
    // Alterar senha
    document.getElementById('changePasswordBtn').addEventListener('click', function() {
        showPasswordModal();
    });
    
    // Adicionar usuário
    document.getElementById('saveUserBtn').addEventListener('click', addUser);
    
    // Auto-save nas configurações
    document.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('change', function() {
            if (document.getElementById('enableAutoSave').checked) {
                setTimeout(() => {
                    saveSettings();
                }, 1000); // Salvar após 1 segundo
            }
        });
    });
}

function loadUsersTable() {
    const tbody = document.getElementById('usersTable');
    tbody.innerHTML = '';
    
    mockUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <span class="badge ${getRoleBadgeClass(user.role)}">
                    ${getRoleLabel(user.role)}
                </span>
            </td>
            <td>
                <span class="badge ${user.status === 'active' ? 'bg-success' : 'bg-danger'}">
                    ${user.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>${formatDateTime(user.lastAccess)}</td>
            <td>
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-primary" onclick="editUser(${user.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function getRoleBadgeClass(role) {
    const classes = {
        admin: 'bg-danger',
        manager: 'bg-warning',
        mechanic: 'bg-info',
        receptionist: 'bg-success'
    };
    return classes[role] || 'bg-secondary';
}

function getRoleLabel(role) {
    const labels = {
        admin: 'Administrador',
        manager: 'Gerente',
        mechanic: 'Mecânico',
        receptionist: 'Recepcionista'
    };
    return labels[role] || 'Usuário';
}

function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleString('pt-BR');
}

function addUser() {
    const form = document.getElementById('addUserForm');
    const formData = new FormData(form);
    
    const newUser = {
        id: mockUsers.length + 1,
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        role: document.getElementById('userRole').value,
        status: 'active',
        lastAccess: new Date().toISOString()
    };
    
    // Validar formulário
    if (!newUser.name || !newUser.email || !newUser.role) {
        showNotification('Preencha todos os campos obrigatórios!', 'danger');
        return;
    }
    
    // Verificar se email já existe
    if (mockUsers.some(user => user.email === newUser.email)) {
        showNotification('Este email já está em uso!', 'danger');
        return;
    }
    
    // Adicionar usuário
    mockUsers.push(newUser);
    loadUsersTable();
    
    // Limpar formulário
    form.reset();
    
    // Fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
    modal.hide();
    
    showNotification('Usuário adicionado com sucesso!', 'success');
}

function editUser(userId) {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
        // Implementar edição de usuário
        showNotification('Funcionalidade de edição em desenvolvimento!', 'info');
    }
}

function deleteUser(userId) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        const index = mockUsers.findIndex(u => u.id === userId);
        if (index > -1) {
            mockUsers.splice(index, 1);
            loadUsersTable();
            showNotification('Usuário excluído com sucesso!', 'success');
        }
    }
}

function createBackup() {
    showNotification('Criando backup...', 'info');
    
    // Simular criação de backup
    setTimeout(() => {
        const backupData = {
            timestamp: new Date().toISOString(),
            settings: JSON.parse(localStorage.getItem('motoshop_settings')),
            users: mockUsers,
            // Adicionar outros dados necessários
        };
        
        localStorage.setItem('motoshop_backup', JSON.stringify(backupData));
        showNotification('Backup criado com sucesso!', 'success');
    }, 2000);
}

function downloadBackup() {
    const backupData = localStorage.getItem('motoshop_backup');
    if (backupData) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(backupData);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `motoshop_backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        
        showNotification('Backup baixado com sucesso!', 'success');
    } else {
        showNotification('Nenhum backup encontrado!', 'warning');
    }
}

function showPasswordModal() {
    // Criar modal de alteração de senha
    const modalHtml = `
        <div class="modal fade" id="passwordModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi bi-key"></i> Alterar Senha
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="passwordForm">
                            <div class="mb-3">
                                <label class="form-label">Senha Atual</label>
                                <input type="password" class="form-control" id="currentPassword" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Nova Senha</label>
                                <input type="password" class="form-control" id="newPassword" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Confirmar Nova Senha</label>
                                <input type="password" class="form-control" id="confirmPassword" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="changePassword()">Alterar Senha</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente se houver
    const existingModal = document.getElementById('passwordModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Adicionar modal ao body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('passwordModal'));
    modal.show();
}

function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validações
    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification('Preencha todos os campos!', 'danger');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('As senhas não coincidem!', 'danger');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('A senha deve ter pelo menos 6 caracteres!', 'danger');
        return;
    }
    
    // Simular alteração de senha
    setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('passwordModal'));
        modal.hide();
        showNotification('Senha alterada com sucesso!', 'success');
    }, 1000);
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
                <i class="bi bi-${getToastIcon(type)}"></i> ${message}
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

function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        danger: 'x-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Implementar funcionalidade de teste de notificações
document.addEventListener('DOMContentLoaded', function() {
    // Testar notificações push se habilitadas
    if ('Notification' in window && Notification.permission === 'granted') {
        const settings = JSON.parse(localStorage.getItem('motoshop_settings')) || defaultSettings;
        if (settings.enableNotifications) {
            // Implementar lógica de notificações push
        }
    }
});

// Estilo CSS adicional via JavaScript
const additionalStyles = `
    .dark-theme {
        --bs-body-bg: #1a1a1a;
        --bs-body-color: #fff;
        --bs-card-bg: #2d2d2d;
        --bs-border-color: #404040;
    }
    
    .light-theme {
        --bs-body-bg: #ffffff;
        --bs-body-color: #212529;
        --bs-card-bg: #ffffff;
        --bs-border-color: #dee2e6;
    }
    
    .no-animations * {
        animation: none !important;
        transition: none !important;
    }
    
    .card {
        background-color: var(--bs-card-bg);
        border-color: var(--bs-border-color);
    }
    
    .form-control, .form-select {
        background-color: var(--bs-card-bg);
        border-color: var(--bs-border-color);
        color: var(--bs-body-color);
    }
    
    .table {
        color: var(--bs-body-color);
    }
    
    .table-striped > tbody > tr:nth-of-type(odd) > td {
        background-color: rgba(0, 0, 0, 0.05);
    }
    
    .dark-theme .table-striped > tbody > tr:nth-of-type(odd) > td {
        background-color: rgba(255, 255, 255, 0.05);
    }
`;

// Injetar estilos adicionais
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Carregar configurações padrão (fallback)
async function carregarConfiguracoesPadrao() {
    console.log('Carregando configurações padrão');
    localStorage.setItem('motoshop_settings', JSON.stringify(defaultSettings));
    applySettings(defaultSettings);
}
