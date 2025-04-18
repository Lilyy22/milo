import { prisma } from "@/lib/prisma";
import { session } from "@/lib/session";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export const authOption: NextAuthOptions = {
    session  : {
        strategy: "jwt"
    },
    providers: [
        GoogleProvider({
            clientId    : GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (!profile?.email) {
                throw new Error("No profile");
            }

            await prisma.user.upsert({
                where : {
                    email: profile.email
                },
                create: {
                    email: profile.email,
                    name : profile.name
                },
                update: {
                    name: profile.name
                }
            });
            return true;
        },
        session,
        async jwt({ token, user, account, profile }) {
            // Find the user in the database
            if (profile) {
                const user = await prisma.user.findUnique({
                    where: {
                        email: profile.email
                    }
                });
              console.log("==fff== user ==> ", user);
                if (!user) {
                    throw new Error("No user found");
                }
                // Add the user ID and role to the token
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        }
    }
};
