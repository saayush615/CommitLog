import React from 'react'
import StarterKit from '@tiptap/starter-kit'
import { CharacterCount } from '@tiptap/extensions'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'

const TitleEditor = ({ title, setTitle }) => {

  const limit = 120; // Character limit for 2 lines

    const editor = useEditor({
        extensions: [ 
            StarterKit.configure({
                heading: false, // Disable heading to prevent h1 wrapper
                bold: false,
                italic: false,
                strike: false,
                code: false,
                codeBlock: false,
                blockquote: false,
                horizontalRule: false,
                bulletList: false,
                orderedList: false,
                listItem: false,
                hardBreak: false, // Disable hard breks (Shift+Enter), donot change paragraph put <br>
                paragraph: true, // Keep paragraphs for text
            }),
            CharacterCount.configure({
              limit,
            })
        ],
        content: title || '', // Empty initial content
        editorProps: {
            attributes: {
                class: 'text-3xl font-bold text-white bg-zinc-800 rounded rounded-md border p-3 placeholder:text-gray-400 focus:outline-2 focus:outline-white min-h-24 leading-6',
            },
            handleKeyDown: (view, event) => {
                // Prevent Enter key from creating new paragraphs
                // console.log(event);
                // console.log(view);
                if (event.key === 'Enter') {
                    event.preventDefault();  // This stops the browser's default behavior, which would normally insert a new paragraph or line break in the editor. 
                    return true;
                }
                return false;
            },
        },
        onUpdate: ({ editor }) => {
            // Double check and truncate if somehow exceeded
            const currentText = editor.getText();
            if (currentText.length > limit) {
                const truncated = currentText.substring(0, limit);
                editor.commands.setContent(truncated);
                return;
            }
            
            const text = editor.getText();
            setTitle(text);
        }

    })

    const { charactersCount, wordsCount } = useEditorState({
      editor,
      selector: context => ({
        charactersCount: context.editor?.storage.characterCount.characters() || 0,
        wordsCount: context.editor?.storage.characterCount.words() || 0,
      }),
    })

    if (!editor) {
      return null
    }

    const isAtLimit = charactersCount >= limit;

  return (
    <div className="title-editor mb-2">
      <EditorContent editor={editor} />
      {editor && (
        <div className="text-xs mt-1 flex justify-between">
          <span className={`${isAtLimit ? 'text-red-400' : 'text-gray-400'}`}>
            {charactersCount} / {limit} characters
          </span>
          <span className="text-gray-400">Max 2 lines</span>
        </div>
      )}
    </div>
  )
}

export default TitleEditor