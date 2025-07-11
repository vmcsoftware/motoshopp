// Configuração Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Login
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, senha)
    .then((userCredential) => {
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      document.getElementById("error").innerText = "Erro: " + error.message;
    });
});
