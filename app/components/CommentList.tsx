// components/CommentList.tsx
import { useEffect, useState } from 'react';
import { Comment } from '../models/models';

export default function CommentList({ threadId }: { threadId: number }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("thread selected:", threadId)
        const fetchComments = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/thread_comments`,
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            thread_id: threadId,
                        }),
                    }
                );

                if (!response.ok) throw new Error('Failed to fetch comments');
                const data = await response.json();
                setComments(data);
            } catch (err) {
                console.error('Error fetching comments:', err);
            } finally {
                setLoading(false);
            }
        };

        if (threadId) fetchComments();
    }, [threadId]);

    if (loading) return <div>Loading comments...</div>;
    if (comments?.length == 0) return "No comments yet"

    return (
        <div className="space-y-4">
            {comments?.map((comment) => (
                <div key={comment.id} className="p-4 bg-gray-50 rounded">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">{comment.username}</span>
                        <span>•</span>
                        <span>{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="mt-2">{comment.content}</p>
                </div>
            ))}
        </div>
    );
}