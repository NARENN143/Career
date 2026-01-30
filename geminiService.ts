
import { GoogleGenAI, Type } from "@google/genai";
import { CareerProfile } from "./types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async (apiCall: Promise<any>) => {
  try {
    const response = await apiCall;
    return response;
  } catch (error: any) {
    // Log for debugging but keep UI-facing messages neutral
    if (error.message?.includes("429") || error.status === 429) {
      throw new ApiError(429, "Limit reached.");
    }
    throw error;
  }
};

export const suggestCareers = async (profile: Partial<CareerProfile>) => {
  const ai = getAI();
  const response = await handleResponse(ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on my background: ${JSON.stringify(profile)}, suggest 3 career paths. Explain why each fits.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["title", "explanation"]
        }
      }
    }
  }));
  return JSON.parse(response.text);
};

export const generateRoadmap = async (profile: CareerProfile) => {
  const ai = getAI();
  const response = await handleResponse(ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a detailed 4-level career roadmap (Beginner, Intermediate, Advanced, Job-Ready) for a ${profile.selectedCareer}. 
    User Profile: Status: ${profile.status}, Interests: ${profile.interests.join(',')}, Time: ${profile.availableHoursPerDay}h/day, Timeline: ${profile.timelineMonths} months.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['skill', 'project', 'theory'] }
                },
                required: ["id", "title", "description", "duration", "type"]
              }
            }
          },
          required: ["id", "title", "description", "tasks"]
        }
      }
    }
  }));
  return JSON.parse(response.text);
};

export const generateDailyNewsletter = async (profile: CareerProfile) => {
  const ai = getAI();
  const currentLevel = profile.roadmap?.[0]?.title || "Initial Stage";
  const response = await handleResponse(ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a daily career newsletter for a ${profile.selectedCareer} at the ${currentLevel} level. Include: focus area, industry trend, career tip, and a motivational quote.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING },
          learningFocus: { type: Type.STRING },
          industryTrend: { type: Type.STRING },
          careerTip: { type: Type.STRING },
          motivation: { type: Type.STRING }
        },
        required: ["date", "learningFocus", "industryTrend", "careerTip", "motivation"]
      }
    }
  }));
  return JSON.parse(response.text);
};

export const fetchOpportunities = async (career: string) => {
  const ai = getAI();
  const response = await handleResponse(ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `List 5 realistic current job/internship/hackathon opportunities for ${career}. For each, explain 'why it matches' a motivated learner.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            company: { type: Type.STRING },
            type: { type: Type.STRING },
            matchScore: { type: Type.NUMBER },
            location: { type: Type.STRING },
            whyMatch: { type: Type.STRING }
          }
        }
      }
    }
  }));
  return JSON.parse(response.text);
};

export const getMentorResponse = async (message: string, history: any[], profile: CareerProfile) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are the "ElevateAI Master Strategist," a world-class career development mentor. 
      Your mission is to guide ${profile.name} to become a top-tier ${profile.selectedCareer}.
      
      CAREER PRINCIPLES TO FOLLOW:
      1. CLARITY: Use structured formatting (numbered lists, bold headers, bullet points). Avoid fluff.
      2. ACTIONABILITY: Every piece of advice must end with a "Next Best Action."
      3. GROWTH PILLARS: When giving advice, categorize it into: 
         - [Hard Skills]: Specific roadmap tools/concepts.
         - [Soft Skills]: Communication, leadership, or problem-solving.
         - [Branding]: Portfolio, LinkedIn, and personal narrative.
         - [Networking]: How to meet the right people.
      
      USER CONTEXT:
      - Current Role: ${profile.status}
      - Interests: ${profile.interests.join(', ')}
      - Commitment: ${profile.availableHoursPerDay} hours/day.
      - Progress: ${profile.roadmap ? "User has an active roadmap generated." : "Roadmap pending."}
      
      TONE: Professional, visionary, confident, and relentlessly supportive.
      FORMATTING: Use bold text for key concepts. Use clear spacing between paragraphs.`,
    }
  });
  
  const result = await handleResponse(chat.sendMessage({ message }));
  return result.text;
};
