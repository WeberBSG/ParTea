
import { GoogleGenAI } from "@google/genai";
import { ParTeaPost } from "../types";

export const searchParties = async (
  lat: number,
  lng: number,
  query: string = "popular parties, nightclubs, or social events tonight"
): Promise<{ text: string; posts: ParTeaPost[] }> => {
  // Always use a named parameter and obtain the API key exclusively from process.env.API_KEY.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  // Maps grounding is only supported in Gemini 2.5 series models.
  // Using 'gemini-2.5-flash' which is the recommended 2.5 series model for this task.
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
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

  // Extracting text output from GenerateContentResponse using the .text property.
  const text = response.text || "";
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  // Parse the response to create mock-ish posts enriched with grounding data.
  // We manually iterate through groundingChunks as responseSchema is not allowed with googleMaps.
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
          latitude: lat + (Math.random() - 0.5) * 0.01,
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
