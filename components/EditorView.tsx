import React from 'react';
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
});

interface EditorProps {
    value: string | null | undefined
}

const EditorView = ({ value }: EditorProps) => {

    return (
        <div className='px-0 viewer'>
            <div className='readonly-editor'>
                <>
                    <RichTextEditor initialValue={value} editable={false}/>
                </>

            </div>
        </div>
    );
}

export default EditorView;
