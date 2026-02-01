
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAnalysisResult } from '../types';

export const analyzeThreat = async (domain: string, category: string): Promise<GeminiAnalysisResult> => {
  // Check for API key existence quietly without prompting the user to provide it
  if (!process.env.API_KEY) {
    return {
      threatLevel: "Unknown",
      explanation: "AI Service is currently unavailable in this environment.",
      recommendation: "System configuration error."
    };
  }

  try {
    // Create instance right before use to ensure latest config
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Analyze the network security risk for the following domain: "${domain}" which is categorized as "${category}".
      Explain if this domain is typically associated with intrusive ads, tracking, or malware.
      Provide a brief recommendation.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            threatLevel: { type: Type.STRING, description: "High, Medium, or Low" },
            explanation: { type: Type.STRING, description: "A short 1-2 sentence explanation." },
            recommendation: { type: Type.STRING, description: "Action to take (Block/Allow)." }
          },
          required: ["threatLevel", "explanation", "recommendation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as GeminiAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      threatLevel: "Error",
      explanation: "Failed to connect to AI Sentinel.",
      recommendation: "Retry later."
    };
  }
};
