"use client"
import { Bold, Italic, Strikethrough, Type, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Highlighter, Heading1, Heading2, Heading3, CircleOff, ChevronDown } from 'lucide-react';
import React from 'react'
import { useState } from 'react';

const MenuBar = ({ editor }) => {

  const [showFonts, setShowFonts] = useState(false);

  const toggleFonts = () => setShowFonts(!showFonts);


  if (!editor) {
    return null
  }


  return (
    <div className="sticky top-20 z-50 control-group">
      <div className=" flex flex-wrap gap-2 p-3 border rounded-xl mb-6 bg-white dark:bg-zinc-900 dark:border-zinc-700 shadow-sm">
        {[1, 2, 3].map((level) => {
          const HeadingIcon = [Heading1, Heading2, Heading3][level - 1]
          return (
            <button
              key={level}
              title={`Heading ${level}`}
              onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
              className={`p-2 rounded-lg transition-all duration-150 hover:bg-blue-50 dark:hover:bg-zinc-700 ${editor.isActive('heading', { level }) ? 'bg-blue-100 dark:bg-zinc-700 scale-105' : ''
                }`}
            >
              <HeadingIcon size={18} />
            </button>
          )
        })}

        <button
          title="Paragraph"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-zinc-700 transition ${editor.isActive('paragraph') ? 'bg-blue-100 dark:bg-zinc-700 scale-105' : ''
            }`}
        >
          <CircleOff size={18} />
        </button>

        {[
          { action: 'toggleBold', icon: Bold, name: 'bold' },
          { action: 'toggleItalic', icon: Italic, name: 'italic' },
          { action: 'toggleStrike', icon: Strikethrough, name: 'strike' },
          { action: 'toggleHighlight', icon: Highlighter, name: 'highlight' },
        ].map(({ action, icon: Icon, name }) => (
          <button
            key={name}
            title={name.charAt(0).toUpperCase() + name.slice(1)}
            onClick={() => editor.chain().focus()[action]().run()}
            className={`p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-zinc-700 transition ${editor.isActive(name) ? 'bg-blue-100 dark:bg-zinc-700 scale-105' : ''
              }`}
          >
            <Icon size={18} />
          </button>
        ))}

        {[
          { align: 'left', icon: AlignLeft },
          { align: 'center', icon: AlignCenter },
          { align: 'right', icon: AlignRight },
          { align: 'justify', icon: AlignJustify },
        ].map(({ align, icon: Icon }) => (
          <button
            key={align}
            title={`Align ${align}`}
            onClick={() => editor.chain().focus().setTextAlign(align).run()}
            className={`p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-zinc-700 transition ${editor.isActive({ textAlign: align }) ? 'bg-blue-100 dark:bg-zinc-700 scale-105' : ''
              }`}
          >
            <Icon size={18} />
          </button>
        ))}

        <button
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-zinc-700 transition ${editor.isActive('bulletList') ? 'bg-blue-100 dark:bg-zinc-700 scale-105' : ''
            }`}
        >
          <List size={18} />
        </button>
        <button
          title="Ordered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-zinc-700 transition ${editor.isActive('orderedList') ? 'bg-blue-100 dark:bg-zinc-700 scale-105' : ''
            }`}
        >
          <ListOrdered size={18} />
        </button>

        <div className="relative">
          <button
            onClick={toggleFonts}
            className="flex items-center gap-1 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-zinc-700 transition"
            title="Font Family"
          >
            <Type size={18} /> <ChevronDown size={16} />
          </button>
          {showFonts && (
            <div className="absolute w-48 top-10 left-0 z-20 bg-white dark:bg-zinc-900 border dark:border-zinc-700 p-1 shadow-md rounded-md flex flex-col overflow-hidden">
              {[
                { label: 'Unset', value: '', class: 'text-red-500' },
                { label: 'Inter', value: 'Inter' },
                { label: 'Serif', value: 'serif' },
                { label: 'Monospace', value: 'monospace' },
                { label: 'Cursive', value: 'cursive' },
                { label: 'Poppins', value: 'Poppins' },
                { label: 'Exo 2', value: 'Exo 2' },
                { label: 'Comic Sans', value: 'Comic Sans MS' },
                { label: 'Winky Rough', value: 'Winky Rough' },
                { label: 'Poetsen One', value: 'Poetsen One' },
                { label: 'Special Gothic', value: 'Special Gothic Expanded One' },
                { label: 'Rubik Glitch', value: 'Rubik Glitch' },
              ].map(({ label, value, class: extra = '' }) => (
                <button
                  key={label}
                  onClick={() =>
                    value
                      ? editor.chain().focus().setFontFamily(value).run()
                      : editor.chain().focus().unsetFontFamily().run()
                  }
                  className={`text-left px-3 py-1 w-full hover:bg-blue-50 dark:hover:bg-zinc-700 ${extra}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

}

export default MenuBar

