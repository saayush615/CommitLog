import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';

const CommentBox = ({ onSubmitComment, isSubmitting = false }) => {
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            onSubmitComment(comment);
            setComment(''); // Clear the input after submission
        }
    };

    return (
        <div className="w-full bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full bg-gray-900 text-white rounded-lg p-3 border border-gray-700 focus:border-gray-500 focus:outline-none resize-none transition-colors"
                        rows="3"
                        disabled={isSubmitting}
                    />
                </div>
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={!comment.trim() || isSubmitting}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Send className="h-4 w-4" />
                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CommentBox;
