// Elementos del DOM
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');
const sendBtn = document.getElementById('send-btn');
const btnText = document.getElementById('btn-text');
const btnLoading = document.getElementById('btn-loading');

// Historial de mensajes
let messageHistory = [];

// API URL Azure
const API_URL = window.location.origin;

// Agregar mensaje al chat
function addMessage(content, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    const sender = document.createElement('strong');
    sender.textContent = isUser ? 'Tú:' : 'Asistente:';

    const text = document.createElement('p');
    text.textContent = content;

    messageContent.appendChild(sender);
    messageContent.appendChild(text);
    messageDiv.appendChild(messageContent);

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Cambiar estado del botón
function setLoading(isLoading) {
    sendBtn.disabled = isLoading;
    userInput.disabled = isLoading;

    if (isLoading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
    } else {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

// Enviar mensaje
async function sendMessage(message) {
    try {
        setLoading(true);

        const response = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                history: messageHistory
            }),
        });

        const data = await response.json();

        if (data.success) {
            messageHistory.push({
                role: 'user',
                content: message
            });
            messageHistory.push({
                role: 'assistant',
                content: data.response
            });
            addMessage(data.response, false);
        } else {
            throw new Error(data.error || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage(`Error: ${error.message}. Por favor intenta de nuevo.`, false);
    } finally {
        setLoading(false);
    }
}

// Manejar envío del formulario
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const message = userInput.value.trim();

    if (!message) return;

    // Mostrar mensaje del usuario
    addMessage(message, true);

    // Limpiar input
    userInput.value = '';

    // Enviar mensaje a la API
    await sendMessage(message);
});

// Autoenfoque en el input
userInput.focus();

// Verificar conexión con el servidor
async function checkServerHealth() {
    try {
        const response = await fetch(`${API_URL}/api/health`);
        const data = await response.json();
        console.log('Servidor conectado:', data);
    } catch (error) {
        console.error('Error de conexión con el servidor:', error);
    }
}

checkServerHealth();
