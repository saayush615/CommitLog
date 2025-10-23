import { Routes, Route } from 'react-router-dom'
import './App.css'
// Pages
import Home from './pages/Home' 
import CreateBlog from './pages/CreateBlog'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ViewBlog from './pages/ViewBlog'
import Profile from './pages/Profile'

function App() {  

  return (
    <Routes>
      <Route default path="/" element={<Home />} />
      <Route path='/CreateBlog' element={<CreateBlog />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/blog/:id' element={<ViewBlog />} />
      <Route path='/profile' element={<Profile />} />
    </Routes>
  )
}

export default App