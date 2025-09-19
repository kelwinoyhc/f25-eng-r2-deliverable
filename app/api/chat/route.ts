/* eslint-disable */
import { generateResponse } from "@/lib/services/species-chat";
import { NextResponse } from "next/server";

// TODO: Implement this file

export async function POST(req: Request) {
  try {
    // Validate JSON body
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const message = typeof body?.message === "string" ? body.message.trim() : "";
    if (!message) {
      return NextResponse.json({ error: "Missing 'message' (string)" }, { status: 400 });
    }

    const response = await generateResponse(message);
    return NextResponse.json({ response }, { status: 200 });
  } catch (e) {
    // error handel
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 502 }
    );
  }
}
