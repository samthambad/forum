'use client'
import { Box, Chip, Divider, List, ListItem, ListItemText, Typography, Paper, Avatar, Stack } from "@mui/material";
import TagIcon from '@mui/icons-material/Tag';
import { useEffect, useState } from "react";
import { Tag, ThreadDisplay } from "../models/models";
import CommentList from "../components/CommentList";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [selectedThread, setSelectedThread] = useState<ThreadDisplay | null>(null);
  const [threads, setThreads] = useState<ThreadDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams(); // Get search params
  const threadIdFromUrl = searchParams.get('threadId');

  useEffect(() => {
    if (threads.length > 0 && threadIdFromUrl) {
      const threadId = parseInt(threadIdFromUrl, 10);
      const foundThread = threads.find(t => t.id === threadId);
      setSelectedThread(foundThread || null);
    }
  }, [threads, threadIdFromUrl]);

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

        const formattedThreads: ThreadDisplay[] = data.map((item: { id: number; title: string; content: string; created_by: number; created_at: string; tags: Tag[] }) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          createdBy: item.created_by,
          createdAt: new Date(item.created_at),
          tags: item.tags || []
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

  if (loading) return <Typography sx={{ p: 2 }}>Loading...</Typography>;

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
        {threads === null || threads.length === 0 ? <Typography sx={{ m: 2 }}>No Posts available</Typography> : null}
        <List sx={{ width: '100%' }} component="nav">
          {threads?.map((thread: ThreadDisplay) => (
            <ListItem
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              sx={{
                "&:hover": { backgroundColor: "#e0e0e0" },
                backgroundColor: selectedThread?.id === thread.id ? "#e0e0e0" : "inherit",
                transition: 'background-color 0.2s ease',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <ListItemText
                primary={thread.title}
                secondary={`${thread.content.length > 25 ? thread.content.slice(0, 25) + "..." : thread.content} ${new Date(thread.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              />
              {thread.tags && thread.tags.length > 0 && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    width: '100%',
                    mt: 1,
                    flexWrap: 'wrap',
                    gap: 1
                  }}
                >
                  {thread.tags.map((tag) => (
                    <Chip
                      key={tag.id}
                      label={tag.name}
                      size="small"
                      icon={<TagIcon fontSize="small" />}
                      sx={{
                        height: '20px',
                        fontSize: '0.625rem',
                        background: 'linear-gradient(145deg, #e6f2ff, #d6e6f2)',
                        borderRadius: '10px',
                        '& .MuiChip-icon': {
                          fontSize: '0.75rem',
                          color: 'primary.main'
                        }
                      }}
                    />
                  ))}
                </Stack>
              )}
            </ListItem>
          ))}
        </List>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
          overflowY: "auto"
        }}
      >
        {selectedThread ? (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'linear-gradient(145deg, #f5f5f5, #ffffff)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                <PersonOutlineIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" gutterBottom>
                  {selectedThread.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Posted on {selectedThread.createdAt.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="body1" sx={{ mb: 2 }}>
              {selectedThread.content}
            </Typography>

            {selectedThread.tags && selectedThread.tags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', mb: 2 }}>
                {selectedThread.tags?.map((eachTag) => (
                  <Chip
                    key={eachTag.id}
                    size="small"
                    label={eachTag.name}
                    icon={<TagIcon sx={{ fontSize: '14px', mr: 0.5 }} />}
                    sx={{
                      height: '24px',
                      fontSize: '0.7rem',
                      borderRadius: '12px',
                      background: 'linear-gradient(145deg, #e6f2ff, #d6e6f2)',
                      '& .MuiChip-icon': {
                        color: 'primary.main'
                      }
                    }}
                  />
                ))}
              </Box>
            )}

            <CommentList
              threadId={selectedThread.id}
            />
          </Paper>
        ) : (
          <Typography variant="h6" sx={{ textAlign: "center", mt: 4, color: "gray" }}>
            Select thread to view its content
          </Typography>
        )}
      </Box>
    </Box>
  )
}