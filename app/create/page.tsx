'use client'
import React, { useState, useEffect } from "react";
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
    List,
    ListItem,
    ListItemButton,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import TagIcon from '@mui/icons-material/Tag';
import { useRouter } from "next/navigation";

interface Tags {
    ID: number,
    Name: string
}
const CreateThreadPage = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState<Tags[]>([])
    const [chosenTags, setChosenTags] = useState<Tags[]>([])
    const { push } = useRouter();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                fetchTags();
            } catch (err) {
                console.log("error fetching tags", err)
            }
        };

        fetchPosts();
    }, []);
    const fetchTags = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/getTags", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        })
        const dataJson = await response.json()
        setTags(dataJson)
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "Title": title,
                    "Content": content
                }),
                credentials: "include"
            });
            if (response.ok) {
                const result = await response.json();
                console.log("Thread created successfully:", result);
                setTitle("");
                setContent("");
                push("/home")
            } else {
                console.error("Failed to create thread.");
            }
        } catch (error) {
            console.error("Failed to create thread:", error);
        }
        setTitle("");
        setContent("");
    };
    const chooseTag = (id: number) => {
        setChosenTags(prevChosenTags => {
            if (prevChosenTags.some(tag => tag.ID === id)) {
                return prevChosenTags.filter(tag => tag.ID !== id);
            } else {
                const tagToAdd = tags.find(tag => tag.ID === id);
                if (tagToAdd) {
                    return [...prevChosenTags, tagToAdd];
                }
                return prevChosenTags;
            }
        });
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
                                    <Typography fontWeight="light" mb={2}>Tags</Typography>
                                    <Box sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 1,
                                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                                    }}>
                                        {tags.map((eachTag) => (
                                            <ListItemButton key={eachTag.ID} sx={{
                                                minWidth: "auto",
                                                padding: "4px 8px",
                                                borderRadius: 2,
                                                textTransform: "none",
                                                fontSize: "0.75rem",
                                                backgroundColor: chosenTags.some(tag => tag.ID === eachTag.ID)
                                                    ? "primary.light"
                                                    : "transparent",
                                                color: chosenTags.some(tag => tag.ID === eachTag.ID)
                                                    ? "white"
                                                    : "text.primary",
                                                "&:hover": {
                                                    backgroundColor: chosenTags.some(tag => tag.ID === eachTag.ID)
                                                        ? "primary.dark"
                                                        : "action.hover",
                                                },
                                            }} onClick={() => chooseTag(eachTag.ID)}>
                                                <TagIcon sx={{ marginRight: 1 }} />
                                                {eachTag.Name}
                                            </ListItemButton>
                                        ))}
                                    </Box>
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
        </Box >
    );
};

export default CreateThreadPage;
