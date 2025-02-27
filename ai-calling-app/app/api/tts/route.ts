import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const text = url.searchParams.get("text");
    const callId = url.searchParams.get("callId");

    if (!text || !callId) {
      return NextResponse.json(
        { error: "Text and callId are required" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Generate speech using OpenAI's TTS API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", // onyx, alloy, echo, fable, nova, shimmer
      input: text,
    });

    // Convert to ArrayBuffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.byteLength.toString(),
      },
    });
  } catch (error: any) {
    console.error("TTS Error:", error);
    return NextResponse.json(
      { error: error.message || "Error generating speech" },
      { status: 500 }
    );
  }
}
