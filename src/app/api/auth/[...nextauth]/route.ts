import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("1. Intentando login con email:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Error: Falta email o contraseña en el formulario");
          return null;
        }

        // Buscamos al usuario en la base de datos
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          console.log("❌ Error: El usuario no existe en la base de datos");
          return null;
        }

        // FRENO DE SEGURIDAD PARA TYPESCRIPT: Evita el error 'null is not assignable to string'
        if (!user.password) {
          console.log("❌ Error: El usuario existe pero no tiene contraseña registrada.");
          return null;
        }

        console.log("2. Usuario encontrado en DB. Comprobando contraseña...");

        // Comparamos la contraseña cifrada
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          console.log("❌ Error: La contraseña NO coincide con el hash");
          return null;
        }

        console.log("✅ ÉXITO: Contraseña correcta. Permitiendo entrada.");
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };