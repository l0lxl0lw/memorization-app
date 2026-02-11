import { NextResponse } from "next/server";
import { listDocuments, createDocument } from "@/lib/documents";

export async function GET() {
  const documents = await listDocuments();
  return NextResponse.json(documents);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, text } = body;

  if (!title || !text) {
    return NextResponse.json({ error: "Title and text are required" }, { status: 400 });
  }

  const doc = await createDocument(title, text);
  return NextResponse.json(doc, { status: 201 });
}
