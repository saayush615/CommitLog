import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Card from './components/Card'
import { Minus } from 'lucide-react';

function App() {

  return (
    <>
      <Sidebar />
      <Navbar />
      <div className='ml-32 p-10'>
        {/* Categoty */}
        <div className='mb-10'>
          <Minus strokeWidth={5} className='ml-3' />
          <p className='text-white font-sans text-lg'>Latest</p>
        </div>
        <Card />
        <Card />
        <Card />
      </div>
    </>
  )
}

export default App
