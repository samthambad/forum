import { useCallback, useEffect, useState } from 'react';
import { Comment } from '../models/models';
import { Box, Button, Card, CardContent, CircularProgress, Divider, TextField, Typography } from '@mui/material';
import ReplyIcon from "@mui/icons-material/Reply"

export default function CommentList({ threadId }: { threadId: number }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState("")

    const convertTZ = (date: Date | string, tzString: string) => {
        const date_obj = new Date(
            (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }),
        )
        return `${date_obj.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })} · ${date_obj.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })}`
    }

    const fetchComments = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/thread_comments`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    thread_id: threadId,
                }),
            })

            if (!response.ok) throw new Error("Failed to fetch comments")
            const data = await response.json()
            setComments(data)
        } catch (err) {
            console.error("Error fetching comments:", err)
        } finally {
            setLoading(false)
        }
    }, [threadId])

    useEffect(() => {
        if (threadId) fetchComments()
    }, [threadId, fetchComments])

    const makeComment = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/make_comment`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    thread_id: threadId,
                    content: content,
                }),
            })

            if (response.ok) {
                setContent("")
                fetchComments()
            }
        } catch (err) {
            console.error("Failed to post comment:", err)
        }
    }

    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress color="primary" />
            </Box>
        )

    if (comments?.length === 0)
        return (
            <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary">
                    No comments yet
                </Typography>
            </Box>
        )

    return (
        <Box sx={{
            width: "100%",
            maxWidth: 600,
            mx: 'auto',
            px: { xs: 2, sm: 0 }
        }}>
            {comments?.map((comment) => (
                <Card
                    key={comment.id}
                    sx={{
                        mb: 2,
                        borderRadius: 2,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        background: 'linear-gradient(145deg, #f0f9ff, #e6f2ff)',
                    }}
                >
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Box>
                                <Typography variant="subtitle2" color="primary" fontWeight="bold">
                                    {comment.username}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {convertTZ(comment.created_at, "Asia/Singapore")}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{
                                pl: 1,
                                borderLeft: '3px solid',
                                borderColor: 'primary.light'
                            }}
                        >
                            {comment.content}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
            <Divider sx={{ my: 3 }} />
            <Card
                sx={{
                    background: 'linear-gradient(145deg, #e6fffd, #e0f2f1)',
                    borderRadius: 2,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
            >
                <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                        Add a comment
                    </Typography>
                    <form onSubmit={makeComment}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            placeholder="Write your comment here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={<ReplyIcon />}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 'bold'
                            }}
                        >
                            Post Comment
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    )
}