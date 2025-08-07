"use client"
import { generateHTML } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { FontFamily } from '@tiptap/extension-text-style'
import parse from 'html-react-parser'


const extensions = [
  StarterKit,
  Highlight,
  TextStyle,
  FontFamily,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
]

export default function PostContent({ post }) {
  const html = generateHTML(post.post, extensions)

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 text-gray-900 dark:text-gray-100">
         <article className="prose dark:prose-invert max-w-none break-words">
        {parse(html)}
      </article>
    </main>
  )
}
