import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/auth/register
 * Registra un nuevo cliente (User)
 */
export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json();

    // Validaciones
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nombre, email y contraseña son obligatorios' },
        { status: 400 }
      );
    }

    // Verificar si el email ya está registrado
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este correo electrónico ya está registrado' },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone: phone || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user,
    });
  } catch (error: any) {
    console.error('Detailed Registration Error:', {
      message: error.message,
      stack: error.stack,
      error
    });
    return NextResponse.json(
      { error: 'Error al registrar usuario', details: error.message },
      { status: 500 }
    );
  }
}
