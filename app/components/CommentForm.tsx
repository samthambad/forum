import { useState } from 'react';
import ReplyIcon from '@mui/icons-material/Reply';
export default function CommentForm({ threadId, onCommentAdded }: {
    threadId: number;
    onCommentAdded: () => void;
}) {
    const [content, setContent] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/make_comment`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        thread_id: threadId,
                        content: content
                    }),
                }
            );

            if (response.ok) {
                setContent('');
                onCommentAdded();
            }
        } catch (err) {
            console.error('Failed to post comment:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-2 border rounded"
                required
            />
            <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
                <ReplyIcon />
            </button>
        </form>
    );
}