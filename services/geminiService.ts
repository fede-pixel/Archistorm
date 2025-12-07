import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const detectPhotoBounds = async (base64Image: string): Promise<{ymin: number, xmin: number, ymax: number, xmax: number}> => {
  const cleanBase64 = base64Image.split(',')[1] || base64Image;
  
  const prompt = `
    Analizza questo screenshot preso da un telefono (es. Instagram, Pinterest).
    Identifica il riquadro di ritaglio (bounding box) che contiene SOLO la foto dell'architettura/interior design.
    ESCLUDI: barre di stato del telefono, intestazioni dell'app, icone, barre di navigazione in basso, commenti e didascalie dell'app.
    Voglio solo l'immagine pulita.
    Restituisci le coordinate normalizzate (0-1).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ymin: { type: Type.NUMBER, description: "Top coordinate (0-1)" },
            xmin: { type: Type.NUMBER, description: "Left coordinate (0-1)" },
            ymax: { type: Type.NUMBER, description: "Bottom coordinate (0-1)" },
            xmax: { type: Type.NUMBER, description: "Right coordinate (0-1)" }
          },
          required: ["ymin", "xmin", "ymax", "xmax"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response for bounding box");
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Bounds Detection Error:", error);
    throw error;
  }
};

export const analyzeImageForArchitect = async (
  base64Image: string,
  userCaption: string
): Promise<AIAnalysis> => {
  
  const systemInstruction = `
    Sei un architetto senior di fama mondiale e consulente di design.
    Il tuo compito è analizzare le foto fornite dai clienti per le ristrutturazioni o i nuovi progetti.
    
    Analizza l'immagine e la nota del cliente. Fornisci un output strutturato in JSON.
    Usa un tono professionale, evocativo ma tecnico.
    La lingua deve essere ITALIANO.
  `;

  const prompt = `
    Analizza questa immagine.
    Nota del cliente: "${userCaption}"
    
    1. Fornisci una "technicalDescription" (max 60 parole): Descrivi lo stile attuale, i materiali visibili, la luce e il potenziale spaziale. Usa termini architettonici corretti.
    2. Fornisci 3 "brainstormingQuestions" stimolanti da porre all'architetto durante il meeting per esplorare le potenzialità dello spazio (es. flusso, materiali, luce, vincoli strutturali).
  `;

  try {
    // Clean base64 string if it contains metadata header
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming jpeg/png for simplicity, Gemini handles standard formats
              data: cleanBase64
            }
          },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            technicalDescription: { type: Type.STRING },
            brainstormingQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["technicalDescription", "brainstormingQuestions"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAnalysis;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};