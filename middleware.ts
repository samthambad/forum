import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "your_scret";
export async function middleware(request: Request) {
    // Use cookies() to access the cookies in the edge environment
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token"); // Get the auth_token cookie

    // If no token is found, redirect to login page
    if (!token) {
        console.log("token doesn't exist, redirecting to /login");
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        // Verify the token using the jose library
        const { payload } = await jwtVerify(token.value, new TextEncoder().encode(JWT_SECRET));

        // You can now use the decoded payload (user information) if needed
        console.log("Decoded JWT Payload:", payload);

        // Allow the request to continue
        return NextResponse.next();
    } catch (error) {
        console.log("Invalid or expired token:", error);
        return NextResponse.redirect(new URL("/login", request.url));
    }
}


// Define the routes where middleware should apply
export const config = {
    matcher: [
        // Protect these routes
        "/profile",
        "/home",
        "/create"
    ],
};
