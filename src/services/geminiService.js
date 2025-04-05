import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyA_rF9TDZruVbZC-XtQS71LAfphQLE6i7o";
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateAISuggestions = async (issues) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are a customer service AI assistant. Based on the following issues, provide 2-3 actionable suggestions. Make the suggestions specific, practical, and immediately implementable:

    Issues:
    ${issues.map(issue => `- ${issue.title}: ${issue.description}`).join('\n')}
    
    Please provide your response in this exact JSON format:
    {
      "suggestions": [
        {
          "title": "Specific action title",
          "description": "Detailed step-by-step suggestion with specific numbers or metrics where applicable",
          "priority": "High/Medium/Low",
          "impact": "Immediate/Short-term/Long-term"
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const suggestions = JSON.parse(text);
    return suggestions.suggestions || [];
  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    // Return default suggestions if API fails
    return [
      {
        title: "Increase Staff Deployment",
        description: "Deploy 2-3 additional staff members at the main entrance to handle the increased traffic and reduce wait times.",
        priority: "High",
        impact: "Immediate"
      },
      {
        title: "Technical Support Check",
        description: "Conduct an immediate sound system check in Hall A and prepare backup equipment to prevent further audio issues.",
        priority: "High",
        impact: "Immediate"
      }
    ];
  }
};

export const analyzeSentiment = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Analyze the sentiment of the following text and provide a sentiment score (positive, neutral, or negative):
    "${text}"
    
    Please respond with a JSON object in this format:
    {
      "sentiment": "positive/neutral/negative",
      "confidence": 0.0-1.0,
      "keyPoints": ["point1", "point2", "point3"]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = JSON.parse(response.text());
    
    return analysis;
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return {
      sentiment: "neutral",
      confidence: 0.5,
      keyPoints: []
    };
  }
}; 