
import { GoogleGenAI, Type } from "@google/genai";
import { CarDetails, AIAnalysisResult, ClientDetails } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const licenseSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The full name of the person on the license." },
        address: { type: Type.STRING, description: "The full address on the license." },
    },
    required: ["name", "address"]
};

const damageSchema = {
    type: Type.OBJECT,
    properties: {
        damageType: { type: Type.STRING, description: "A brief, clear description of the primary damage (e.g., 'Front Bumper Dent', 'Driver-side door scratch')." },
        estimatedCost: { type: Type.STRING, description: "A realistic cost range for the repair in USD (e.g., '$300 - $500')." },
        estimatedTime: { type: Type.STRING, description: "An estimated time for the repair (e.g., '2-3 days', '5-7 hours')." },
        confidence: { type: Type.NUMBER, description: "A confidence score from 0 to 100 on the accuracy of the estimate." },
    },
    required: ["damageType", "estimatedCost", "estimatedTime", "confidence"]
};

const callGeminiWithSchema = async (prompt: string, base64Image: string, schema: object) => {
    try {
        const imagePart = { inlineData: { mimeType: 'image/jpeg', data: base64Image } };
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.1,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to process image with AI: ${error.message}`);
        }
        throw new Error("An unknown error occurred while contacting the AI service.");
    }
}


export const extractDetailsFromDriversLicense = async (base64Image: string): Promise<ClientDetails> => {
    const prompt = `Analyze the provided image of a driver's license. Extract the person's full name and their full address. Return the data in a structured JSON format.`;
    return callGeminiWithSchema(prompt, base64Image, licenseSchema);
};

export const analyzeDamage = async (base64Image: string): Promise<AIAnalysisResult> => {
    const prompt = `You are an expert car damage estimator. Analyze the provided image of a damaged vehicle. Provide a concise description of the damage, an estimated cost range for repair in USD, an estimated time for repair, and a confidence score for your estimate. Return the data in a structured JSON format.`;
    return callGeminiWithSchema(prompt, base64Image, damageSchema);
};
