import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import './Editor.module.css'

interface EditorProps {
    value: string,
    onChange: (data: string) => void;
    register: Function
}

const Editor = ({ value, onChange, register }: EditorProps) => {
    const [editorData, setEditorData] = useState(value);

    useEffect(() => {
        setEditorData(value)
    }, [])

    const editorConfiguration = {
        placeholder: 'Enter Text Here...',
        minHeight: '400px',
        mediaEmbed: {
            previewsInData: true
        },
        link: {
            addTargetToExternalLinks: true
        },
        toolbar: ['heading', 'bold', 'italic', 'bulletedList', 'numberedList', 'insertTable', 'mediaEmbed', 'link', 'undo', 'redo']
    };

    // Handle image uploads to the server
    // const handleImageUpload = async (file: File): Promise<string> => {
    //     const formData = new FormData();
    //     formData.append('file', file);

    //     const res = await fetch('/api/uploadimage', {
    //         method: 'POST',
    //         body: formData,
    //     });

    //     const data = await res.json();
    //     return data.url;
    // };

    const handleEditorChange = (event: any, editor: any) => {
        const data = editor.getData();
        setEditorData(data);
        onChange(data);
    };

    return (
        <div className='sm:mt-[35px] mt-[10px]'>
            <div className='sm:mt-[35px] mt-[10px] min-h-64'>
                <>
                    <CKEditor
                        editor={ClassicEditor}
                        config={editorConfiguration}
                        // onReady={(editor) => {
                        //     // Configure the file upload adapter
                        //     editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                        //         return new ImageUploadAdapter(loader, handleImageUpload);
                        //     };
                        // }}
                        onChange={handleEditorChange}

                        data={editorData}
                    />
                    <input type="hidden" id="content" {...register("content")} name="content" value={editorData} />
                </>

            </div>
        </div>
    );
}

// class ImageUploadAdapter {
//     private loader: any;
//     private handleImageUpload: (file: File) => Promise<string>;

//     constructor(loader: any, handleImageUpload: (file: File) => Promise<string>) {
//         this.loader = loader;
//         this.handleImageUpload = handleImageUpload;
//     }

//     async upload(): Promise<{ default: string }> {
//         const file = await this.loader.file;

//         // Call the handleImageUpload function to upload the image
//         const url = await this.handleImageUpload(file);

//         return {
//             default: url,
//         };
//     }

//     abort() {
//         // This is not implemented, but required by the interface
//     }
// }

export default Editor;
