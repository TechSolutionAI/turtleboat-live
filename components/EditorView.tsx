import React, { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface EditorProps {
    value: string
}

const EditorView = ({ value }: EditorProps) => {
    const editorRef = useRef();
    const [editorData, setEditorData] = useState(value);

    useEffect(() => {
        setEditorData(value)
    }, [])

    const editorConfiguration = {
        readOnly: true,
        mediaEmbed: {
            previewsInData: true
        }
    };

    const handleEditorReady = (editor: any) => {
        editor.setData(editorData);
        editorRef.current = editor;
    };

    return (
        <div className='px-0 viewer'>
            <div className='readonly-editor'>
                <>
                    <CKEditor
                        editor={ClassicEditor}
                        config={{
                            toolbar: [],
                            link: {
                                addTargetToExternalLinks: true,
                            }
                        }}
                        onReady={handleEditorReady}
                        disabled={true}
                        data={""}
                    />
                </>

            </div>
        </div>
    );
}

export default EditorView;
