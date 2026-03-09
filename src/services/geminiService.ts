import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface OutfitRecommendation {
  name: string;
  description: string;
  imageSearchKeyword: string;
  shoppingUrl: string;
}

export interface RecommendationResponse {
  occasion: string;
  gender: string;
  recommendations: OutfitRecommendation[];
}

export async function getFashionRecommendations(occasion: string, gender: string): Promise<RecommendationResponse> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Suggest 4-5 fashion outfits for a ${gender} to wear for the occasion: "${occasion}". 
    For each outfit, provide:
    1. A catchy name.
    2. A brief description of why it's suitable.
    3. A specific image search keyword that would yield a high-quality fashion photo of this outfit.
    4. A realistic shopping search URL (e.g., Google Shopping or a major fashion retailer search link).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          occasion: { type: Type.STRING },
          gender: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                imageSearchKeyword: { type: Type.STRING },
                shoppingUrl: { type: Type.STRING },
              },
              required: ["name", "description", "imageSearchKeyword", "shoppingUrl"],
            },
          },
        },
        required: ["occasion", "gender", "recommendations"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Could not get recommendations. Please try again.");
  }
}
