// components/CommentList.tsx
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
                <CircularProgress />
            </Box>
        )

    if (comments?.length === 0)
        return (
            <Box textAlign="left" py={4}>
                <Typography variant="body1" color="text.secondary">
                    No comments yet
                </Typography>
            </Box>
        )

    return (
        <Box sx={{ width: "100%", mt: 4 }}>
            {comments?.map((comment) => (
                <Card key={comment.id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                            <Box>
                                <Typography variant="subtitle1">{comment.username}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {convertTZ(comment.created_at, "Asia/Singapore")}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="body1" sx={{ ml: 1 }}>
                            {comment.content}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
            <Divider sx={{ my: 4 }} />
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
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
                            sx={{ mb: 2 }}
                        />
                        <Button type="submit" variant="contained" color="primary" startIcon={<ReplyIcon />}>
                            Post Comment
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    )
}