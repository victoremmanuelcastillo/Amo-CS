// server.js
import express from 'express';
import bodyParser from 'body-parser';
import { HfInference } from '@huggingface/inference';
import { WebSocketServer } from 'ws';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuración Inicial ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HF_ACCESS_TOKEN = process.env.HUGGING_FACE_API_TOKEN; 

if (!HF_ACCESS_TOKEN) {
    console.error("❌ Error: La variable de entorno HUGGING_FACE_API_TOKEN no está definida.");
    process.exit(1);
}

// Inicialización de Hugging Face Inference
const hf = new HfInference(HF_ACCESS_TOKEN);

const app = express();
const PORT = 3000;
const MODEL_ID = 'mistralai/Mistral-7B-Instruct-v0.3';
const SIMPLE_SECRET_KEY = 'SecretoIA2025';

// Almacenamiento y Concurrencia
const wsClients = new Set();
let requestCounter = 0; 

// --- Middlewares y Seguridad ---
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

// Middleware de Seguridad Simple (Autenticación)
const simpleAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader !== `Bearer ${SIMPLE_SECRET_KEY}`) {
        return res.status(401).json({
            error: 'AUTH_ERROR',
            message: 'Acceso no autorizado. Token Bearer incorrecto.'
        });
    }
    next();
};

// --- Endpoint RMI: /api/v1/chat ---
app.post('/api/v1/chat', simpleAuth, async (req, res) => {
    const requestId = ++requestCounter;
    console.log(`[ID ${requestId}] ✉️ Solicitud RMI recibida.`);

    const { prompt, wsClientId } = req.body;

    if (!prompt) {
        return res.status(400).json({
            error: 'INVALID_ARGUMENT',
            message: 'El campo "prompt" es obligatorio.'
        });
    }

    // Respuesta Rápida de aceptación (RPC)
    res.json({
        status: 'accepted',
        requestId: requestId,
        message: 'Procesando solicitud. Esperando respuesta vía WebSocket.'
    });
    
    // --- Lógica Asíncrona del Chatbot (Usando chatCompletion con Mistral) ---
    try {
        const result = await hf.chatCompletion({
            model: MODEL_ID,
            messages: [
                { role: "user", content: prompt }
            ],
            max_tokens: 256,
            temperature: 0.7
        });

        // La respuesta de chatCompletion está en choices[0].message.content
        const generatedText = result.choices[0].message.content.trim();
        console.log(`[ID ${requestId}] ✅ Respuesta generada.`);

        // --- Callback por WebSocket ---
        const client = Array.from(wsClients).find(c => c.id === wsClientId);
        if (client) {
            const callbackData = JSON.stringify({
                type: 'CALLBACK_CHAT_SUCCESS',
                requestId,
                data: generatedText
            });
            client.send(callbackData);
            console.log(`[ID ${requestId}] 📡 Callback enviado a WS ID: ${wsClientId}`);
        }

    } catch (error) {
        console.error(`[ID ${requestId}] ❌ Error al llamar a la IA:`, error.message);
        
        // Manejo de Error Remoto para Callback
        const client = Array.from(wsClients).find(c => c.id === wsClientId);
         if (client) {
            const errorCallbackData = JSON.stringify({
                type: 'CALLBACK_CHAT_ERROR',
                requestId,
                message: `Error al procesar la IA: ${error.message.substring(0, 100)}...`
            });
            client.send(errorCallbackData);
        }
    }
});

// --- Configuración de WebSocket ---
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    ws.id = Math.random().toString(36).substring(2, 9);
    wsClients.add(ws);
    ws.send(JSON.stringify({ type: 'WS_ID_ASSIGNED', id: ws.id }));

    ws.on('close', () => wsClients.delete(ws));
    ws.on('error', (error) => console.error(`❌ Error en WS ${ws.id}:`, error.message));
});

// --- Inicialización del Servidor ---
server.listen(PORT, () => {
    console.log(`\n🎉 Chatbot RMI listo! Accede a http://localhost:${PORT}`);
    console.log(`🌐 Modelo: ${MODEL_ID}`);
});