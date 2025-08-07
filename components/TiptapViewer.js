'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

export default function TiptapViewer({ content }) {
  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit,
      Image,
      Link,
    ],
    content, // JSON from database
  });

  if (!editor) return null;

  return (
    <div className="prose dark:prose-invert max-w-none">
      <EditorContent editor={editor} />
    </div>
  );
}
