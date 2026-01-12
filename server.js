import express from "express";
import cors from "cors";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Configuración para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Cliente de OpenAI configurado para Hugging Face
const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HF_TOKEN,
});

// Endpoint principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Endpoint para el chat
app.post("/api/chat", async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: "El mensaje es requerido" });
        }

        // Construir mensajes con historial
        const messages = [
            ...history,
            {
                role: "user",
                content: message,
            },
        ];

        console.log(`[${new Date().toISOString()}] Nuevo mensaje:`, message);

        // Llamar al modelo
        const chatCompletion = await client.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: messages,
            max_tokens: 500,
        });

        const response = chatCompletion.choices[0].message;
        console.log(`[${new Date().toISOString()}] Respuesta generada`);

        res.json({
            success: true,
            response: response.content,
            role: response.role,
        });
    } catch (error) {
        console.error("Error al llamar al modelo:", error.message);
        res.status(500).json({
            success: false,
            error: "Error al procesar el mensaje",
            details: error.message,
        });
    }
});

// Endpoint de salud
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`\n🚀 Servidor iniciado en http://localhost:${PORT}`);
    console.log(`📝 API disponible en http://localhost:${PORT}/api/chat`);
    console.log(`💬 Chat web en http://localhost:${PORT}\n`);
});
