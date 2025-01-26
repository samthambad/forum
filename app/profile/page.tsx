"use client"
import { useEffect } from "react";

export default function ProfilePage() {
    useEffect(() => {
        const fetchUserPosts = async () => {
            const response = await fetch(
                process.env.NEXT_PUBLIC_BACKEND_URL + "/api/my_threads",
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch user threads");
            }
            const data = await response.json();
            console.log(data)
        }
        fetchUserPosts()
    }, [])
    return <div>Profile of</div>
}