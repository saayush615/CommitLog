import React from 'react'
import Editor from '../components/TextEditor/Editor'
import { Button } from "@/components/ui/button"

const CreateBlog = () => {
  return (
    <div>
      <div className='max-w-3xl mx-auto py-8'>
        <Editor />
        <Button variant="outline" className='bg-gray-800 border-2 border-white text-white cursor-pointer my-3'>Post</Button>
      </div>
      
    </div>
  )
}

export default CreateBlog
