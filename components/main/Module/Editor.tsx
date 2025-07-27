import React, { useState } from 'react';
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
});

interface EditorProps {
    value: string | null | undefined;
    onChange: (data: string) => void;
    reset?: boolean;
}

const Editor = ({ value, onChange, reset}: EditorProps) => {
    const [editorData, setEditorData] = useState<string>(value ?? "");

    const handleEditorChange = (html: string) => {
        setEditorData(html);
        onChange(html);
    };

    return (
        <div className='sm:mt-[25px] mt-[10px]'>
            <div className='sm:mt-[25px] mt-[10px]'>
                <>
                    <RichTextEditor initialValue={value} onChange={handleEditorChange} reset={reset}/>
                    <input type="hidden" id="content" name="content" value={editorData} />
                </>

            </div>
        </div>
    );
}

export default Editor;
