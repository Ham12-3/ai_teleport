import { NextResponse } from "next/server";
import twilio from "twilio";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// Ensure Twilio credentials are defined
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  throw new Error("Twilio credentials are not defined");
}

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to validate E.164 phone number format
function isValidE164(phoneNumber: string): boolean {
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phoneNumber);
}

export async function POST(req: Request) {
  try {
    const { phoneNumber, context } = await req.json();

    console.log(
      "Received phoneNumber:",
      phoneNumber,
      "Type:",
      typeof phoneNumber
    );

    if (!phoneNumber || !context) {
      return NextResponse.json(
        { error: "Phone number and context are required" },
        { status: 400 }
      );
    }

    // Validate phone number format
    if (!isValidE164(phoneNumber)) {
      return NextResponse.json(
        {
          error:
            "Invalid phone number format. Please provide a number in E.164 format (e.g., +12345678900)",
          receivedType: typeof phoneNumber,
          receivedValue: phoneNumber,
        },
        { status: 400 }
      );
    }

    // Generate AI text response from OpenAI
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI making a phone call on behalf of the user.",
        },
        { role: "user", content: context },
      ],
    });

    const aiMessage =
      gptResponse.choices[0].message?.content ||
      "Hello, how can I assist you today?";

    // Generate a unique ID for this call
    const callId = Date.now().toString();

    // Make the call using Twilio - pass the callId to the TwiML endpoint
    const call = await twilioClient.calls.create({
      url: `${
        process.env.BASE_URL
      }/api/twilio-twiml?message=${encodeURIComponent(
        aiMessage
      )}&callId=${callId}`,
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER!,
    });

    return NextResponse.json({
      message: "Call initiated",
      callSid: call.sid,
    });
  } catch (error: any) {
    console.error("Error:", error);

    // Check for the specific Twilio error code
    if (error.code === 21219) {
      return NextResponse.json(
        {
          error:
            "The number you're trying to call is not verified. With a trial account, you need to verify all destination numbers in the Twilio console first.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
