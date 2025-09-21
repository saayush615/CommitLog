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
    // Handle OAuth success/error from URL parameters
    const authStatus = searchParams.get('auth');
    const error = searchParams.get('error');
    
    if (authStatus === 'success') {
      // Show success message or redirect
      console.log('OAuth authentication successful!');
      // You could show a toast notification here
    }
    
    if (error) {
      console.error('OAuth error:', error);
      // Show error message to user
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