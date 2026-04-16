import { GoogleGenerativeAI } from '@google/generative-ai';
import { Readable } from 'stream';

export const ContentBlockType = {
    Text: 'text',
    Image: 'image',
};

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const stream = async ({ userId, systemPrompt, userMessage }) => {
    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: systemPrompt,
    });

    const parts = userMessage.map((block) => {
        if (block.type === ContentBlockType.Image) {
            return { text: `[Image: ${block.image}]` };
        }
        return { text: block.text };
    });

    const readable = new Readable({ read() {} });

    (async () => {
        try {
            const result = await model.generateContentStream(parts);
            for await (const chunk of result.stream) {
                const text = chunk.text();
                if (text) {
                    readable.push(`data: ${JSON.stringify({ text })}\n\n`);
                }
            }
            readable.push(`data: [DONE]\n\n`);
            readable.push(null);
        } catch (err) {
            readable.destroy(err);
        }
    })();

    return readable;
};

export const uploadImagesToPocketBase = async ({ images }) => {
    return [];
};