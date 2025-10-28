import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Edit, Trash2, EllipsisVertical  } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AlertDialogue from './AlertDialogue';
import { toast, Bounce } from 'react-toastify';

// Import utility functions
import { stripAndTruncate } from '@/utils/textUtils'
import { formatDate } from '@/utils/dateUtils'
import axios from 'axios';

const Card = ({ blogId, title, content, username, publishdate, likesCount, commentsCount, isProfile, onDelete, onEdit}) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Use the utility functions
  const displayContent = stripAndTruncate(content, 500);
  const { day, month } = formatDate(publishdate);

  // Handle card click
  const handleCardClick = () => {
    navigate(`/blog/${blogId}`);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/blog/delete/${blogId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Blog deleted successfully!', {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
          transition: Bounce,
        });

        // Call parent component's onDelete to update the UI
        if (onDelete) {
          onDelete(blogId);
        }
      }
    } catch (err) {
      console.error('Error deleting blog:', err);
      toast.error(err.response?.data?.error || 'Failed to delete blog', {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent card click
    setShowDeleteDialog(true); // Open the AlertDialogue
  };
  
  return (
    <>
      <div 
        className='grid grid-cols-8 gap-8 min-h-[200px] max-h-[200px] w-full max-w-7xl cursor-pointer'
        onClick={handleCardClick}
      >
        {/* left section */}
        {!isProfile && (
          <div className='text-right flex flex-col items-end justify-start'>
            <h2 className='text-xl text-white font-bold font-sans'>{day}</h2>
            <h2 className='text-xl text-white font-bold font-sans'>{month}</h2>
            <div className='mb-4 flex-1 flex items-start'>
              <p className='-rotate-90 origin-right text-sm truncate max-w-[100px]'>
                {`@${username}`}
              </p>
            </div>
          </div>
        )}

        {/* right section */}
        <div className={`${isProfile ? 'col-span-8' : 'col-span-7'} flex flex-col overflow-hidden`}>
          <div className='text-xl mb-3 font-bold flex flex-row justify-between items-center'>
            <h3 className='line-clamp-2 overflow-hidden text-ellipsis'>
              {title}
            </h3>

            {/* Three-dot menu for profile view */}
            {isProfile && (
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger 
                    onClick={(e) => e.stopPropagation()}
                    className='p-2 hover:bg-gray-800 rounded-full border-none outline-none'
                    disabled={isDeleting}
                  >
                    <EllipsisVertical className='h-5 w-5 text-gray-400 hover:text-white' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className='w-40 text-white bg-black'>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement edit functionality
                        navigate(`/edit/${blogId}`);
                      }}
                      className='cursor-pointer flex items-center gap-2'
                    >
                      <Edit className='h-4 w-4' />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleDeleteClick}
                      className='cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-600'
                      disabled={isDeleting}
                    >
                      <Trash2 className='h-4 w-4' />
                      <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          
          <div className='text-gray-300 text-sm flex-1 overflow-hidden'>
            <p className='line-clamp-4 overflow-hidden text-ellipsis leading-relaxed'>
              {displayContent}
            </p>
            <div className='flex flex-row gap-4'>
              <div className='flex flex-row gap-2'>
                <Heart className='fill-red-500 h-5 w-5' />
                {likesCount}
              </div>
              <div className='flex flex-row gap-2'>
                <MessageCircle className='fill-blue-500 h-5 w-5' />
                {commentsCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Dialog - Outside the card to prevent event conflicts */}
      {showDeleteDialog && (
        <AlertDialogue 
          trigger={null}
          title='Delete Blog?' 
          description='This action cannot be undone. This will permanently delete your blog post.'
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteDialog(false)}
          isOpen={showDeleteDialog}
        />
      )}
    </>
  )
}

export default Card