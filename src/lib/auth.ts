import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { dbConnection } from "./mongodbConnection";
import User from "@/models/usermodel";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email or Password does not exist");
        }

        await dbConnection();
        const isUser = await User.findOne({ email: credentials.email });
        if (!isUser) throw new Error("Email or Password is Incorrect");

        const isVerified = await bcrypt.compare(credentials.password, isUser.password);
        if (!isVerified) throw new Error("Email or Password is Incorrect");

        return {
          id: isUser._id.toString(),
          email: isUser.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      try {
        if (user) {
          // For credentials provider
          token.id = user.id;

          // For Google provider
          if (account?.provider === "google") {
            await dbConnection();
            const dbUser = await User.findOne({ email: user.email });

            if (dbUser) {
              token.id = dbUser._id.toString();
            } else {
              // Optional: store more info like name, image
              const newUser = await User.create({ email: user.email,username: user.name?.replace(/\s+/g, '').toLowerCase() });
              token.id = newUser._id.toString();
            }
          }
        }
      } catch (err) {
        console.error("JWT Callback Error:", err);
      }

      return token;
    },

    async session({ token, session }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    // You can customize these if needed
    // signIn: '/auth/signin',
    // error: '/auth/error'
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.JWT_SECRET!,
};
