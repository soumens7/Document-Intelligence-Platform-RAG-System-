
export const embedText = async (text: string): Promise<number[]> => {
    // simple mock (Gemini embedding API not stable everywhere)
    return text.split("").map(c => c.charCodeAt(0) / 255);
  };
