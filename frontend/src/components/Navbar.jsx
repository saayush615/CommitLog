import React from 'react'
// Icons
import Logo from '../assets/CommitLog-Logo.png'
import { CirclePlus } from 'lucide-react';
// ui-compoentn
import { Button } from "@/components/ui/button"
// link
import { useNavigate, Link } from 'react-router-dom';
// Import useAuth custom hook
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    // mx-auto only works if the element has a width or max-width set. Otherwise, it won't appear centered.
    <nav>
      <div className='flex flex-end'>
        {/* Logo */}
        <div className='mx-auto'>
          <img src={Logo} alt="CommitLog-Logo" className='w-50 my-5' />
        </div>

        {!isAuthenticated ? (
          // Show login/signup buttons for non-authenticated users
          <>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/signup')}

              // onClick={doSomething()} = "Do this NOW while rendering" ❌
              // Note: Functions without parameters - Can use direct reference
              // onClick={() => doSomething()} = "When clicked, THEN do this" ✅

            >
              Sign-up
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            
          </>
        ) : (
          // Show user menu and create button for authenticated users
          <>

            {/* Create blog button */}
            <div className='my-auto m-3 sm:mr-5 md:mr-7 lg:mr-10 cursor-pointer'>
              <Link to="/CreateBlog">
                <CirclePlus size={30} color='white' strokeWidth={3} className='mx-auto' />
                <p className='text-white size-sx hidden md:block'>create</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar