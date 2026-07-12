import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  console.log("GEMINI_API_KEY is defined:", !!process.env.GEMINI_API_KEY);
  if (process.env.GEMINI_API_KEY) {
    console.log("Key length:", process.env.GEMINI_API_KEY.length);
  } else {
    console.log("All Env keys:", Object.keys(process.env).filter(k => k.toLowerCase().includes('key') || k.toLowerCase().includes('gemini')));
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || ''
  });

  try {
    console.log("Sending a tiny request to test connection...");
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Hello! Answer with one word."
    });
    console.log("Response:", response.text);
  } catch (error) {
    console.error("Gemini call failed:", error);
  }
}

main();
