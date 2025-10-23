import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { Bolt } from 'lucide-react';

import { useAuth } from'../hooks/useAuth';

import AlertDialogue from './AlertDialogue';

import { useNavigate } from 'react-router-dom'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  const handleProfile = () => { 
    navigate('/profile');
   }

  const handleLogout = async () => {
    await logout();
  }
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
          {isAuthenticated && <div className='flex flex-col items-center py-7'>
            <DropdownMenu>
              <DropdownMenuTrigger>
                  <Bolt className='cursor-pointer ' />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='bg-black text-white'>
                <DropdownMenuLabel className=''>settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className='cursor-pointer'
                  onClick={handleProfile}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem asChild>  
                  {/* asChild = This prevents event conflicts between the dropdown and alert dialog */}
                  <AlertDialogue 
                    trigger='Log-out' 
                    title='Are you sure?' 
                    description='This action will log you out of your account.'
                    onConfirm={handleLogout}
                    triggerClassName='bg-red-500 text-white font-bold cursor-pointer p-1 rounded-md hover:bg-red-600'
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <p className='text-white'>settings</p>
          </div>}
          
        </div>
    </div>
  )
}

export default Sidebar
