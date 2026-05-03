import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build",
});

export async function POST(req: Request) {
  try {
    const { topic, difficulty, count } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert AI study assistant for JEE. Generate practice MCQs. Return ONLY a pure JSON array of objects. Each object must have 'q' (string), 'options' (array of exactly 4 strings), 'correct' (integer 0-3 representing the index of the correct option), and 'explanation' (string). No markdown blocks around the JSON."
        },
        { 
          role: "user", 
          content: `Topic: ${topic}\nDifficulty: ${difficulty}\nNumber of questions: ${count}` 
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || "[]";
    const mcqs = JSON.parse(content);

    return NextResponse.json({ mcqs });
  } catch (error: any) {
    console.error("OpenAI MCQ Error:", error);
    return NextResponse.json({ error: "Failed to generate MCQs" }, { status: 500 });
  }
}
