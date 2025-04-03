import "./css/style.css";
import { Inter } from "next/font/google";
import Theme from "./theme-provider";
import AppProvider from "./app-provider";
import { SessionProvider } from "./session-context";
import SessionWrapper from "@/components/session-wrapper";
import { NotificationProvider } from "./notifications-context";
import NotificationContainer from "@/components/notification-container";
import { Toaster } from "sonner";

const inter = Inter({
    subsets : ["latin"],
    variable: "--font-inter",
    display : "swap"
});

export const metadata = {
    title      : "Reputation Rhino",
    description: "AI generation app",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
    return (
        <SessionWrapper>
            <html lang="en" suppressHydrationWarning>
                {/* suppressHydrationWarning: https://github.com/vercel/next.js/issues/44343 */}
                <body className={`${inter.variable} font-inter antialiased bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400`}>
                    <SessionProvider>
                        <Theme>
                            <NotificationProvider>
                                <AppProvider>{children}</AppProvider>
                                <NotificationContainer/>
                                <Toaster expand={false} richColors position="bottom-right" closeButton />
                                </NotificationProvider>
                        </Theme>
                    </SessionProvider>
                </body>
            </html>
        </SessionWrapper>
    );
}
