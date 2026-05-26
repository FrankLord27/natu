import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

/**
 * Configuración de NextAuth con dos proveedores:
 * 1. Admin - Para usuarios administrativos (AdminUser table)
 * 2. Customer - Para clientes (User table)
 */
export const authOptions: NextAuthOptions = {
  providers: [
    /**
     * Proveedor para ADMINISTRADORES
     */
    CredentialsProvider({
      id: "admin",
      name: "Admin Credentials",
      credentials: {
        email: { label: "Correo Electrónico", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.adminUser.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          userType: "admin", // Marcador para diferenciar en callbacks
        };
      },
    }),

    /**
     * Proveedor para CLIENTES
     */
    CredentialsProvider({
      id: "customer",
      name: "Customer Credentials",
      credentials: {
        email: { label: "Correo Electrónico", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales faltantes");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );

        if (!isPasswordValid) {
          throw new Error("Contraseña incorrecta");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: "customer",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.userType = (user as any).userType;
        // Solo los admins tienen rol
        if ((user as any).role) {
          token.role = (user as any).role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).userType = token.userType;
        if (token.role) {
          (session.user as any).role = token.role;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Login por defecto para customers
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
