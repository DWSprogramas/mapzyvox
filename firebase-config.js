// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA38xgnGCOaTwBh9QF2IpBJnZDLd_qP0JE",
  authDomain: "whatsstag.firebaseapp.com",
  databaseURL: "https://whatsstag-default-rtdb.firebaseio.com",
  projectId: "whatsstag",
  storageBucket: "whatsstag.firebasestorage.app",
  messagingSenderId: "216266845109",
  appId: "1:216266845109:web:5741201811d4bcab6d07fc"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Exporta os serviços específicos para usar em outros arquivos
const auth = firebase.auth();
const db = firebase.database();

// Verificar o estado de autenticação
auth.onAuthStateChanged((user) => {
  if (user) {
    // Usuário está logado
    console.log('Usuário logado:', user.uid);
    // Mostrar interface de usuário logado
    document.querySelectorAll('.auth-logged-in').forEach(el => el.style.display = 'block');
    document.querySelectorAll('.auth-logged-out').forEach(el => el.style.display = 'none');
    
    // Carregar dados do usuário se necessário
    loadUserData(user.uid);
  } else {
    // Usuário não está logado
    console.log('Usuário não logado');
    // Mostrar interface de login
    document.querySelectorAll('.auth-logged-in').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.auth-logged-out').forEach(el => el.style.display = 'block');
    
    // Verificar se estamos na página principal e redirecionar para login se for o caso
    if (window.location.pathname.endsWith('/index.html') || window.location.pathname.endsWith('/')) {
      if (!window.location.pathname.includes('login.html')) {
        // Redirecionar para a página de login
        window.location.href = './login.html';
      }
    }
  }
});

// Função para carregar dados do usuário
function loadUserData(userId) {
  // Tentar primeiro o caminho "MapzyVox/users/{uid}"
  const userRefMapzy = db.ref('MapzyVox/users/' + userId);
  
  userRefMapzy.once('value')
    .then((snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        console.log('Dados do usuário carregados do MapzyVox:', userData);
        if (userData.apiKey) {
          const apiKeyInput = document.getElementById('apiKey');
          if (apiKeyInput) {
            apiKeyInput.value = userData.apiKey;
          }
        }
      } else {
        console.log('Nenhum dado encontrado em MapzyVox, tentando WhatssTAG');
        
        // Tentar no caminho alternativo "WhatssTAG/{uid}"
        const userRefWhatsTag = db.ref('WhatssTAG/' + userId);
        userRefWhatsTag.once('value')
          .then((snapshot) => {
            const userData = snapshot.val();
            if (userData) {
              console.log('Dados do usuário carregados do WhatssTAG:', userData);
              if (userData.apiKey) {
                const apiKeyInput = document.getElementById('apiKey');
                if (apiKeyInput) {
                  apiKeyInput.value = userData.apiKey;
                }
              }
            } else {
              console.log('Nenhum dado encontrado para este usuário');
              // Criar registro de usuário caso não exista
              createUserData(userId);
            }
          })
          .catch((error) => {
            console.error('Erro ao carregar dados do usuário de WhatssTAG:', error);
          });
      }
    })
    .catch((error) => {
      console.error('Erro ao carregar dados do usuário de MapzyVox:', error);
    });
}

// Função para criar dados iniciais do usuário
function createUserData(userId) {
  const userData = {
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    transcriptions: {}
  };
  
  db.ref('MapzyVox/users/' + userId).set(userData)
    .then(() => {
      console.log('Dados iniciais do usuário criados em MapzyVox');
    })
    .catch((error) => {
      console.error('Erro ao criar dados do usuário em MapzyVox:', error);
      
      // Tentar no caminho alternativo
      db.ref('WhatssTAG/' + userId).set(userData)
        .then(() => {
          console.log('Dados iniciais do usuário criados em WhatssTAG');
        })
        .catch((error2) => {
          console.error('Erro ao criar dados do usuário em WhatssTAG:', error2);
        });
    });
}

