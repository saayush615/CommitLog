import React, { useState ,useEffect} from 'react'
// Components
import Layout from '../components/Layout'
import Card from '../components/Card'
import { Spinner } from "@/components/ui/spinner"
// Icons
import { Minus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import axios from 'axios';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/blog/read`);
        if(response.data.success){
          setBlogs(response.data.blogs);
          // console.log(response.data.blogs)
        }
      } catch (err) {
        // console.log(err.response.data);
        toast.error('Failed to load blog', {
            position: "top-right",
            autoClose: 5000,
            theme: "dark",
            transition: Bounce,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  },[])

  if(loading) {
    return (
        <div className="flex justify-center items-center min-h-[400px]">
            <Spinner className='text-white' />
            <div className="text-white text-lg m-2">Loading...</div>
        </div>
    );
  }
  

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
      {blogs.map((blog) => (
        <Card 
          key={blog._id} 
          blogId={blog._id}
          title={blog.title} 
          content={blog.content} 
          username={blog.author.username} 
          publishdate={blog.updatedAt} 
          likesCount={blog.likesCount}
          commentsCount={blog.commentsCount}
          isProfile={false} 
        />
      ))
      }
      
    </Layout>
  )
}

export default Home