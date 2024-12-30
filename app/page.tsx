'use client'
import { List, ListItem, ListItemButton, ListSubheader } from "@mui/material";
import { useEffect, useState } from "react";
export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
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
        console.log("json data", data)
        setPosts(data);
      } catch (err) {
        console.log("error fetching")
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);
  interface Post {
    ID: number;
    Title: string;
    Content: string;
    CreatedBy: number;
    CreatedAt: Date;
  }
  if (loading) return <p>Loading...</p>;
  console.log("number of posts:", posts.length)
  return <div>
    <div className="">
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
            {posts.map((post: Post) => (<ListItemButton key={post.ID}>{post.Title}</ListItemButton>))}
          </List>
        </div>}
    </div>
  </div >
}