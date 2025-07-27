import dynamic from 'next/dynamic';
import React, { useState } from 'react';

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
});

interface EditorProps {
    value: string,
    onChange: (data: string) => void;
    reset?: boolean;
}

const Editor = ({ value, onChange, reset }: EditorProps) => {
    const [editorData, setEditorData] = useState(value);

     const handleEditorChange = (html: string) => {
        setEditorData(html);
        onChange(html);
    };

    return (
        <div className='sm:mt-[35px] mt-[10px]'>
            <div className='sm:mt-[35px] mt-[10px] min-h-64'>
                    <>
                        <RichTextEditor initialValue={value} onChange={handleEditorChange} reset={reset}/>
                        <input type="hidden" id="content" name="content" value={editorData} />
                    </>

            </div>
        </div>
    );
}

export default Editor;
