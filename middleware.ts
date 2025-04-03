import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    console.log("\n***********************");
    console.log("origin:", request.nextUrl.origin);
    console.log("path: ", request.nextUrl.pathname);
    const allowedOrigins = ["https://webapp-pragmatic-portal.azurewebsites.net", "http://localhost:3000", "https://tracker.pragmaticdlt.com"];

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token && request.nextUrl.pathname.startsWith("/api/upwork/")) {
        return NextResponse.next();
    }

    // if (!token && request.nextUrl.pathname !== "/api/auth/signin" && !allowedOrigins.some(origin => request.nextUrl.origin.startsWith(origin))) {
    if (!token && request.nextUrl.pathname !== "/api/auth/signin" && !request.nextUrl.pathname.startsWith("/api/upwork/")) {
        console.error("Not authenticated");
        return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    }

    console.log("Authorized user: ", token?.name);
    return NextResponse.next();
}


export const config = {
    matcher: ["/dashboard/:path*", "/utility/unauthorized/:path*", "/api/timelogs/:path*", "/upwork/:path*", "/time-log/:path*"]
};
