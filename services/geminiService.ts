
import { GoogleGenAI } from "@google/genai";
import { Queue } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIInsights = async (queue: Queue, userPosition: number) => {
  const prompt = `
    Context: A user is in a virtual queue.
    Queue Name: ${queue.name}
    Queue Category: ${queue.category}
    Current Serving: ${queue.currentlyServing}
    Total People in Queue: ${queue.totalTokens}
    User's Position: ${userPosition}
    Avg Wait Time per Person: ${queue.avgWaitPerPerson} minutes

    Task: Provide a very brief (2 sentences max) smart insight for the user. 
    Mention whether it's a good time to go grab a coffee or if they should head over now.
    Estimate their total wait time based on math but add a human "AI prediction" touch.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Unable to get AI insights at the moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The system is busy, but we estimate you have about " + (userPosition - queue.currentlyServing) * queue.avgWaitPerPerson + " minutes left.";
  }
};
