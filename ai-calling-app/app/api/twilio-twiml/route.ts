import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const message =
    url.searchParams.get("message") || "Hello, this is an AI call.";

  const twiml = `
    <Response>
      <Say voice="Polly.Amy" language="en-GB">${message}</Say>
      <Pause length="1"/>
      <Say voice="Polly.Amy" language="en-GB">Thank you for listening. Goodbye.</Say>
    </Response>
  `;

  return new NextResponse(twiml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
