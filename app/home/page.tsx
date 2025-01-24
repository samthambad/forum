'use client'
import { Box, Chip, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import TagIcon from '@mui/icons-material/Tag';
import { useEffect, useState } from "react";
import { Tag, ThreadDisplay } from "../models/models";
export default function Home() {
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/api/all_posts",
          {
            method: "GET",
            credentials: "include"
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        console.log("API response data:", data);

        // Map the response data to match the Thread interface
        const formattedThreads: ThreadDisplay[] = data.map((item: { id: number; title: string; content: string; created_by: number; created_at: string; tags: Tag[] }) => ({
          Id: item.id,
          Title: item.title,
          Content: item.content,
          CreatedBy: item.created_by,
          CreatedAt: new Date(item.created_at),
          Tags: item.tags || [] // null case
        }));

        setThreads(formattedThreads.sort((a, b) => b.CreatedAt.getTime() - a.CreatedAt.getTime()));
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  interface Thread {
    Id: number;
    Title: string;
    Content: string;
    CreatedBy: number;
    CreatedAt: Date;
    Tags: Tag[];
  }

  if (loading) return <p>Loading...</p>;
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
        {threads === null || threads.length === 0 ? <Typography sx={{ m: "6" }}>No Posts available</Typography> : null}
        <div>
          <List
            sx={{ width: '100%', }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            {threads?.map((thread: Thread) => (
              <ListItem
                key={thread.Id} onClick={() => setSelectedThread(thread)}
                sx={{
                  "&:hover": { backgroundColor: "#e0e0e0" },
                  backgroundColor:
                    selectedThread?.Id === thread.Id ? "#e0e0e0" : "inherit",
                }}
              >
                <ListItemText
                  primary={thread.Title}
                  secondary={`${thread.Content.length > 25 ? thread.Content.slice(0, 25) + "..." : thread.Content} ${new Date(thread.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                />
              </ListItem>))}
          </List>
        </div>
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {selectedThread.Tags?.map((eachTag) => (
                <Chip
                  key={eachTag.id}
                  size="small"
                  label={eachTag.name}
                  icon={<TagIcon sx={{ fontSize: '10px !important', ml: '4px' }} />}
                  sx={{
                    height: '20px',
                    fontSize: '0.6rem',
                    borderRadius: '4px',
                    padding: '0 4px',
                    '& .MuiChip-icon': {
                      margin: '0 !important',
                      marginRight: '4px !important'
                    },
                    '& .MuiChip-label': {
                      padding: '0 4px',
                      maxWidth: '80px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }
                  }}
                />
              ))}
            </Box>
          </>
        ) : (
          <Typography variant="h6" sx={{ textAlign: "center", mt: 4, color: "gray" }}>
            Select thread to view its content
          </Typography>
        )}
      </Box>
    </Box >)
}