"use client"
import { useEffect, useState } from "react";
import { Tag, ThreadDisplay } from "../models/models";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Container,
    Grid,
    Stack,
    Typography
} from "@mui/material";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [threads, setThreads] = useState<ThreadDisplay[]>([]);
    const [username, setUsername] = useState("")
    const router = useRouter();

    const handleThreadClick = (threadId: number) => {
        router.push(`/home?threadId=${threadId}`);
    }

    useEffect(() => {
        const fetchUsername = async () => {
            const response = await fetch(
                process.env.NEXT_PUBLIC_BACKEND_URL + "/api/whoami",
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch user");
            }
            const data = await response.json();
            setUsername(data["username"])
        }

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
            const formattedThreads: ThreadDisplay[] = data.map((item: {
                id: number;
                title: string;
                content: string;
                created_by: number;
                username: string;
                created_at: string;
                tags: Tag[]
            }) => ({
                id: item.id,
                title: item.title,
                content: item.content,
                createdBy: item.created_by,
                username: item.Username,
                createdAt: new Date(item.created_at),
                tags: item.tags || []
            }));
            setThreads(formattedThreads.sort((a, b) => b.createdAt?.getTime() - a.createdAt?.getTime()));
        }

        fetchUsername()
        fetchUserPosts()
    }, [])

    return (
        <Container maxWidth="lg">
            <Box sx={{
                mt: 4,
                mb: 4,
                backgroundColor: 'background.paper',
                borderRadius: 2,
                p: 3,
                boxShadow: 1
            }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mb: 3
                        }}>
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    mb: 2,
                                    bgcolor: 'primary.main'
                                }}
                            >
                                <PersonOutlineIcon sx={{ fontSize: 60 }} />
                            </Avatar>
                            <Typography
                                variant="h4"
                                fontWeight="bold"
                                color="text.primary"
                            >
                                {username}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Typography
                            variant="h4"
                            gutterBottom
                            fontWeight="bold"
                            color="text.primary"
                        >
                            My Threads
                        </Typography>
                        {threads.length === 0 ? (
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                textAlign="center"
                            >
                                No threads created yet
                            </Typography>
                        ) : (
                            threads.map((thread) => (
                                <Card
                                    key={thread.id}
                                    sx={{
                                        mb: 3,
                                        borderRadius: 2,
                                        transition: 'transform 0.2s',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'scale(1.02)'
                                        }
                                    }}
                                    elevation={2}
                                    onClick={() => handleThreadClick(thread.id)}
                                >
                                    <CardHeader
                                        title={
                                            <Typography variant="h6" fontWeight="bold">
                                                {thread.title}
                                            </Typography>
                                        }
                                        subheader={`Posted on ${format(thread.createdAt, 'MMMM d, yyyy')}`}
                                    />
                                    <CardContent>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            paragraph
                                            sx={{ mb: 2 }}
                                        >
                                            {thread.content}
                                        </Typography>

                                        {thread.tags.length > 0 && (
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                sx={{ flexWrap: 'wrap', gap: 1 }}
                                            >
                                                {thread.tags.map((tag) => (
                                                    <Chip
                                                        key={tag.id}
                                                        label={tag.name}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                ))}
                                            </Stack>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}