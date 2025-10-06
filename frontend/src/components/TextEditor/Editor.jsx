import React from 'react'
import { Toggle } from "@/components/ui/toggle"
import { useEditor, EditorContent} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Menubar from './Menubar'
import TextAlign from '@tiptap/extension-text-align'

const Editor = () => {

    const editor = useEditor({
        extensions: [
          StarterKit,
          TextAlign.configure({
            types: ['heading', 'paragraph'],
          }),
        ], // define your extension array
        content: '<p>Hello World!</p>', //intital content
        editorProps: {
          attributes: {
            class: 'min-h-[156px] border rounded-md bg-zinc-800 py-2 px-3 text-white'
          }
        },
        
    })

  return (
    <div>
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default Editor
