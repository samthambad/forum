'use client'
import { List, ListItem, ListItemButton, ListSubheader } from "@mui/material";
import { useEffect, useState } from "react";
require("dotenv").config();
export default function Home() {
  const [posts, setPosts] = useState([]); // State to store posts
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to manage errors
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(process.env.BACKEND_URL + "/posts"); // Replace with your backend URL
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data.posts); // Assuming the backend sends { posts: [...] }
      } catch (err) {
        console.log("error fetching")
      } finally {
        setLoading(false); // Loading complete
      }
    };

    fetchPosts();
  }, []);

  return <div>
    {posts.length == 0 ? "No Posts available" :
      <div>
        <ListSubheader component="div" id="nested-list-subheader">
          Threads
        </ListSubheader>
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          {posts.map((post) => (<ListItemButton>post.title</ListItemButton>))}
          <ListItemButton>Home</ListItemButton>
        </List>
      </div>}
  </div >
}