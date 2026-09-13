import configService from '@purse/common/config';
import Groq from "groq-sdk";

export const groq = new Groq({ apiKey: configService.GROQ_CONFIG.GROQ_API_KEY });
