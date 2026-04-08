import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function predictRiskScore(userData: any, campaignResults: any[], trainingHistory: any[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Analyze the following employee data and predict their cybersecurity risk score (0-100, where 0 is safest and 100 is highest risk).
        
        Employee Info: ${JSON.stringify(userData)}
        Phishing Simulation Results: ${JSON.stringify(campaignResults)}
        Training Completion History: ${JSON.stringify(trainingHistory)}
        
        Provide a JSON response with:
        1. riskScore (number)
        2. reasoning (string)
        3. recommendations (string[])
      `,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return { riskScore: 50, reasoning: "Could not parse AI response", recommendations: [] };
  } catch (error) {
    console.error("AI Risk Prediction Error:", error);
    return { riskScore: 50, reasoning: "AI service unavailable", recommendations: [] };
  }
}
