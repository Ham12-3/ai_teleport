import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const message =
    url.searchParams.get("message") || "Hello, this is an AI call.";

  // TwiML that plays the audio from our TTS endpoint
  const twiml = `
    <Response>
      <Play>${process.env.BASE_URL}/api/tts?text=${encodeURIComponent(
    message
  )}</Play>
    </Response>
  `;

  return new NextResponse(twiml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
