import React from 'react'
import { ArrowLeft, Heart, MessageCircle, Share } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const BlogActionSidebar = ({ isLiked, likesCount, handleToggleLike, commentsCount, onScrollToComments, onShare  }) => {
    const navigate = useNavigate();
  return (
    <div className='max-w-2xl flex flex-col'>
        <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="mb-10 text-white hover:text-gray-300 hover:bg-gray-800/50 transition-all duration-200"
        >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
        </Button>

        <div className='flex flex-col items-center gap-3'>
            <Button
                variant="ghost"
                className="w-16 h-16 rounded-full text-white cursor-pointer hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 p-0 flex flex-col"
                onClick={() => handleToggleLike()}
            >
                <Heart className={`h-6 w-6 ${isLiked && 'fill-red-600'}`} />
                {likesCount}
            </Button>

            <Button
                variant="ghost"
                className="w-16 h-16 rounded-full text-white cursor-pointer hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-200 p-0 flex flex-col"
                onClick={onScrollToComments}
            >
                <MessageCircle className="h-6 w-6" />
                {commentsCount}
            </Button>

            <Button
                variant="ghost"
                className="w-16 h-16 rounded-full text-white cursor-pointer hover:text-green-400 hover:bg-green-400/10 transition-all duration-200 p-0"
                onClick={onShare}
            >
                <Share className="h-6 w-6" />
            </Button>
        </div>
    </div>
  )
}

export default BlogActionSidebar
