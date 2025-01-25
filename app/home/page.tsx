'use client'
import { Box, Chip, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import TagIcon from '@mui/icons-material/Tag';
import { useEffect, useState } from "react";
import { Tag, ThreadDisplay } from "../models/models";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
export default function Home() {
  const [selectedThread, setSelectedThread] = useState<ThreadDisplay | null>(null);
  const [threads, setThreads] = useState<ThreadDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshComments, setRefreshComments] = useState(false);

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

        // Map the response data to match the Thread interface
        const formattedThreads: ThreadDisplay[] = data.map((item: { id: number; title: string; content: string; created_by: number; created_at: string; tags: Tag[] }) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          createdBy: item.created_by,
          createdAt: new Date(item.created_at),
          tags: item.tags || [] // null case
        }));

        setThreads(formattedThreads.sort((a, b) => b.createdAt?.getTime() - a.createdAt?.getTime()));
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);


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
            {threads?.map((thread: ThreadDisplay) => (
              <ListItem
                key={thread.id} onClick={() => setSelectedThread(thread)}
                sx={{
                  "&:hover": { backgroundColor: "#e0e0e0" },
                  backgroundColor:
                    selectedThread?.id === thread.id ? "#e0e0e0" : "inherit",
                }}
              >
                <ListItemText
                  primary={thread.title}
                  secondary={`${thread.content.length > 25 ? thread.content.slice(0, 25) + "..." : thread.content} ${new Date(thread.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
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
              {selectedThread.title}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography>
              {selectedThread.content}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {selectedThread.tags?.map((eachTag) => (
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
            <CommentForm
              threadId={selectedThread.id}
              onCommentAdded={() => setRefreshComments(!refreshComments)}
            />

            <CommentList
              threadId={selectedThread.id}
              key={refreshComments ? 'refresh' : 'static'}
            />
          </>
        ) : (
          <Typography variant="h6" sx={{ textAlign: "center", mt: 4, color: "gray" }}>
            Select thread to view its content
          </Typography>
        )}
      </Box>
    </Box >)
}