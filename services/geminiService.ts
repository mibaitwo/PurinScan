import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, PurineLevel, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert nutritionist and medical advisor specializing in gout and hyperuricemia management. 
Your task is to analyze images of food and provide a detailed assessment of their purine content and risk for gout patients.

Rules:
1. Identify the food item(s) in the image.
2. Estimate the purine content (mg per 100g).
3. Classify the risk level:
   - Low: < 50mg/100g (Safe)
   - Moderate: 50-150mg/100g (Limit)
   - High: > 150mg/100g (Avoid)
4. Provide a clear recommendation.
5. If the image is not food, return "Unknown" for all fields and explain in the reasoning.
`;

export const analyzeFoodImage = async (base64Image: string, mimeType: string, lang: Language): Promise<AnalysisResult> => {
  const languagePrompt = lang === 'zh' ? "Chinese (Simplified)" : "English";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: `Analyze this food image for a gout patient. Identify the food and estimate purine levels. Provide all textual content in the JSON response in ${languagePrompt}.`,
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING },
            purineLevel: { 
              type: Type.STRING, 
              enum: [PurineLevel.LOW, PurineLevel.MODERATE, PurineLevel.HIGH, PurineLevel.UNKNOWN] 
            },
            estimatedPurineContent: { type: Type.STRING },
            calories: { type: Type.STRING },
            riskAssessment: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            alternatives: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["foodName", "purineLevel", "estimatedPurineContent", "riskAssessment", "recommendation"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(text) as AnalysisResult;
    return result;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};
