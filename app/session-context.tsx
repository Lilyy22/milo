"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { getUserById } from "@/app/actions";

type SessionContextType = {
    session: Session | null
    loading: boolean
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSession();
            const userId = (session?.user as any)?.id;

            if (session && userId) {
                const userFromDB = await getUserById(userId);
                if (userFromDB) {
                    (session.user as any).role = userFromDB.role;
                }
            }

            setSession(session);
            setLoading(false);
        };

        fetchSession();
    }, []);

    return (
        <SessionContext.Provider value={{ session, loading }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSessionContext = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSessionContext must be used within a SessionProvider");
    }
    return context;
};
