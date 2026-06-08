// ============================================================
//  CONFIGURAÇÃO DO FIREBASE — Central SECOM
// ============================================================
//
// Este app usa Firebase para sincronizar os dados em tempo real entre todos
// os aparelhos da equipe. A chave "Web" do Firebase NÃO é uma senha secreta:
// ela é pública por natureza e pode ficar no front-end. A segurança real fica
// nas Regras do Firestore + autenticação anônima habilitada no Console.

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBmtzuHVjXErXTyMkUeVCM01oJYNe-uSOA",
  authDomain: "secom-novo.firebaseapp.com",
  projectId: "secom-novo",
  storageBucket: "secom-novo.firebasestorage.app",
  messagingSenderId: "615721478085",
  appId: "1:615721478085:web:a522fd57eac0cac9190dac",
  measurementId: "G-3FY75N7D72",
};
