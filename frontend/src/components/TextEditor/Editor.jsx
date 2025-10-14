import React, { useEffect } from 'react'
import { Toggle } from "@/components/ui/toggle"
import { useEditor, EditorContent} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Menubar from './Menubar'
import TextAlign from '@tiptap/extension-text-align'

const Editor = ({ content, setContent }) => {

    const editor = useEditor({
        extensions: [
          TextAlign.configure({
            types: ['heading', 'paragraph'],
          }),
          StarterKit.configure({
            openOnClick: false,
            autolink: true,
            defaultProtocol: 'https',
            protocols: ['http', 'https'],
            isAllowedUri: (url, ctx) => {
              try {
                // construct URL
                const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

                // use default validation
                if (!ctx.defaultValidate(parsedUrl.href)) {
                  return false
                }

                // disallowed protocols
                const disallowedProtocols = ['ftp', 'file', 'mailto']
                const protocol = parsedUrl.protocol.replace(':', '')

                if (disallowedProtocols.includes(protocol)) {
                  return false
                }

                // all checks have passed
                return true
              } catch {
                return false
              }
            },
            shouldAutoLink: url => {
              try {
                // construct URL
                const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

                // only auto-link if the domain is not in the disallowed list
                const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
                const domain = parsedUrl.hostname

                return !disallowedDomains.includes(domain)
              } catch {
                return false
              }
            },
          }),
        ], // define your extension array
        content: '', //intital content
        editorProps: {
          attributes: {
            class: 'min-h-[606px] max-h-[606px] overflow-y-auto border rounded-md bg-zinc-800 py-2 px-3 text-white focus:outline focus:outline-white'
          }
        },
        onUpdate: ({ editor }) => {
          const html = editor.getHTML();
          const text = editor.getText();
          console.log('HTML Content:', html);
          // console.log('Text Content:', text);
        }
        
    })

  return (
    <div>
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default Editor
