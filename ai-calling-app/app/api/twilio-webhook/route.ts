import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Parse the form data from Twilio
  const formData = await req.formData();

  // Create a TwiML response
  const twiml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say>Thank you for calling. This is an automated message from our AI system.</Say>
    </Response>
  `;

  // Return TwiML response
  return new NextResponse(twiml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
