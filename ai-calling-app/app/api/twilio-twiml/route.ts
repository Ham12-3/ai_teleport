import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const message =
    url.searchParams.get("message") || "Hello, this is an AI call.";

  // TwiML with proper XML declaration
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Say>
Hello Munashe how are you?

</Say>
 
</Response>`;

  return new NextResponse(twiml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

// <Play>${process.env.BASE_URL}/api/tts?text=${encodeURIComponent(
//     message
//   )}</Play>
