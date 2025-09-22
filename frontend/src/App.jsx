import { useEffect } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom'
import './App.css'
// Pages
import Home from './pages/Home' 
import CreateBlog from './pages/CreateBlog'
import Signup from './pages/Signup'
import Login from './pages/Login'

function App() {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const authStatus = searchParams.get('auth');
    const error = searchParams.get('error');
    
    if (authStatus === 'google_success') {
      console.log('Google OAuth authentication successful!');
      // Show success toast or notification
    }
    
    if (authStatus === 'github_success') {
      console.log('GitHub OAuth authentication successful!');
      // Show success toast or notification
    }
    
    if (error) {
      console.error('OAuth error:', error);
      // Show error message based on error type
      if (error.includes('google')) {
        console.error('Google OAuth failed');
      } else if (error.includes('github')) {
        console.error('GitHub OAuth failed');
      }
    }
  }, [searchParams]);

  return (
    <Routes>
      <Route default path="/" element={<Home />} />
      <Route path='/CreateBlog' element={<CreateBlog />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  )
}

export default App