import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { Bolt } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className='border-r-2 border-neon w-24 py-4 px-10 h-screen fixed flex flex-col justify-between'>
      {/* Upper sidebar */}
        <div className='flex flex-col items-center gap-7'>
            {/* avatar */}
            <Avatar className='w-16 h-16 cursor-pointer'>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className='bg-neon text-black'>CN</AvatarFallback>
            </Avatar>

            {/* search */}
            <div className='flex flex-col items-center cursor-pointer'>
              <Search />
              <p className='text-white'>search</p>
            </div>

            {/* trending */}
            <div className='flex flex-col items-center cursor-pointer'>
              <TrendingUp />
              <p className='text-white'>trending</p>
            </div>
        </div>

        {/* lower sidebar */}
        <div>

          {/* settings */}
          <div className='flex flex-col items-center py-7'>
            <Bolt />
            <p className='text-white'>settings</p>
          </div>
        </div>
    </div>
  )
}

export default Sidebar
