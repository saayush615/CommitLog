import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from "@/components/ui/badge"
// Import utility functions
import { stripAndTruncate } from '@/utils/textUtils'
import { formatDate } from '@/utils/dateUtils'

const Card = ({ blogId, title, content, username, publishdate, isProfile}) => {
  const navigate = useNavigate();
  // Use the utility functions
  const displayContent = stripAndTruncate(content, 500);
  const { day, month } = formatDate(publishdate);

  // Handle card click
  const handleCardClick = () => {
    navigate(`/blog/${blogId}`);
  };
  
  return (
    <div 
      className='grid grid-cols-8 gap-8 m-4 p-4 min-h-[200px] max-h-[200px] w-full max-w-7xl cursor-pointer'
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
        <div className='text-xl mb-3 font-bold'>
          <h3 className='line-clamp-2 overflow-hidden text-ellipsis'>
            {title}
          </h3>
        </div>
        <div className='text-gray-300 text-sm flex-1 overflow-hidden'>
          <p className='line-clamp-4 overflow-hidden text-ellipsis leading-relaxed'>
            {displayContent}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Card