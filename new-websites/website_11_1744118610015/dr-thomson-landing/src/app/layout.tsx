import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
})

export const metadata: Metadata = {
  title: "Dr. Jonathan Thomson - Medical Practice",
  description: "World-class medical expertise at your service",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={openSans.variable}>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'