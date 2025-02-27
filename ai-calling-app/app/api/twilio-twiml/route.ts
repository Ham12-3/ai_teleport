import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const message =
    url.searchParams.get("message") || "Hello, this is an AI call.";
  const callId = url.searchParams.get("callId") || Date.now().toString();

  // Use the TTS endpoint to get OpenAI-generated speech
  const twiml = `
    <Response>
      <Play>${process.env.BASE_URL}/api/tts?text=${encodeURIComponent(
    message
  )}&callId=${callId}</Play>
    </Response>
  `;

  return new NextResponse(twiml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
