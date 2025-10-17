import React, { useEffect} from 'react'
// Components
import Layout from '../components/Layout'
import Card from '../components/Card'
// Icons
import { Minus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom'
import { ToastContainer, toast, Bounce } from 'react-toastify';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();  //  lets you read and update the query string parameters in the URL

  useEffect(() => {
    // suppose url is http://localhost:3000/?auth=google_success&error=none
    const authStatus =  searchParams.get('auth');
    if (authStatus === 'login_success' || authStatus === 'github_success' || authStatus === 'google_success' ) {
      toast.success('Login Successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
      });

      // Clean up the URL parameter after showing toast
      setSearchParams({});
    }

    const blogStatus =  searchParams.get('blog');
    if (blogStatus === 'post_success') {
      toast.success('Blog posted successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      })

      setSearchParams({});
    }
  }, [searchParams, setSearchParams])
  

  return (
    <Layout>

      {/* Notofication */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />

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