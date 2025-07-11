// Firebase Configuration for MotoShop Pro
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
let app;
let db;
let auth;
let analytics;

// Função para inicializar o Firebase
function initializeFirebase() {
  try {
    console.log('🔥 Inicializando Firebase...');
    
    // Initialize Firebase
    app = firebase.initializeApp(firebaseConfig);
    
    // Initialize Firebase services
    db = firebase.firestore();
    auth = firebase.auth();
    
    // Initialize Analytics (optional)
    if (typeof firebase.analytics !== 'undefined') {
      analytics = firebase.analytics();
      console.log('📊 Firebase Analytics inicializado');
    }
    
    console.log('✅ Firebase inicializado com sucesso!');
    
    // Configurar persistência offline
    if (db) {
      db.enablePersistence().catch((err) => {
        if (err.code == 'failed-precondition') {
          console.warn('Persistência offline não disponível - múltiplas abas abertas');
        } else if (err.code == 'unimplemented') {
          console.warn('Persistência offline não suportada pelo navegador');
        }
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error);
    return false;
  }
}

// Função para verificar status da conexão
function checkFirebaseConnection() {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Firebase não inicializado'));
      return;
    }
    
    // Teste de conexão com Firestore
    db.collection('_test').doc('connection').get()
      .then(() => {
        console.log('✅ Conexão com Firebase estabelecida');
        resolve(true);
      })
      .catch((error) => {
        console.warn('⚠️ Erro na conexão com Firebase:', error);
        resolve(false);
      });
  });
}

// Funções utilitárias para operações no Firebase
const FirebaseUtils = {
  // Clientes
  async getClientes() {
    try {
      const snapshot = await db.collection('clientes').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return [];
    }
  },
  
  async addCliente(clienteData) {
    try {
      const docRef = await db.collection('clientes').add({
        ...clienteData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('Cliente adicionado com ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      throw error;
    }
  },
  
  async updateCliente(id, clienteData) {
    try {
      await db.collection('clientes').doc(id).update({
        ...clienteData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('Cliente atualizado:', id);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  },
  
  async deleteCliente(id) {
    try {
      await db.collection('clientes').doc(id).delete();
      console.log('Cliente deletado:', id);
      return true;
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      throw error;
    }
  },
  
  // Motos
  async getMotos() {
    try {
      const snapshot = await db.collection('motos').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erro ao buscar motos:', error);
      return [];
    }
  },
  
  async addMoto(motoData) {
    try {
      const docRef = await db.collection('motos').add({
        ...motoData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('Moto adicionada com ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar moto:', error);
      throw error;
    }
  },
  
  // Ordens de Serviço
  async getOrdens() {
    try {
      const snapshot = await db.collection('ordens').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erro ao buscar ordens:', error);
      return [];
    }
  },
  
  async addOrdem(ordemData) {
    try {
      const docRef = await db.collection('ordens').add({
        ...ordemData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('Ordem adicionada com ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar ordem:', error);
      throw error;
    }
  },
  
  // Produtos
  async getProdutos() {
    try {
      const snapshot = await db.collection('produtos').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  },
  
  async addProduto(produtoData) {
    try {
      const docRef = await db.collection('produtos').add({
        ...produtoData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('Produto adicionado com ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      throw error;
    }
  },
  
  // Relatórios
  async getRelatorios() {
    try {
      const snapshot = await db.collection('relatorios').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
      return [];
    }
  },
  
  async salvarRelatorio(relatorioData) {
    try {
      const docRef = await db.collection('relatorios').add({
        ...relatorioData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('Relatório salvo com ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      throw error;
    }
  },
  
  // Autenticação
  async signIn(email, password) {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      console.log('Usuário logado:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },
  
  async signOut() {
    try {
      await auth.signOut();
      console.log('Usuário deslogado');
      return true;
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  },
  
  // Verificar usuário atual
  getCurrentUser() {
    return auth.currentUser;
  },
  
  // Listener para mudanças no estado de autenticação
  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  }
};

// Exportar para uso global
window.FirebaseUtils = FirebaseUtils;
window.firebaseConfig = firebaseConfig;
window.initializeFirebase = initializeFirebase;
window.checkFirebaseConnection = checkFirebaseConnection;

console.log('🔥 Firebase configuration loaded');
