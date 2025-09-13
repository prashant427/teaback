import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserModel } from "@/models/user";
import bcrypt from "bcryptjs";
import {dbConnect} from "@/lib/dbconfig";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id:"credentials",

            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Enter your email" },
                password: { label: "Password", type: "password", placeholder: "Enter your password" }
            },
            async authorize(credentials): Promise<any> {
                await dbConnect();

                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Email and password are required");
                    }
    
                    const user = await UserModel.findOne({ $or:[
                        { email: credentials.email },
                        { username: credentials.email }
                    ] });
    
                    if (!user) {
                        throw new Error("No user found with the provided email");
                    }
    
                    if (!user.isVerified) {
                        throw new Error("Please verify your email before logging in");
                    }
    
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    
                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }
    
                    return user;
                } catch (error) {
                    console.error("Error authorizing user:", error);
                    throw new Error("Failed to authorize user: " + error);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user._id ;
                token.isVerified = user.isVerified;
                token.isAcceptMsg = user.isAcceptMsg;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptMsg = token.isAcceptMsg;
                session.user.username = token.username;
            }
            return session;
        }
    },
    pages:{
        signIn:"/login"
    },
    session:{
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60 // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
}