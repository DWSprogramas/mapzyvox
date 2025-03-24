<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Gravador de Áudio com Transcrição</title>
    <!-- PWA elementos -->
    <link rel="manifest" href="./manifest.json">
    <meta name="theme-color" content="#3498db">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="Transcritor">
    <link rel="apple-touch-icon" href="./ios/180.png">
    <!-- Fim PWA elementos -->
    
    <!-- Firebase SDK -->
		<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
		<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"></script>
		<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>
		<script src="./firebase-config.js"></script>
    
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 70vh;
        }
        
        .login-card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 30px;
            width: 100%;
            max-width: 400px;
            margin-bottom: 20px;
        }
        
        h1 {
            color: #2c3e50;
            text-align: center;
        }
        
        h2 {
            color: #3498db;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #2c3e50;
        }
        
        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
        }
        
        button {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 4px;
            background-color: #3498db;
            color: white;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s;
            margin-top: 10px;
        }
        
        button:hover {
            background-color: #2980b9;
        }
        
        .social-login {
            margin-top: 20px;
            text-align: center;
        }
        
        .divider {
            display: flex;
            align-items: center;
            margin: 20px 0;
        }
        
        .divider-line {
            flex: 1;
            height: 1px;
            background-color: #ddd;
        }
        
        .divider-text {
            padding: 0 10px;
            color: #95a5a6;
        }
        
        .google-button {
            background-color: white;
            color: #333;
            border: 1px solid #ddd;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
        }
        
        .google-button img {
            width: 20px;
            margin-right: 10px;
        }
        
        .toggle-form {
            margin-top: 15px;
            text-align: center;
            font-size: 14px;
        }
        
        .toggle-form a {
            color: #3498db;
            cursor: pointer;
            text-decoration: none;
        }
        
        .error-message {
            color: #e74c3c;
            margin-top: 10px;
            text-align: center;
            display: none;
        }
        
        .success-message {
            color: #2ecc71;
            margin-top: 10px;
            text-align: center;
            display: none;
        }
        
        #forgotPassword {
            text-align: right;
            font-size: 14px;
            margin-top: 5px;
            display: block;
        }
        
        #forgotPassword a {
            color: #3498db;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="login-card">
            <h1>Transcritor de Áudio</h1>
            
            <!-- Login Form -->
            <div id="loginForm">
                <h2>Login</h2>
                <div class="form-group">
                    <label for="loginEmail">Email</label>
                    <input type="email" id="loginEmail" placeholder="seu@email.com" required>
                </div>
                <div class="form-group">
                    <label for="loginPassword">Senha</label>
                    <input type="password" id="loginPassword" placeholder="Sua senha" required>
                    <span id="forgotPassword"><a href="#" onclick="showResetPassword()">Esqueci minha senha</a></span>
                </div>
                <button onclick="loginWithEmail()">Entrar</button>
                <div class="toggle-form">
                    Não tem uma conta? <a onclick="showRegisterForm()">Cadastre-se</a>
                </div>
                
                <div class="divider">
                    <div class="divider-line"></div>
                    <div class="divider-text">ou</div>
                    <div class="divider-line"></div>
                </div>
                
                <div class="social-login">
                    <button class="google-button" onclick="loginWithGoogle()">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google"> Entrar com Google
                    </button>
                </div>
                
                <div id="loginError" class="error-message"></div>
            </div>
            
            <!-- Register Form -->
            <div id="registerForm" style="display: none;">
                <h2>Criar Conta</h2>
                <div class="form-group">
                    <label for="registerEmail">Email</label>
                    <input type="email" id="registerEmail" placeholder="seu@email.com" required>
                </div>
                <div class="form-group">
                    <label for="registerPassword">Senha</label>
                    <input type="password" id="registerPassword" placeholder="Crie uma senha" required>
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Confirmar Senha</label>
                    <input type="password" id="confirmPassword" placeholder="Confirme sua senha" required>
                </div>
                <button onclick="registerWithEmail()">Cadastrar</button>
                <div class="toggle-form">
                    Já tem uma conta? <a onclick="showLoginForm()">Faça login</a>
                </div>
                <div id="registerError" class="error-message"></div>
                <div id="registerSuccess" class="success-message"></div>
            </div>
            
            <!-- Reset Password Form -->
            <div id="resetPasswordForm" style="display: none;">
                <h2>Redefinir Senha</h2>
                <div class="form-group">
                    <label for="resetEmail">Email</label>
                    <input type="email" id="resetEmail" placeholder="seu@email.com" required>
                </div>
                <button onclick="sendPasswordResetEmail()">Enviar Email de Recuperação</button>
                <div class="toggle-form">
                    <a onclick="showLoginForm()">Voltar para login</a>
                </div>
                <div id="resetError" class="error-message"></div>
                <div id="resetSuccess" class="success-message"></div>
            </div>
        </div>
    </div>
    
    <!-- Script para registrar o service worker -->
    <script src="./register-sw.js"></script>
    
    <!-- Script de configuração do Firebase -->
    <script src="./firebase-config.js"></script>
    
    <script>
        // Toggle entre os formulários
        function showLoginForm() {
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('resetPasswordForm').style.display = 'none';
            clearMessages();
        }
        
        function showRegisterForm() {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('registerForm').style.display = 'block';
            document.getElementById('resetPasswordForm').style.display = 'none';
            clearMessages();
        }
        
        function showResetPassword() {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('resetPasswordForm').style.display = 'block';
            clearMessages();
        }
        
        // Limpar mensagens de erro/sucesso
        function clearMessages() {
            const messages = document.querySelectorAll('.error-message, .success-message');
            messages.forEach(msg => {
                msg.style.display = 'none';
                msg.textContent = '';
            });
        }
        
        // Login com Email e Senha
        function loginWithEmail() {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const errorElement = document.getElementById('loginError');
            
            if (!email || !password) {
                errorElement.textContent = 'Por favor, preencha todos os campos.';
                errorElement.style.display = 'block';
                return;
            }
            
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Login bem-sucedido
                    window.location.href = './index.html';
                })
                .catch((error) => {
                    // Tratar erros específicos
                    let errorMessage;
                    switch (error.code) {
                        case 'auth/invalid-email':
                            errorMessage = 'Email inválido.';
                            break;
                        case 'auth/user-disabled':
                            errorMessage = 'Esta conta foi desativada.';
                            break;
                        case 'auth/user-not-found':
                            errorMessage = 'Usuário não encontrado.';
                            break;
                        case 'auth/wrong-password':
                            errorMessage = 'Senha incorreta.';
                            break;
                        default:
                            errorMessage = 'Erro ao fazer login: ' + error.message;
                    }
                    
                    errorElement.textContent = errorMessage;
                    errorElement.style.display = 'block';
                });
        }
        
        // Cadastro com Email e Senha
        function registerWithEmail() {
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const errorElement = document.getElementById('registerError');
            const successElement = document.getElementById('registerSuccess');
            
            if (!email || !password || !confirmPassword) {
                errorElement.textContent = 'Por favor, preencha todos os campos.';
                errorElement.style.display = 'block';
                return;
            }
            
            if (password !== confirmPassword) {
                errorElement.textContent = 'As senhas não coincidem.';
                errorElement.style.display = 'block';
                return;
            }
            
            if (password.length < 6) {
                errorElement.textContent = 'A senha deve ter pelo menos 6 caracteres.';
                errorElement.style.display = 'block';
                return;
            }
            
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Cadastro bem-sucedido
                    successElement.textContent = 'Conta criada com sucesso!';
                    successElement.style.display = 'block';
                    
                    // Redirecionar após mensagem de sucesso
                    setTimeout(() => {
                        window.location.href = './index.html';
                    }, 1500);
                })
                .catch((error) => {
                    // Tratar erros específicos
                    let errorMessage;
                    switch (error.code) {
                        case 'auth/email-already-in-use':
                            errorMessage = 'Este email já está em uso.';
                            break;
                        case 'auth/invalid-email':
                            errorMessage = 'Email inválido.';
                            break;
                        case 'auth/weak-password':
                            errorMessage = 'A senha é muito fraca.';
                            break;
                        default:
                            errorMessage = 'Erro ao criar conta: ' + error.message;
                    }
                    
                    errorElement.textContent = errorMessage;
                    errorElement.style.display = 'block';
                });
        }
        
