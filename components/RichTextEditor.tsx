"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css"; // Include styles

interface RichTextEditorProps {
    initialValue?: string | null | undefined;
    onChange?: (html: string) => void;
    editable?: boolean;
    reset?: boolean;
}


const RichTextEditor = ({initialValue, onChange, editable = true, reset}: RichTextEditorProps) => {
  const { quill, quillRef } = useQuill({
    modules: !editable
      ? { toolbar: false } // Disable toolbar
      : {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ align: [] }],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],
            ['clean'],
          ],
        },
    placeholder: 'Start typing...',
    readOnly: !editable
  });

  const hasSetInitialValue = useRef(false);
  
  useEffect(() => {
    if (!quill || !quillRef?.current) return;
    
      // Set initial value only once
    if (!hasSetInitialValue.current) {
      quill.clipboard.dangerouslyPasteHTML((initialValue ?? "").toString());
      hasSetInitialValue.current = true;
    }

    const handleChange = () => {
      if (onChange) {
        onChange(quill.root.innerHTML);
      }
    };

    quill.on("text-change", handleChange);

    return () => {
      quill.off("text-change", handleChange);
    };
  }, [quill, initialValue, onChange]);

  useEffect(() => {
    if (reset && quill) {
      quill.setText("");
      if (onChange) onChange("");
    }
  }, [reset, quill, onChange]);

  return (
    <div className={`w-full ${editable ? "bg-white" : "bg-transparent"}`}>
      <div ref={quillRef} className={`${editable? "min-h-[120px]":""} `}/>
    </div>
  );
};

export default RichTextEditor;
