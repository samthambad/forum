'use client'
import { List, ListItem, ListItemButton, ListSubheader } from "@mui/material";
import { useEffect, useState } from "react";
export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/all_posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        console.log(data)
        setPosts(data.posts);
      } catch (err) {
        console.log("error fetching")
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);
  if (loading) return <p>Loading...</p>;
  console.log("number of posts:", posts.length)
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