import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
    TextField,
    Popper,
    Paper,
    List,
    ListItem,
    ListItemText,
    ClickAwayListener,
    Chip,
    Box,
    InputAdornment,
    IconButton,
    Autocomplete,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ClearIcon from "@mui/icons-material/Clear"
import { Tag } from "../models/models"
import { useRouter } from "next/navigation"

interface SearchResult {
    id: number
    title: string
}

export default function SearchBar() {
    const [query, setQuery] = useState("")
    const [tags, setTags] = useState<Tag[]>([])
    const [results, setResults] = useState<SearchResult[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const anchorRef = useRef<HTMLDivElement>(null)
    const limit = 5;
    const router = useRouter();

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
    useEffect(() => {
        fetchTags(); //only when component loads
        setIsOpen(false)
    }, [])

    useEffect(() => {
        const handleSearch = async () => {
            const params = new URLSearchParams();
            if (query) {
                params.append('query', query);
            }
            if (selectedTags.length > 0) {
                params.append('tags', selectedTags.map(tag => tag.id).join(','));
            }
            params.append('limit', limit.toString());
            console.log("params in string:", params.toString())
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search?${params.toString()}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (response.ok) {
                const data = await response.json();
                console.log("search response:", data)
                setResults(data);
                if (data.length > 0 && (query || selectedTags.length > 0)) { // Check if there are results and if query or selectedTags have changed
                    setIsOpen(true);
                }
            }
        };

        handleSearch();
    }, [query, selectedTags, limit]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
    }

    const handleResultClick = (result: SearchResult) => {
        console.log("Selected result:", result)
        setQuery("")
        setIsOpen(false)
        router.push(`/home?threadId=${result.id}`);

    }

    const handleClickAway = () => {
        setIsOpen(false)
    }

    const handleClearSearch = () => {
        setQuery("")
        setIsOpen(false)
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Box ref={anchorRef} sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <TextField
                    autoComplete="off"
                    value={query}
                    onChange={handleSearchChange}
                    placeholder="Search..."
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        borderRadius: 1,
                        "& .MuiOutlinedInput-root": {
                            color: "white",
                            "& fieldset": {
                                borderColor: "rgba(255, 255, 255, 0.3)",
                            },
                            "&:hover fieldset": {
                                borderColor: "rgba(255, 255, 255, 0.5)",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "white",
                            },
                        },
                        "& .MuiInputBase-input::placeholder": {
                            color: "rgba(255, 255, 255, 0.7)",
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "white" }} />
                            </InputAdornment>
                        ),
                        endAdornment: query && (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClearSearch} edge="end" sx={{ color: "white" }}>
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Autocomplete
                    multiple
                    id="tags-autocomplete"
                    options={tags}
                    getOptionLabel={(tag) => tag.name}
                    value={selectedTags}
                    onChange={(event, newValue) => {
                        setSelectedTags(newValue);
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderTags={(value, getTagProps) =>
                        value.map((tag, index) => (
                            <Chip
                                {...getTagProps({ index })} // This provides key and delete handler
                                key={tag.id} // Add explicit key using tag ID
                                label={tag.name}
                                sx={{
                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                    color: "white",
                                    "& .MuiChip-deleteIcon": {
                                        color: "rgba(255, 255, 255, 0.7)",
                                        "&:hover": { color: "white" },
                                    },
                                }}
                            />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            size="small"
                            placeholder="Filter by tags"
                        />
                    )}
                />
                <Popper open={isOpen} anchorEl={anchorRef.current} placement="bottom-start">
                    <Paper elevation={3} style={{ width: anchorRef.current ? anchorRef.current.clientWidth : undefined }}>
                        <List>
                            {results?.map((result) => (
                                <ListItem key={result.id} onClick={() => handleResultClick(result)} button>
                                    <ListItemText primary={result.title} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Popper>
            </Box>
        </ClickAwayListener>
    )
}

