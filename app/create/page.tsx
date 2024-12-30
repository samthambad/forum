'use client'
import React, { useState } from "react";
import {
    TextField,
    Button,
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Container,
    Divider,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";

const CreateThreadPage = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Thread Created", { title, content });
        setTitle("");
        setContent("");
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Card
                sx={{
                    boxShadow: 3,
                    borderRadius: 2,
                    padding: 2,
                    backgroundColor: "background.paper",
                }}>
                <CardContent>
                    {/* Header with Icon */}
                    <Box display="flex" alignItems="center" marginBottom={2}>
                        <CreateIcon color="primary" sx={{ fontSize: 40, marginRight: 2 }} />
                        <Typography variant="h4" color="text.primary">
                            Create a New Thread
                        </Typography>
                    </Box>
                    <Divider sx={{ marginBottom: 3 }} />
                    <form onSubmit={handleSubmit}>
                        {/* Title */}
                        <TextField
                            fullWidth
                            label="Title"
                            placeholder="Enter a captivating title"
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            sx={{ marginBottom: 3 }} />
                        {/* Content */}
                        <TextField
                            fullWidth
                            label="Description"
                            placeholder="Share your thoughts..."
                            variant="outlined"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            multiline
                            rows={8}
                            sx={{ marginBottom: 3 }} />
                        <CardActions>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                sx={{
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    borderRadius: 1,
                                }}>
                                Post Thread
                            </Button>
                        </CardActions>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
};

export default CreateThreadPage;
