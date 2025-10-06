import React from 'react'

import { Toggle } from "@/components/ui/toggle"

import { 
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Bold,
  Italic,
  Strikethrough,
  Underline,
  TextAlignStart,
  TextAlignCenter,
  TextAlignEnd,
  List,
  ListOrdered,
  Code,
  Quote,
  Minus,
  Link
} from 'lucide-react';


const Menubar = ({ editor }) => {
    if (!editor) {
    return null
  }

  return (
    <div className="control-group">
      <div className="button-group border rounded-md p-1 mb-1 bg-zinc-900 space-x-2 z-50 text-white">
        <Toggle 
          pressed={editor.isActive('heading', { level: 1 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className='hover:text-black cursor-pointer'
        >
          <Heading1 className='h-4 w-4'/>
        </Toggle>
        
        <Toggle 
          pressed={editor.isActive('heading', { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className='hover:text-black cursor-pointer'
        >
          <Heading2 className='h-4 w-4'/>
        </Toggle>
        
        <Toggle 
          pressed={editor.isActive('heading', { level: 3 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className='hover:text-black cursor-pointer'
        >
          <Heading3 className='h-4 w-4'/>
        </Toggle>
        
        <Toggle 
          pressed={editor.isActive('heading', { level: 4 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className='hover:text-black cursor-pointer'
        >
          <Heading4 className='h-4 w-4'/>
        </Toggle>
        
        <Toggle 
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          className='hover:text-black cursor-pointer'
        >
          <Bold className='h-4 w-4'/>
        </Toggle>
        
        <Toggle 
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          className='hover:text-black cursor-pointer'
        >
          <Italic className='h-4 w-4'/>
        </Toggle>
        
        <Toggle 
          pressed={editor.isActive('underline')}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          className='hover:text-black cursor-pointer'
        >
          <Underline className='h-4 w-4'/>
        </Toggle>
        
        <Toggle 
          pressed={editor.isActive('strike')}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          className='hover:text-black cursor-pointer'
        >
          <Strikethrough className='h-4 w-4'/>
        </Toggle>
        
        <Toggle 
          pressed={editor.isActive({ textAlign: 'left' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
          className='hover:text-black cursor-pointer'
        >
          <TextAlignStart className='h-4 w-4'/>
        </Toggle>
        
        <Toggle 
          pressed={editor.isActive({ textAlign: 'center' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
          className='hover:text-black cursor-pointer'
        >
          <TextAlignCenter className='h-4 w-4'/>
        </Toggle>
        
        <Toggle 
          pressed={editor.isActive({ textAlign: 'right' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
          className='hover:text-black cursor-pointer'
        >
          <TextAlignEnd className='h-4 w-4'/>
        </Toggle>
        
        <Toggle 
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          className='hover:text-black cursor-pointer'
        >
          <List className='h-4 w-4'/>
        </Toggle>
        
        <Toggle 
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          className='hover:text-black cursor-pointer'
        >
          <ListOrdered className='h-4 w-4'/>
        </Toggle>
        
        <Toggle 
          pressed={editor.isActive('codeBlock')}
          onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
          className='hover:text-black cursor-pointer'
        >
          <Code className='h-4 w-4'/>
        </Toggle>
        
        <Toggle 
          pressed={editor.isActive('blockquote')}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          className='hover:text-black cursor-pointer'
        >
          <Quote className='h-4 w-4'/>
        </Toggle>
        
        <button 
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className='hover:text-black hover:bg-white cursor-pointer h-10 px-3 py-2 inline-flex items-center justify-center rounded-md'
        >
          <Minus className='h-4 w-4'/>
        </button>
        
        <Toggle 
          pressed={editor.isActive('link')}
          onPressedChange={() => {
            // Add your link toggle logic here
            const url = window.prompt('Enter URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className='hover:text-black cursor-pointer'
        >
          <Link className='h-4 w-4'/>
        </Toggle>
      </div>
    </div>
  )
}

export default Menubar