function loginWithGoogle() {
    // Adicionar log para depuração
    console.log("Iniciando login com Google");
    
    // Criar o provedor Google
    const provider = new firebase.auth.GoogleAuthProvider();
    
    // Adicionar escopos adicionais (opcional)
    provider.addScope('profile');
    provider.addScope('email');
    
    // Configurar parâmetros personalizados (opcional)
    provider.setCustomParameters({
        'prompt': 'select_account'
    });
    
    // Adicionar log do provedor
    console.log("Provedor configurado:", provider);
    
    // Tentar login
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log("Login bem-sucedido:", result.user.email);
            window.location.href = './index.html';
        })
        .catch((error) => {
            console.error("Erro completo:", error);
            
            // Informações detalhadas do erro
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = error.credential;
            
            console.log("Código de erro:", errorCode);
            console.log("Mensagem de erro:", errorMessage);
            
            // Exibir mensagem de erro na interface
            const errorElement = document.getElementById('loginError');
            errorElement.textContent = 'Erro ao fazer login com Google: ' + errorMessage;
            errorElement.style.display = 'block';
        });
}

			// Adicionar esta função para lidar com o redirecionamento
			function checkRedirectResult() {
				auth.getRedirectResult()
					.then((result) => {
						if (result.user) {
							// Login bem-sucedido
							window.location.href = './index.html';
						}
					})
					.catch((error) => {
						const errorElement = document.getElementById('loginError');
						errorElement.textContent = 'Erro ao fazer login com Google: ' + JSON.stringify(error);
						errorElement.style.display = 'block';
						console.error('Erro completo:', error);
					});
			}

			// Chamar esta função quando a página carregar
			document.addEventListener('DOMContentLoaded', checkRedirectResult);
        
        // Recuperação de senha
        function sendPasswordResetEmail() {
            const email = document.getElementById('resetEmail').value;
            const errorElement = document.getElementById('resetError');
            const successElement = document.getElementById('resetSuccess');
            
            if (!email) {
                errorElement.textContent = 'Por favor, informe seu email.';
                errorElement.style.display = 'block';
                return;
            }
            
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    // Email enviado com sucesso
                    successElement.textContent = 'Email enviado com sucesso! Verifique sua caixa de entrada.';
                    successElement.style.display = 'block';
                })
                .catch((error) => {
                    // Tratar erros específicos
                    let errorMessage;
                    switch (error.code) {
                        case 'auth/invalid-email':
                            errorMessage = 'Email inválido.';
                            break;
                        case 'auth/user-not-found':
                            errorMessage = 'Não há usuário com este email.';
                            break;
                        default:
                            errorMessage = 'Erro ao enviar email: ' + error.message;
                    }
                    
                    errorElement.textContent = errorMessage;
                    errorElement.style.display = 'block';
                });
        }
        
        // Verificar se o usuário já está logado
        auth.onAuthStateChanged((user) => {
            if (user) {
                // Usuário já está logado, redirecionar para a página principal
                window.location.href = './index.html';
            }
        });
        
        // Verificar estado da autenticação quando a página carrega
window.addEventListener('DOMContentLoaded', () => {
    console.log("Verificando estado de autenticação");
    
    // Verificar se o usuário já está logado
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log("Usuário já está logado:", user.email);
            // Redirecionar para a página principal
            window.location.href = './index.html';
        } else {
            console.log("Usuário não está logado");
        }
    });
});
        
    </script>
</body>
</html>
