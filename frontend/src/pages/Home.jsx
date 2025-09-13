import React from 'react'
// Components
import Layout from '../components/Layout'
import Card from '../components/Card'
// Icons
import { Minus } from 'lucide-react';

const Home = () => {
  return (
    <Layout>
      {/* Category */}
      <div className='mb-10'>
        <Minus strokeWidth={5} className='ml-3' />
        <p className='text-white font-sans text-lg'>Latest</p>
      </div>
      <Card />
      <Card />
      <Card />
    </Layout>
  )
}

export default Home