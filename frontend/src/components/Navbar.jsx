import React from 'react'
// Icons
import Logo from '../assets/CommitLog-Logo.png'
import { CirclePlus } from 'lucide-react';
// link
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    // mx-auto only works if the element has a width or max-width set. Otherwise, it won't appear centered.
    <nav>
      <div className='flex flex-end'>
        {/* Logo */}
        <div className='mx-auto'>
          <img src={Logo} alt="CommitLog-Logo" className='w-50 my-5' />
        </div>

        {/* buttons */}
        
        <div className='my-auto m-3 sm:mr-5 md:mr-7 lg:mr-10 cursor-pointer'>
          <Link to="/CreateBlog">
            <CirclePlus size={30} color='white' strokeWidth={3} className='mx-auto' />
            <p className='text-white size-sx hidden md:block'>create</p>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar