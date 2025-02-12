"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import CodeBlock from "@tiptap/extension-code-block";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";

const TextEditor = ({ onChange }: { onChange: (content: string) => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Heading.configure({ levels: [1, 2] }),
      BulletList,
      OrderedList,
      ListItem,
      CodeBlock,
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
    ],
    content: "<p>Escreva aqui e cole imagens (Ctrl + V)</p>",
    editorProps: {
      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (const item of items) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                const url = reader.result as string;
                view.dispatch(
                  view.state.tr.replaceSelectionWith(
                    view.state.schema.nodes.image.create({ src: url })
                  )
                );
                onChange(editor?.getHTML() || "");
              };
              reader.readAsDataURL(file);
            }
            return true;
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editor.on("update", () => {
        onChange(editor.getHTML());
      });
    }
  }, [editor, onChange]);

  if (!editor) return null;

  const setLink = () => {
    const url = prompt("Digite a URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
    }
  };

  return (
    <div className="border rounded-lg p-4">
      {/* Toolbar */}
      <div className="flex gap-2 border-b pb-2 mb-2 flex-wrap">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 border rounded ${editor.isActive("bold") ? "bg-gray-300" : ""}`}
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 border rounded ${editor.isActive("italic") ? "bg-gray-300" : ""}`}
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 border rounded ${editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : ""}`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 border rounded ${editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""}`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 border rounded ${editor.isActive("bulletList") ? "bg-gray-300" : ""}`}
        >
          • Lista
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 border rounded ${editor.isActive("orderedList") ? "bg-gray-300" : ""}`}
        >
          1. Lista
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-2 py-1 border rounded ${editor.isActive("codeBlock") ? "bg-gray-300" : ""}`}
        >
          &lt;/&gt;
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`px-2 py-1 border rounded ${editor.isActive({ textAlign: "left" }) ? "bg-gray-300" : ""}`}
        >
          ⬅️
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`px-2 py-1 border rounded ${editor.isActive({ textAlign: "center" }) ? "bg-gray-300" : ""}`}
        >
          ⏺
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`px-2 py-1 border rounded ${editor.isActive({ textAlign: "right" }) ? "bg-gray-300" : ""}`}
        >
          ➡️
        </button>
        <button onClick={setLink} className="px-2 py-1 border rounded">
          🔗 Link
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="min-h-[150px]" />
    </div>
  );
};

export default TextEditor;
