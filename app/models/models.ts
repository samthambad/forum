export interface Tag {
    id: number,
    name: string
}

export interface ThreadDisplay {
    Id: number,
    Title: string,
    Content: string,
    CreatedBy: number,
    CreatedAt: Date,
    Tags: Tag[]
}