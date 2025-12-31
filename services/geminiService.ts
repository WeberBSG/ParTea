
import { GoogleGenAI } from "@google/genai";
import { ParTeaPost } from "../types";

const API_KEY = process.env.API_KEY || "";

export const searchParties = async (
  lat: number,
  lng: number,
  query: string = "popular parties, nightclubs, or social events tonight"
): Promise<{ text: string; posts: ParTeaPost[] }> => {
  if (!API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Maps grounding is only supported in Gemini 2.5 series models
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-latest",
    contents: `Find ${query} near latitude ${lat}, longitude ${lng}. 
    Please list the events. For each event, provide:
    1. Title
    2. A brief description
    3. Location name
    4. Approximate coordinates if possible.
    
    Make it conversational but distinct for each entry.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng
          }
        }
      }
    },
  });

  const text = response.text;
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  // Parse the response to create mock-ish posts enriched with grounding data
  // Since we can't use responseSchema with googleMaps, we manually parse or map grounding results
  const posts: ParTeaPost[] = groundingChunks
    .filter((chunk: any) => chunk.maps)
    .map((chunk: any, index: number) => {
      const mapInfo = chunk.maps;
      return {
        id: `gemini-${index}`,
        title: mapInfo.title || "Party Event",
        description: `Join us at ${mapInfo.title}! Check out the details on Google Maps.`,
        location: {
          name: mapInfo.title,
          latitude: lat + (Math.random() - 0.5) * 0.01, // Approximate since chunks don't always give precise lat/lng directly
          longitude: lng + (Math.random() - 0.5) * 0.01,
          uri: mapInfo.uri
        },
        photoUrl: `https://picsum.photos/seed/${index + 400}/1080/1920`,
        username: "GoogleMapsExplorer",
        timestamp: Date.now()
      };
    });

  return { text, posts };
};
