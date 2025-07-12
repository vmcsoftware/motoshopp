// Firebase Configuration for MotoShop Pro
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Configuração do Firebase
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

// Variáveis globais do Firebase
let app;
let db;
let auth;
let analytics;

// Função para inicializar o Firebase
function initializeFirebase() {
  try {
    console.log('🔥 Inicializando Firebase...');
    
    // Verificar se já foi inicializado
    if (firebase.apps.length === 0) {
      // Initialize Firebase
      app = firebase.initializeApp(firebaseConfig);
      console.log('✅ Firebase App inicializado');
    } else {
      app = firebase.apps[0];
      console.log('✅ Firebase App já estava inicializado');
    }
    
    // Initialize Firebase services
    db = firebase.firestore();
    auth = firebase.auth();
    
    // Initialize Analytics (optional)
    if (typeof firebase.analytics !== 'undefined') {
      try {
        analytics = firebase.analytics();
        console.log('📊 Firebase Analytics inicializado');
      } catch (analyticsError) {
        console.warn('⚠️ Analytics não disponível:', analyticsError.message);
      }
    }
    
    console.log('✅ Firebase inicializado com sucesso!');
    
    // Configurar persistência offline com tratamento robusto de erros
    if (db) {
      db.enablePersistence({ synchronizeTabs: true })
        .then(() => {
          console.log('✅ Persistência offline habilitada');
        })
        .catch((err) => {
          if (err.code === 'failed-precondition') {
            console.warn('⚠️ Persistência offline não disponível - múltiplas abas abertas');
          } else if (err.code === 'unimplemented') {
            console.warn('⚠️ Persistência offline não suportada pelo navegador');
          } else if (err.message && err.message.includes('newer version')) {
            console.warn('⚠️ Versão do SDK incompatível - limpando dados locais...');
            // Tentar limpar dados incompatíveis
            limparDadosFirestore();
          } else {
            console.error('❌ Erro ao habilitar persistência offline:', err);
          }
          // Continuar sem persistência
          console.log('📱 Funcionando sem persistência offline');
        });
    }
    
    return { app, db, auth, analytics };
    
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error);
    throw error;
  }
}

// Função alternativa para inicializar Firebase sem persistência
function initializeFirebaseSemPersistencia() {
  try {
    console.log('🔥 Inicializando Firebase sem persistência...');
    
    // Verificar se já foi inicializado
    if (firebase.apps.length === 0) {
      // Initialize Firebase
      app = firebase.initializeApp(firebaseConfig);
      console.log('✅ Firebase App inicializado');
    } else {
      app = firebase.apps[0];
      console.log('✅ Firebase App já estava inicializado');
    }
    
    // Initialize Firebase services
    db = firebase.firestore();
    auth = firebase.auth();
    
    // Initialize Analytics (optional)
    if (typeof firebase.analytics !== 'undefined') {
      try {
        analytics = firebase.analytics();
        console.log('📊 Firebase Analytics inicializado');
      } catch (analyticsError) {
        console.warn('⚠️ Analytics não disponível:', analyticsError.message);
      }
    }
    
    console.log('✅ Firebase inicializado sem persistência!');
    
    return { app, db, auth, analytics };
    
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error);
    throw error;
  }
}

// Função para limpar dados do Firestore em caso de conflito de versão
function limparDadosFirestore() {
  return new Promise((resolve) => {
    try {
      console.log('🧹 Tentando limpar dados do IndexedDB...');
      
      // Tentar limpar usando IndexedDB API
      if (typeof indexedDB !== 'undefined') {
        // Lista de bancos possíveis do Firebase
        const firebaseDatabases = [
          'firebaseLocalStorageDb',
          'firebase-heartbeat-database',
          'firebase-installations-database'
        ];
        
        // Tentar deletar bases de dados do Firebase
        firebaseDatabases.forEach(dbName => {
          try {
            const deleteReq = indexedDB.deleteDatabase(dbName);
            deleteReq.onsuccess = () => {
              console.log(`🗑️ Database ${dbName} removido`);
            };
            deleteReq.onerror = () => {
              console.log(`⚠️ Não foi possível remover ${dbName}`);
            };
          } catch (error) {
            console.log(`⚠️ Erro ao tentar remover ${dbName}:`, error.message);
          }
        });
        
        // Limpar localStorage relacionado ao Firebase
        try {
          Object.keys(localStorage).forEach(key => {
            if (key.includes('firebase') || key.includes('firestore')) {
              localStorage.removeItem(key);
              console.log(`🗑️ Chave localStorage removida: ${key}`);
            }
          });
        } catch (error) {
          console.log('⚠️ Erro ao limpar localStorage:', error.message);
        }
        
        console.log('✅ Limpeza concluída - reinicie o navegador para melhor resultado');
        
        // Mostrar notificação para o usuário
        if (typeof mostrarNotificacao === 'function') {
          mostrarNotificacao('Cache do Firebase limpo - recarregue a página', 'info');
        }
        
      } else {
        console.log('⚠️ IndexedDB não disponível');
      }
      
      resolve(true);
      
    } catch (error) {
      console.log('⚠️ Erro durante limpeza:', error.message);
      resolve(false);
    }
  });
}

// Disponibilizar globalmente
window.firebaseConfig = firebaseConfig;
window.initializeFirebase = initializeFirebase;
window.initializeFirebaseSemPersistencia = initializeFirebaseSemPersistencia;
window.limparDadosFirestore = limparDadosFirestore;

console.log('🔥 Firebase configuration loaded');