// Função para salvar a API key do usuário
function saveUserApiKey(apiKey) {
  console.log('Função saveUserApiKey iniciada');
  const user = auth.currentUser;
  if (!user) {
    console.error('Usuário não está logado');
    return Promise.reject(new Error('Usuário não está logado'));
  }
  
  console.log('Usuário autenticado:', user.uid);
  
  // Primeiro, salvar no localStorage para compatibilidade
  localStorage.setItem('openai_api_key', apiKey);
  
  // Usar o caminho compatível com suas regras de segurança
  // Teste primeiro o caminho "MapzyVox/users/{uid}"
  return db.ref('MapzyVox/users/' + user.uid).update({
    apiKey: apiKey
  })
  .then(() => {
    console.log('Chave API salva com sucesso');
    alert('Chave API salva com sucesso!');
    return "Chave API salva com sucesso";
  })
  .catch((error) => {
    console.error('Erro ao salvar chave API no caminho MapzyVox:', error);
    
    // Se falhar, tentar o caminho alternativo "WhatssTAG/{uid}"
    return db.ref('WhatssTAG/' + user.uid).update({
      apiKey: apiKey
    })
    .then(() => {
      console.log('Chave API salva com sucesso no caminho alternativo');
      alert('Chave API salva com sucesso!');
      return "Chave API salva com sucesso";
    })
    .catch((error2) => {
      console.error('Erro ao salvar chave API no caminho alternativo:', error2);
      alert("Erro ao salvar chave API: " + error2.message);
      throw error2;
    });
  });
}

// Função para salvar uma transcrição
function saveTranscription(transcriptionData) {
  const user = auth.currentUser;
  if (!user) {
    console.error('Usuário não está logado');
    return Promise.reject(new Error('Usuário não está logado'));
  }
  
  // Criar um ID único para a transcrição
  const transcriptionId = db.ref().child('MapzyVox/users/' + user.uid + '/transcriptions').push().key;
  
  // Dados completos da transcrição
  const transcription = {
    id: transcriptionId,
    text: transcriptionData.text,
    processedText: transcriptionData.processedText,
    processingType: transcriptionData.processingType,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    title: transcriptionData.title || 'Transcrição ' + new Date().toLocaleString()
  };
  
  // Criar uma atualização para salvar
  const updates = {};
  updates['MapzyVox/users/' + user.uid + '/transcriptions/' + transcriptionId] = transcription;
  
  // Salvar no banco de dados
  return db.ref().update(updates);
}

// Função para buscar todas as transcrições do usuário
function getUserTranscriptions() {
  const user = auth.currentUser;
  if (!user) {
    console.error('Usuário não está logado');
    return Promise.reject(new Error('Usuário não está logado'));
  }
  
  return db.ref('MapzyVox/users/' + user.uid + '/transcriptions')
    .orderByChild('createdAt')
    .once('value')
    .then((snapshot) => {
      const transcriptions = [];
      snapshot.forEach((childSnapshot) => {
        transcriptions.push(childSnapshot.val());
      });
      return transcriptions.reverse(); // Mais recentes primeiro
    });
}

// Função para excluir uma transcrição
function deleteTranscription(transcriptionId) {
  const user = auth.currentUser;
  if (!user) {
    console.error('Usuário não está logado');
    return Promise.reject(new Error('Usuário não está logado'));
  }
  
  return db.ref('MapzyVox/users/' + user.uid + '/transcriptions/' + transcriptionId).remove();
}

// Função para atualizar uma transcrição
function updateTranscription(transcriptionId, updatedData) {
  const user = auth.currentUser;
  if (!user) {
    console.error('Usuário não está logado');
    return Promise.reject(new Error('Usuário não está logado'));
  }
  
  return db.ref('MapzyVox/users/' + user.uid + '/transcriptions/' + transcriptionId).update(updatedData);
}

// Exportar funções para uso em outros scripts
window.firebaseHelper = {
  auth,
  db,
  saveUserApiKey,
  saveTranscription,
  getUserTranscriptions,
  deleteTranscription,
  updateTranscription
};
