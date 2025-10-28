import React, { useEffect} from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from 'lucide-react';
import { getInitials } from '../utils/textUtils'
import { formatDateDiff } from '../utils/dateUtils'

const CommentCard = ({ comment, onDelete }) => {

    return (
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex gap-3">
                {/* Avatar */}
                <Avatar className="h-10 w-10 border border-gray-600">
                    <AvatarImage src={comment.author?.profilePicture} alt={comment.author?.username} />
                    <AvatarFallback className="bg-gray-700 text-gray-300">
                        {comment.user ? 
                            getInitials(comment.user.firstname, comment.user.lastname) : 
                            <User className="h-5 w-5" />
                        }
                    </AvatarFallback>
                </Avatar>

                {/* Comment content */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white">
                            {comment.user?.firstname} {comment.user?.lastname}
                        </span>
                        <span className="text-gray-400 text-sm">
                            @{comment.user?.username}
                        </span>
                        <span className="text-gray-500 text-sm">
                            · {formatDateDiff(comment.createdAt)}
                        </span>
                    </div>
                    <p className="text-gray-200 leading-relaxed">
                        {comment.content}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CommentCard;
