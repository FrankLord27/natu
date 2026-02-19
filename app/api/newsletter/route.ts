import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json({ error: "Email required" }, { status: 400 });

    // Check if the email belongs to an existing User
    const user = await prisma.user.findUnique({ where: { email } });

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });
    if (existing) {
      if (!existing.isActive || (user && !existing.userId)) {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: {
            isActive: true,
            userId: user ? user.id : undefined,
          },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { isNewsletterSubscribed: true },
          });
        }
      }
      return NextResponse.json({ message: "Subscribed successfully" });
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email,
        userId: user ? user.id : undefined,
      },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isNewsletterSubscribed: true },
      });
    }

    return NextResponse.json(
      { message: "Subscribed successfully" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
