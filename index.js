import { OpenAI } from "openai";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HF_TOKEN,
});

async function main() {
    try {
        const chatCompletion = await client.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "user",
                    content: "cual es el clima de mexico, durango mexico?",
                },
            ],
        });

        console.log("Respuesta del modelo:");
        console.log(chatCompletion.choices[0].message);
    } catch (error) {
        console.error("Error al llamar al modelo:", error.message);
        if (error.response) {
            console.error("Detalles:", error.response.data);
        }
    }
}

main();
