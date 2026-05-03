import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build",
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert AI study assistant for JEE. Summarize the provided notes concisely, highlighting key concepts, formulas, and definitions. Format in Markdown."
        },
        { role: "user", content: text }
      ],
      temperature: 0.5,
    });

    return NextResponse.json({ summary: completion.choices[0].message.content });
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
