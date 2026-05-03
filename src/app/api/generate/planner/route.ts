import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build",
});

export async function POST(req: Request) {
  try {
    const { examDate, focusArea, hours } = await req.json();

    if (!examDate) {
      return NextResponse.json({ error: "Exam date is required" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert AI study planner. Return ONLY a JSON array of objects representing today's study tasks. Each object must have 'sub' (string, e.g. Physics), 'topic' (string), 'dur' (string, e.g. '2.5h'), 'timeClass' (string, one of 'text-primary border-primary', 'text-secondary border-secondary', 'text-success border-success'), 'desc' (string), and 'done' (boolean set to false). Max 4 tasks."
        },
        { 
          role: "user", 
          content: `Exam Date: ${examDate}\nFocus Area: ${focusArea || 'General Revision'}\nDaily Hours: ${hours}` 
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || "[]";
    const tasks = JSON.parse(content);

    return NextResponse.json({ tasks });
  } catch (error: any) {
    console.error("OpenAI Planner Error:", error);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}
