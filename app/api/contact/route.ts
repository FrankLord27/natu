import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 },
      );
    }

    // Check if the email belongs to an existing User
    const user = await prisma.user.findUnique({ where: { email } });

    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        message,
        userId: user ? user.id : undefined,
      },
    });
    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { submittedAt: "desc" },
    });
    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
