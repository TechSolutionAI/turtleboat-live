import React, { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface EditorProps {
    value: string,
    onChange: (data: string) => void;
}

const Editor = ({ value, onChange }: EditorProps) => {
    const editorRef = useRef();
    const [editorData, setEditorData] = useState(value);

    useEffect(() => {
        setEditorData(value)
    }, [value])

    const editorConfiguration = {
        placeholder: 'Enter Text Here...',
        minHeight: '400px',
        mediaEmbed: {
            previewsInData: true
        },
        toolbar: ['heading', 'bold', 'italic', 'bulletedList', 'numberedList', 'insertTable', 'mediaEmbed', 'link', 'undo', 'redo'],
        link: {
            addTargetToExternalLinks: true,
        }
    };

    const handleEditorChange = (event: any, editor: any) => {
        const data = editor.getData();
        setEditorData(data);
        onChange(data);
    };

    const handleEditorReady = (editor: any) => {
        editor.setData(editorData);
        editorRef.current = editor;
    };

    return (
        <div className='sm:mt-[35px] mt-[10px]'>
            <div className='sm:mt-[35px] mt-[10px] min-h-64'>
                    <>
                        <CKEditor
                            editor={ClassicEditor}
                            config={editorConfiguration}
                            onChange={handleEditorChange}
                            onReady={handleEditorReady}
                            data={editorData}
                        />
                        <input type="hidden" id="content" name="content" value={editorData} />
                    </>

            </div>
        </div>
    );
}

export default Editor;
