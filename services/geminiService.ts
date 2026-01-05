import { GoogleGenAI, Type } from "@google/genai";
import { TrackAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeTrackImage = async (file: File): Promise<TrackAnalysis> => {
  try {
    const imagePart = await fileToGenerativePart(file);

    const prompt = `
      Analyze this image of an animal footprint/track. 
      Identify the animal most likely responsible for this track.
      Provide the common name, scientific name, a confidence level (High, Medium, Low), 
      list specific visual characteristics of the print (toes, claws, pad shape, gait if visible), 
      the typical habitat for this animal, a brief behavioral note related to movement, 
      and a safety tip if encountering this animal.
      
      Also identify a "habitatRegion" - a specific representative geographic region or major area where this animal is commonly found that would be suitable for a map search (e.g. "Rocky Mountains", "Everglades", "Siberia").
      
      If the image does not appear to be an animal track, return "Unknown" for the animal name, "Global" for habitatRegion, and explanation in characteristics.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [imagePart, { text: prompt }],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            animalName: { type: Type.STRING },
            scientificName: { type: Type.STRING },
            confidence: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
            characteristics: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            habitat: { type: Type.STRING },
            habitatRegion: { type: Type.STRING },
            behaviorNote: { type: Type.STRING },
            safetyTip: { type: Type.STRING },
          },
          required: ["animalName", "scientificName", "confidence", "characteristics", "habitat", "habitatRegion", "behaviorNote", "safetyTip"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as TrackAnalysis;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};