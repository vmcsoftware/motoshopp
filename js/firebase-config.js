/**
 * Firebase Configuration for MotoShop Pro
 * Configuração centralizada do Firebase para o sistema MotoShop Pro
 * Versão: 1.0.0
 * Data: 2024-01-02
 */

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

/**
 * Inicializa o Firebase com configuração completa
 */
function initializeFirebase() {
  try {
    console.log('🔥 Inicializando Firebase...');
    
    // Verifica se o Firebase já foi inicializado
    if (firebase.apps.length === 0) {
      // Inicializa o Firebase
      app = firebase.initializeApp(firebaseConfig);
      console.log('✅ Firebase App inicializado');
    } else {
      app = firebase.app();
      console.log('ℹ️ Firebase App já estava inicializado');
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
    
    // Configurar auth
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        console.log('✅ Persistência de autenticação configurada');
      })
      .catch((error) => {
        console.error('❌ Erro ao configurar persistência de autenticação:', error);
      });
    
    // Inicializar Analytics (se necessário)
    if (typeof gtag !== 'undefined') {
      analytics = firebase.analytics();
      console.log('✅ Firebase Analytics inicializado');
    }
    
    console.log('🎉 Firebase inicializado com sucesso!');
    
    // Retorna os serviços inicializados
    return { app, db, auth, analytics };
    
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error);
    throw error;
  }
}

/**
 * Obtém uma instância do Firestore
 */
function getFirestore() {
  if (!db) {
    throw new Error('Firebase não foi inicializado. Chame initializeFirebase() primeiro.');
  }
  return db;
}

/**
 * Obtém uma instância do Auth
 */
function getAuth() {
  if (!auth) {
    throw new Error('Firebase não foi inicializado. Chame initializeFirebase() primeiro.');
  }
  return auth;
}

/**
 * Obtém uma instância do Analytics
 */
function getAnalytics() {
  if (!analytics) {
    console.warn('Firebase Analytics não está inicializado');
    return null;
  }
  return analytics;
}

/**
 * Verifica se o Firebase está inicializado
 */
function isFirebaseInitialized() {
  return !!(app && db && auth);
}

/**
 * Utilitários para operações comuns do Firestore
 */
const FirestoreUtils = {
  
  /**
   * Converte timestamp do Firestore para Date
   */
  timestampToDate: (timestamp) => {
    if (!timestamp) return null;
    if (timestamp.toDate) {
      return timestamp.toDate();
    }
    return new Date(timestamp);
  },
  
  /**
   * Converte Date para timestamp do Firestore
   */
  dateToTimestamp: (date) => {
    if (!date) return null;
    if (date instanceof Date) {
      return firebase.firestore.Timestamp.fromDate(date);
    }
    return firebase.firestore.Timestamp.fromDate(new Date(date));
  },
  
  /**
   * Obtém timestamp atual do servidor
   */
  serverTimestamp: () => {
    return firebase.firestore.FieldValue.serverTimestamp();
  },
  
  /**
   * Gera um ID único para documentos
   */
  generateId: () => {
    return firebase.firestore().collection('temp').doc().id;
  }
};

/**
 * Utilitários para autenticação
 */
const AuthUtils = {
  
  /**
   * Verifica se o usuário está logado
   */
  isLoggedIn: () => {
    return auth && auth.currentUser !== null;
  },
  
  /**
   * Obtém o usuário atual
   */
  getCurrentUser: () => {
    return auth ? auth.currentUser : null;
  },
  
  /**
   * Obtém o UID do usuário atual
   */
  getCurrentUserId: () => {
    const user = AuthUtils.getCurrentUser();
    return user ? user.uid : null;
  },
  
  /**
   * Observa mudanças no estado de autenticação
   */
  onAuthStateChanged: (callback) => {
    if (auth) {
      return auth.onAuthStateChanged(callback);
    }
    return null;
  }
};

/**
 * Configuração de desenvolvimento/produção
 */
const CONFIG = {
  isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  enableDebug: true,
  enableAnalytics: true,
  enablePersistence: true
};

// Log de configuração
console.log('🔧 Configuração do Firebase carregada:', {
  projectId: firebaseConfig.projectId,
  isDevelopment: CONFIG.isDevelopment,
  enableDebug: CONFIG.enableDebug
});

// Disponibilizar globalmente
window.firebaseConfig = firebaseConfig;
window.initializeFirebase = initializeFirebase;
window.getFirestore = getFirestore;
window.getAuth = getAuth;
window.getAnalytics = getAnalytics;
window.isFirebaseInitialized = isFirebaseInitialized;
window.FirestoreUtils = FirestoreUtils;
window.AuthUtils = AuthUtils;
window.CONFIG = CONFIG;
