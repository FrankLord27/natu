import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import resend from "@/lib/email";
import { PasswordResetEmail } from "@/components/emails/PasswordResetEmail";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "El correo electrónico es requerido" },
        { status: 400 },
      );
    }

    // 1. Verificar si el usuario existe
    console.log("Searching for user:", email);
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("User not found:", email);
      // Por seguridad, no revelamos si el usuario existe o no
      // Devolvemos éxito simulado
      return NextResponse.json({ success: true });
    }

    console.log("User found:", user.id);

    // 2. Generar token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hora

    // 3. Guardar token en DB
    console.log("Updating user with token:", token);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });
    console.log("User updated");

    // 4. Enviar correo
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/restablecer-contrasena?token=${token}`;

    if (!resend) {
      console.warn("RESEND_API_KEY is not set. Email not sent.");
      return NextResponse.json({
        success: true,
        message: "Simulated success (no API key)",
      });
    }

    const { data, error } = await resend.emails.send({
      from: "NaturaJM <onboarding@resend.dev>", // Debemos usar un dominio verificado o el de pruebas de Resend
      to: [email],
      subject: "Restablece tu contraseña - NaturaJM",
      react: PasswordResetEmail({
        resetLink,
        userName: user.name || undefined,
      }),
    });

    if (error) {
      console.error("Error enviando email:", error);
      return NextResponse.json(
        { error: "Error al enviar el correo" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en forgot-password:", error);
    return NextResponse.json(
      { error: "Ocurrió un error inesperado" },
      { status: 500 },
    );
  }
}
