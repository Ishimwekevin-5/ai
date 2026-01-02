
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { GroundingSource } from "../types";

export const createAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateChatResponse = async (
  message: string, 
  history: { role: 'user' | 'model', parts: { text: string }[] }[] = []
): Promise<{ text: string }> => {
  const ai = createAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are a world-class AI assistant. Provide concise, helpful, and accurate responses. Format with Markdown where appropriate.",
    }
  });

  const response = await chat.sendMessage({ message });
  return { text: response.text || '' };
};

export const generateWithGrounding = async (
  query: string
): Promise<{ text: string, sources: GroundingSource[] }> => {
  const ai = createAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || '';
  const sources: GroundingSource[] = [];
  
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    chunks.forEach((chunk: any) => {
      if (chunk.web) {
        sources.push({
          title: chunk.web.title || 'Untitled Source',
          uri: chunk.web.uri
        });
      }
    });
  }

  return { text, sources };
};

export const generateImage = async (prompt: string): Promise<string> => {
  const ai = createAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (part?.inlineData?.data) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  
  throw new Error("No image data received");
};
