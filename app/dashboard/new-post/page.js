"use client"
import { useSession } from 'next-auth/react'
import MenuBar from '@/components/MenuBar'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { useState, useEffect } from 'react'
import { FontFamily, TextStyle } from '@tiptap/extension-text-style'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SubtleSpinner } from '@/components/SubtleSpinner'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const Tiptap = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [post, setPost] = useState()
  const [mounted, setMounted] = useState(false)



  useEffect(() => {
    setMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3"
          }
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3"
          }
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      TextStyle
    ],
    content: post,
    editorProps: {
      attributes: {
        class: "md:min-h-[50vh] min-h-[40vh] border rounded-md bg-slate-50 dark:bg-zinc-900 text-black dark:text-white py-2 px-3 focus:outline-none",
      }
    },
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      setPost(editor.getJSON())
    }
  })


  console.log()


  const handleSubmit = async () => {
    if (!title || !subject || !post || editor.isEmpty) {
      toast.error("Please fill all fields.")
      return
    }
    try {
      const data = await fetch(`/api/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, subject, post, id: session.user.id }),
      });
      const info = await data.json()
      console.log(info)
      setTitle("")
      setSubject("")
      editor.commands.clearContent();
      toast.success("Post successfull")
      router.push("/dashboard")
      
    } catch (error) {
      toast.error("Something went wrong!")
    }

  }


  if (!mounted || !editor) return null;


  if (status === "unauthenticated") {

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          You&lsquo;re not logged in
        </h1>
        <Link href="/login">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
            Go to Login
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    );
  }

  if (status === "loading" || status == "unauthenticated") {
    return <SubtleSpinner />
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100">
      <div className="max-w-4xl mx-auto p-6 pb-32 space-y-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">Create New Post</h1>

        {/* Title and Subject */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Subject (More than 27 words)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Editor */}
        <div className="mt-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-4">
          <MenuBar editor={editor} />
          <EditorContent editor={editor} />

        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2  rounded-md transition shadow-md"
          >
            Publish Post
          </button>
        </div>
      </div>
    </div >

  )
}

export default Tiptap