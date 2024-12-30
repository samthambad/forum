'use client'
import { Box, Divider, List, ListItem, ListItemButton, ListItemText, ListSubheader, Typography } from "@mui/material";
import { useEffect, useState } from "react";
export default function Home() {
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [threads, setPosts] = useState<Thread[]>([]);
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
  interface Thread {
    ID: number;
    Title: string;
    Content: string;
    CreatedBy: number;
    CreatedAt: Date;
  }
  if (loading) return <p>Loading...</p>;
  console.log("number of posts:", threads.length)
  return (
    <Box sx={{ height: "100vh", display: "flex" }}>
      <Box
        sx={{
          width: "30%",
          borderRight: "1px solid #ddd",
          bgcolor: "#f9f9f9",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
          Threads
        </Typography>
        {threads.length == 0 ? "No Posts available" :
          <div>
            <List
              sx={{ width: '100%', }}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              {threads.map((thread: Thread) => (
                <ListItem
                  key={thread.ID} onClick={() => setSelectedThread(thread)}
                  sx={{
                    "&:hover": { backgroundColor: "#f0f0f0" },
                    backgroundColor:
                      selectedThread?.ID === thread.ID ? "#e0e0e0" : "inherit",
                  }}
                >
                  <ListItemText
                    primary={thread.Title}
                    secondary={`${thread.Content.slice(0, 25)}... ${new Date(thread.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  />
                </ListItem>))}
            </List>
          </div>}
      </Box>
      <Box
        sx={{
          flexGrow: 1, // Takes remaining space
          p: 3,
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
        }}
      >
        {selectedThread ? (
          <>
            <Typography variant="h5" gutterBottom>
              {selectedThread.Title}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography>

              {selectedThread.Content}
            </Typography>
          </>
        ) : (
          <Typography variant="h6" sx={{ textAlign: "center", mt: 4, color: "gray" }}>
            Select thread to view its content
          </Typography>
        )}
      </Box>
    </Box >)
}