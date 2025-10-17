import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Editor from '../components/TextEditor/Editor'
import { Button } from "@/components/ui/button"
import TitleEditor from '../components/TextEditor/TitleEditor'
import axios from 'axios';
// React-tostify
import { ToastContainer, toast, Bounce } from 'react-toastify';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePostBlog = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required! ', {
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
      return 
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/blog/create`,
        { title, content },
        { withCredentials: true }
      )

      if (response.data.success) {
        navigate('/?blog=post_success')
      }
    } catch(error) {
      toast.error(error.response?.data?.error || 'Failed to post blog!', {
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
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className='max-w-3xl mx-auto md:py-4'>
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
        <TitleEditor title={title} setTitle={setTitle} />
        <Editor content={content} setContent={setContent} />
        <Button 
          variant="outline" 
          className='bg-gray-800 border-2 border-white text-white cursor-pointer my-3'
          onClick={handlePostBlog}
          disabled={isLoading}
        >
          {isLoading ? 'Posting...' : 'Post'}
        </Button>
      </div>
      
    </div>
  )
}

export default CreateBlog
