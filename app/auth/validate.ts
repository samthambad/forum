import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define the expected payload structure (if needed)
interface DecodedToken extends JwtPayload {
    user_id: string;
}

export async function GET(req: Request) {
    // Extract the token from cookies
    const token = req.headers.get("cookie")?.match(/auth_token=([^;]+)/)?.[1];

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Verify the token using the secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

        // Send back the decoded user ID or any relevant info
        return NextResponse.json({ user_id: decoded.user_id });
    } catch (err) {
        console.error("Token validation failed:", err);
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
