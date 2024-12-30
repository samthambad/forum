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
    Grid,
    Container,
    Divider,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";

const CreateThreadPage = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // something
        console.log("Thread Created", { title, content });
        setTitle("");
        setContent("");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(to right, #f0f4f8, #d9e2ec)",
                display: "flex",
                alignItems: "center",
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Main Form Section */}
                    <Grid item xs={12} md={8}>
                        <Card
                            sx={{
                                boxShadow: 3,
                                borderRadius: 2,
                                padding: 3,
                                backgroundColor: "background.paper",
                            }}
                        >
                            <CardContent>
                                {/* Header */}
                                <Box display="flex" alignItems="center" marginBottom={2}>
                                    <CreateIcon
                                        color="primary"
                                        sx={{ fontSize: 40, marginRight: 2 }}
                                    />
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
                                        sx={{ marginBottom: 3 }}
                                    />

                                    {/* Content */}
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        placeholder="Share your thoughts or ideas..."
                                        variant="outlined"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                        multiline
                                        rows={10}
                                        sx={{ marginBottom: 3 }}
                                    />
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
                                            }}
                                        >
                                            Post Thread
                                        </Button>
                                    </CardActions>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                    {/* Side Panel Section */}
                    <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{
                            display: { xs: "none", md: "block" },
                        }}
                    >
                        <Box
                            sx={{
                                padding: 2,
                                borderRadius: 2,
                                backgroundColor: "gray",
                                color: "white",
                                boxShadow: 2,
                                textAlign: "center",
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold" mb={2}>
                                Tips for Creating a Thread
                            </Typography>
                            <Typography variant="body1" mb={1}>
                                - Keep your title concise and clear.
                            </Typography>
                            <Typography variant="body1" mb={1}>
                                - Use proper formatting for better readability.
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                padding: 2,
                                borderRadius: 2,
                                backgroundColor: "primary.light",
                                color: "white",
                                boxShadow: 2,
                                textAlign: "center",
                                mt: "10px"
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold" mb={2}>
                                Community Guidelines
                            </Typography>
                            <Typography variant="body1" mb={1}>
                                - Be Respectful.
                            </Typography>
                            <Typography variant="body1" mb={1}>
                                - Substantiate your arguments with evidence.
                            </Typography>
                            <Typography variant="body1">
                                - Do not share personal information.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default CreateThreadPage;
