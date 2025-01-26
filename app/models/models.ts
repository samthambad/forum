export interface Tag {
    id: number,
    name: string
}

export interface ThreadDisplay {
    id: number,
    title: string,
    content: string,
    createdBy: number,
    username: string,
    createdAt: Date,
    tags: Tag[]
}
export interface Comment {
    id: number;
    content: string;
    userId: number;
    threadId: number;
    createdAt: string;
    username?: string; // For display
}