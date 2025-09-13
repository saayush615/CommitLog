import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home' 
import CreateBlog from './pages/CreateBlog'

function App() {
  return (
    <Routes>
      <Route default path="/" element={<Home />} />
      <Route path='/CreateBlog' element={<CreateBlog />} />
    </Routes>
  )
}

export default App