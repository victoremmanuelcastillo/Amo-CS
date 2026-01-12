import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta al archivo de sesión (formato Windows)
const sessionFile = 'C:\\Users\\Elpro\\.claude\\projects\\C--Users-Elpro-Proyectos-apih\\d755fe22-7cc9-4292-84a3-f663fcb6ad92.jsonl';
const outputFile = join(__dirname, 'CONVERSACION_COMPLETA.md');

// Leer archivo línea por línea
const lines = fs.readFileSync(sessionFile, 'utf-8').split('\n').filter(line => line.trim());

let markdown = '# Conversación Completa: Despliegue del Chat en Azure\n\n';
markdown += `**Fecha**: 11 de noviembre de 2025\n`;
markdown += `**Proyecto**: Chat GPT con Hugging Face desplegado en Azure\n\n`;
markdown += '---\n\n';

let messageCount = 0;

for (const line of lines) {
    try {
        const entry = JSON.parse(line);

        // Procesar mensajes del usuario
        if (entry.type === 'user' && entry.message?.role === 'user') {
            messageCount++;

            // Verificar si el contenido es string o array
            if (typeof entry.message.content === 'string') {
                markdown += `## Usuario [${messageCount}]\n\n`;
                markdown += `${entry.message.content}\n\n`;
                markdown += '---\n\n';
            } else if (Array.isArray(entry.message.content)) {
                // Procesar resultados de herramientas
                const toolResults = entry.message.content.filter(item => item.type === 'tool_result');
                if (toolResults.length > 0 && toolResults[0].content && !toolResults[0].content.includes('tool_use_id')) {
                    // Solo mostrar resultados significativos
                    const content = toolResults[0].content;
                    if (content.length < 500) {
                        markdown += `<details>\n<summary>📄 Resultado de herramienta</summary>\n\n\`\`\`\n${content}\n\`\`\`\n\n</details>\n\n`;
                    }
                }
            }
        }

        // Procesar mensajes del asistente
        if (entry.type === 'assistant' && entry.message?.role === 'assistant') {
            const content = entry.message.content;

            if (Array.isArray(content)) {
                for (const item of content) {
                    // Mostrar texto del asistente
                    if (item.type === 'text') {
                        markdown += `## Claude [${messageCount}]\n\n`;
                        markdown += `${item.text}\n\n`;
                    }

                    // Mostrar pensamiento (thinking)
                    if (item.type === 'thinking' && item.thinking) {
                        markdown += `<details>\n<summary>💭 Pensamiento interno de Claude</summary>\n\n`;
                        markdown += `*${item.thinking}*\n\n`;
                        markdown += `</details>\n\n`;
                    }

                    // Mostrar uso de herramientas
                    if (item.type === 'tool_use') {
                        markdown += `<details>\n<summary>🔧 Herramienta: ${item.name}</summary>\n\n`;
                        markdown += `\`\`\`json\n${JSON.stringify(item.input, null, 2)}\n\`\`\`\n\n`;
                        markdown += `</details>\n\n`;
                    }
                }
                markdown += '---\n\n';
            }
        }

    } catch (err) {
        // Ignorar líneas que no se pueden parsear
        continue;
    }
}

markdown += '\n\n## Fin de la Conversación\n\n';
markdown += `Total de intercambios: ${messageCount}\n`;

// Escribir el archivo markdown
fs.writeFileSync(outputFile, markdown, 'utf-8');

console.log(`✅ Conversación convertida exitosamente a: ${outputFile}`);
console.log(`📊 Total de mensajes procesados: ${messageCount}`);
