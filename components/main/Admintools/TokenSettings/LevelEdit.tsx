import React, { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useRouter } from 'next/router';
import Swal from "sweetalert2";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Spinner from '@/components/Spinner';

const requiredErrMsg = 'This field is required!';

const LevelEdit = () => {
    const { data: session } = useSession();
    const user = session?.user as User;
    const router = useRouter();
    const { id } = router.query;
    let levelId = "";
    if (typeof id === 'string' && id !== '') {
        levelId = id.toString();
    }
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [tokenAmount, setTokenAmount] = useState(0);
    const [tokenAmountError, setTokenAmountError] = useState('');

    const saveLevel = async () => {
        if (name == '') {
            setNameError('Name is required!');
        } else {
            setNameError('');
        }
        if (description == '') {
            setDescriptionError('Description is required!');
        } else {
            setDescriptionError('');
        }
        if (levelId != '' && nameError == '' && descriptionError == '' && tokenAmountError == '') {
            setIsSaving(true);
            const response = await fetch(`/api/levels/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    description: description,
                    tokenAmount: tokenAmount
                })
            });
    
            if (!response.ok) {
                setIsSaving(false);
                const { err } = await response.json();
                console.log(err)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err,
                })
                .then(() => {
                    setIsSaving(false);
                    console.log("Saving failed");
                })
                .catch(err => console.log(err));
            } else {
                const { success } = await response.json();
                if (success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        allowOutsideClick: false,
                        text: `Level was saved successfully!`,
                    }).then(() => {
                    }).catch(err => console.log(err));
                }
                setIsSaving(false);
            }
        }
    }

    const handleBackClick = () => {
        router.push('/dashboard/admin/tokensettings?tab=2');
    }

    const getLevel = async () => {
        if (levelId != '') {
            setIsLoading(true);
            const response = await fetch(`/api/levels/${id}`, {
                method: 'GET'
            });
    
            if (!response.ok) {
                setIsLoading(false);
                const { err } = await response.json();
                console.log(err)
            } else {
                const { level } = await response.json();
                if (level) {
                    setName(level.name);
                    setDescription(level.description);
                    setTokenAmount(level.tokenAmount);
                }
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        getLevel();
    }, []);

    return (
        <>
            <div className='flex justify-between items-center sticky top-0 bg-white z-10 pt-2 pb-4'>
                <div className='cursor-pointer flex items-center text-[20px] font-Inter font-bold lg:flex p-2' onClick={handleBackClick}>
                    <span className="flex"><KeyboardBackspaceIcon /></span>
                    <span className='font-Inter font-bold ml-[15px]'>Manage Token Settings</span>
                </div>
            </div>
            <div className="w-full flex justify-center">
            {
                isLoading ? 
                <div className='pt-[100px] grid grid-cols-1 gap-x-[100px]'>
                    <Spinner text="Loading..."/> 
                </div> :
                <div className="lg:w-2/3 w-full rounded-xl px-5 py-4 font-Inter">
                    <div className="py-[20px]">
                        <label className="font-semibold tracking-widest text-primary-black">
                            Title <span className="text-secondary-red">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full mt-[15px] border-secondary-gray border rounded-[8px] h-[48px] placeholder:text-[16px] pl-[16px] focus:outline-none focus:border-primary-blue focus:ring-primary-blue"
                            placeholder="Enter Text Here..."
                            id="name"
                            onChange={(e) => {
                                setName(e.target.value);
                                if (e.target.value == '') {
                                    setNameError('Name is required!');
                                } else {
                                    setNameError('');
                                }
                            }}
                            value={name}
                        ></input>
                        <p className='font-Inter text-sm text-secondary-red pt-2'>{nameError}</p>
                    </div>
                    <div className="py-[20px]">
                        <label className="font-semibold tracking-widest text-primary-black">
                            Description <span className="text-secondary-red">*</span>
                        </label>
                        <textarea rows={6} className="block p-3 mt-[15px] w-full text-[16px] text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-primary-blue focus:ring-primary-blue placeholder:text-[16px]"
                            placeholder="Write Description here..."
                            onChange={(e) => {
                                setDescription(e.target.value)
                                if (e.target.value == '') {
                                    setDescriptionError('Description is required!');
                                } else {
                                    setDescriptionError('');
                                }
                            }}
                            value={description}
                        ></textarea>
                        <p className='font-Inter text-sm text-secondary-red pt-2'>{descriptionError}</p>
                    </div>
                    <div className="py-[20px]">
                        <label className="font-semibold tracking-widest text-primary-black">
                            Tokens <span className="text-secondary-red">*</span>
                        </label>
                        <input
                            type="number"
                            className="w-full mt-[15px] border-secondary-gray border rounded-[8px] h-[48px] placeholder:text-[16px] pl-[16px] focus:outline-none focus:border-primary-blue focus:ring-primary-blue"
                            placeholder="Enter Number Here..."
                            id="tokenAmount"
                            onChange={(e) => {
                                setTokenAmount(parseInt(e.target.value));
                                if (e.target.value == '') {
                                    setTokenAmountError('Tokens is required!');
                                } else {
                                    setTokenAmountError('');
                                }
                            }}
                            value={tokenAmount}
                        ></input>
                        <p className='font-Inter text-sm text-secondary-red pt-2'>{tokenAmountError}</p>
                    </div>
                    <div className="flex items-center justify-end font-Inter font-bold py-6">
                        <button
                            className="text-primary-black background-transparent px-6 py-2 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={handleBackClick}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-primary-blue text-white active:bg-primary-blue px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            onClick={saveLevel}
                        >
                            {isSaving ? <Spinner text="Saving..." /> : "Save Changes"}
                        </button>
                    </div>
                </div>
            }
            </div>
        </>
    )
}

export default LevelEdit;