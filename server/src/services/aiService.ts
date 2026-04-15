import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateAnswer = async (context: string, question: string) => {
  const apiKey = process.env.GOOGLE_API_KEY;

  //console.log("KEY:", apiKey); // debug

  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not defined");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});

  const prompt = `
You are a document assistant.

Answer the question using ONLY the provided context.

Rules:
- Be concise (max 4-5 sentences)
- Only include relevant information
- Do NOT list everything unless asked
- Do NOT repeat unnecessary details
- If unsure, say: "I don't have enough information"

Context:
${context}

Question:
${question}

Answer:
`;
  //const result = await model.generateContent(prompt);
  //return result.response.text();
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err: any) {
      console.error(`Attempt ${i + 1} failed`);

      if (err.status === 404) {
        throw err; 
      }

      await new Promise((res) => setTimeout(res, 1000 * (i + 1)));
    }
  }

  throw new Error("AI service unavailable after retries");
};