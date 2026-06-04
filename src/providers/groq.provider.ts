import configService from "@/config/config";
import Groq from "groq-sdk";

export const groq = new Groq({ apiKey: configService.GROQ_API_KEY });