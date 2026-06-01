import configService from "@/config/config";
import { GoogleGenAI } from "@google/genai";

export const gemini = new GoogleGenAI({ apiKey: configService.GEMINI_API_KEY });