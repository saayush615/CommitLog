import { Routes, Route } from 'react-router-dom'
import './App.css'
// Pages
import Home from './pages/Home' 
import CreateBlog from './pages/CreateBlog'
import Signup from './pages/Signup'
import Login from './pages/Login'

function App() {  

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