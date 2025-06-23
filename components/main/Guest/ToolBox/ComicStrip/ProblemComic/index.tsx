import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Transition } from '@headlessui/react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Spinner from "@/components/Spinner";
import { ComicPanel, ComicStrip } from '@/types/comicstrip.type';
import dynamic from "next/dynamic";

const ComicStripEditor = dynamic(() => import("../ComicStripEditor"), {
  ssr: false,
});

const initialPanels: ComicPanel[] = [
    {
        thumbnail: '',
        thumbPubId: '',
        nodes: [],
        comments: [],
    },
    {
        thumbnail: '',
        thumbPubId: '',
        nodes: [],
        comments: [],
    },
    {
        thumbnail: '',
        thumbPubId: '',
        nodes: [],
        comments: [],
    },
    {
        thumbnail: '',
        thumbPubId: '',
        nodes: [],
        comments: [],
    },
]

const ProblemComicGenerator = ({
    data,
    updateData,
    isEditable
}: {
    data: ComicStrip | null | undefined,
    updateData: Function,
    isEditable: boolean
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [panels, setPanels] = useState<ComicPanel[]>([]);
    const [title, setTitle] = useState<string>('Problem Comic Strip');
    const [tempTitle, setTempTitle] = useState<string>('Problem Comic Strip');
    const [selectedPanel, setSelectedPanel] = useState<number>(0);

    useEffect(() => {
        setPanels(initialPanels);
    }, []);

    const onCloseBtnClicked = () => {
        setShowModal(false);
    }
    
    const updatePanel = (data: ComicPanel) => {
        let temp = [...panels];
        temp[selectedPanel] = data;
        setPanels(temp);
        updateData({
            title: title,
            panels: temp
        });
    }

    const handlePanelClick = (index: number) => {
        setSelectedPanel(index);
    }

    const handleAddPanel = () => {
        setPanels((prevPanels) => ([...prevPanels, {
            thumbnail: '',
            thumbPubId: '',
            nodes: [],
            comments: [],
        }]));
        updateData({
            title: title,
            panels: [...panels, {
                thumbnail: '',
                thumbPubId: '',
                nodes: [],
                comments: [],
            }]
        });
    }

    const handleRename = () => {
        setTempTitle(title);
        setIsEditingName(true);
    }

    const handleRenameConfirm = () => {
        setTempTitle(title);
        updateData({
            title: title,
            panels: panels
        });
        setIsEditingName(false);
    }

    const handleRenameCancel = () => {
        setTitle(tempTitle);
        setIsEditingName(false);
    }

    const handleTitleChange = (e: any) => {
        setTitle(e.target.value);
        updateData({
            title: title,
            panels: panels
        });
    }

    const onDragEnd = (result: any) => {
        if (!result.destination) return;
       
        const items = Array.from(panels);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        updateData({
            title: title,
            panels: items
        });

        setPanels(items);
        setSelectedPanel(result.destination.index);
    };

    return (
        <>
            <Transition
                show={showModal}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <div
                    className={
                        `fixed top-0 left-0 right-0 w-full flex 
                    justify-center items-center p-4 
                    overflow-x-hidden overflow-y-auto 
                    md:inset-0 h-[calc(100%-1rem)] max-h-full z-[41]`
                    }>
                    <div className="relative w-full max-w-3xl max-h-full">
                        <div className="relative bg-white rounded-lg shadow">
                            <button
                                type="button"
                                className={
                                    `absolute top-3 right-2.5 
                                text-gray-400 bg-transparent 
                                hover:bg-gray-200 hover:text-gray-900 
                                rounded-lg text-sm p-1.5 ml-auto inline-flex items-center`
                                }
                                onClick={onCloseBtnClicked}>
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd">
                                    </path>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="px-6 py-4 border-b rounded-t ">
                                <h3 className="text-base font-semibold text-gray-900 lg:text-xl">
                                    Tips for The Problem Comic Strip
                                </h3>
                            </div>
                            <div className="p-6">
                                <div>
                                    <p className="block mb-2 text-[#6F727A]">
                                    Working through your Problem Comic Strip. 
                                    This might take multiple iterations as you dig deeper to understand a problem better. Start off creating a visual of the problem you&#39;re thinking about. What is it? Is it back pain? You might start with an image of a throbbing back in the panel. Great start!
                                    </p>
                                    <p className="block mb-3 text-[#6F727A]">
                                    Who has the problem? 
                                    <br/>
                                    You probably have someone in mind…maybe it&#39;s you, or your grandparent. Add that character into your comic strip, either in the same panel or in a different one.
                                    </p>
                                    <p className="block mb-3 text-[#6F727A]">
                                    What triggers the problem? When/where does the problem happen? 
                                    <br/>
                                    Start to add images or captions to add context to the problem, such as on-the-job at a construction sight, playing with grandkids, or something else.
                                    </p>
                                    <p className="block mb-3 text-[#6F727A]">
                                    What is the Character doing when the problem happens?
                                    <br/>
                                    Maybe they are playing with grandkids on the playground and pushing them on the swings triggers it. How do they address it? What is the pain like? Caption or add images to convey its severity.
                                    </p>
                                    <p className="block mb-3 text-[#6F727A]">
                                    In another panel, show how the pain affects what they are in the middle of what they are doing. Do they keep working their 9-5 job despite the pain and pop an Advil? Do they have to stop playing with the grandkids and go home? Do they end up bedridden for a few days? How do they fix the issue right now? Are there other characters in your story that should be added to your comic, either because they help you out or because this pain affects other people in the mix?
                                    </p>
                                    <p className="block mb-3 text-[#6F727A]">
                                    Feel free to play around and change the Setting of your story, even if it&#39;s the same Problem. Or swap out a different Character experiencing the same problem.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
            <div className={`bg-gray-900 bg-opacity-50 fixed inset-0 z-40 ${!showModal ? "hidden" : ""}`}></div>
            <div className='pt-[60px] overflow-x-hidden overflow-y-auto md:-mx-12 sm:-mx-6 -mx-4 comicstrip-panel grid grid-cols-1 lg:grid-cols-12'>
                <div className="lg:col-span-2 col-span-1 h-inherit">
                    {
                        isEditable &&
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="panels">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="px-3 lg:h-full lg:overflow-y-scroll overflow-y-scroll overflow-x-auto lg:border-r-4 lg:border-r-[#424242] lg:block flex">
                                    {
                                        panels.map((panelItem: ComicPanel, index: number) => {
                                            return (
                                                <Draggable
                                                key={`panel-${index}`}
                                                draggableId={index.toString()}
                                                index={index}
                                                >
                                                {(provided) => (
                                                    <a 
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                        onClick={() => handlePanelClick(index)}
                                                        className={`relative h-[100px] xl:h-[130px] lg:w-auto min-w-[175px] w-[175px] flex items-center m-2 text-gray-900 border border-2 ${selectedPanel == index ? 'border-[#E5632B] selected-panel' : 'border-[#424242]'} hover:border-[#E5632B] lg:mt-20 font-ObelixPro stroke-text panel-item`}>
                                                        {
                                                            panelItem.thumbnail != '' ?
                                                            <img src={`${panelItem.thumbnail}`} className={`w-full h-full`}/> : 
                                                            <></>
                                                        }
                                                        <span className="absolute -right-2 -bottom-4 text-[28px] text-secondary-gray-1">{index + 1}</span>
                                                    </a>
                                                )}
                                                </Draggable>
                                            )
                                        })
                                    }
                                    {provided.placeholder}
                                    <a onClick={handleAddPanel} className="cursor-pointer flex items-center justify-center m-2 text-gray-900 lg:mt-5 h-[100px] xl:h-[130px]">
                                        <AddCircleIcon fontSize="large" />
                                    </a>
                                </div>
                            )}
                            </Droppable>
                        </DragDropContext>
                    }
                    {
                        !isEditable &&
                        <div className="px-3 lg:h-full lg:overflow-y-scroll overflow-y-scroll overflow-x-auto lg:border-r-4 lg:border-r-[#424242] lg:block flex">
                            {
                                panels.map((panelItem: ComicPanel, index: number) => {
                                    return (
                                        <a onClick={() => handlePanelClick(index)} key={`panel-${index}`} className={`relative h-[100px] xl:h-[130px] lg:w-auto min-w-[175px] w-[175px] flex items-center m-2 text-gray-900 border border-2 ${selectedPanel == index ? 'border-[#E5632B] selected-panel' : 'border-[#424242]'} hover:border-[#E5632B] lg:mt-20 font-ObelixPro stroke-text panel-item`}>
                                            {
                                                panelItem.thumbnail != '' ?
                                                <img src={`${panelItem.thumbnail}`} className={`w-full h-full`}/> : 
                                                <></>
                                            }
                                            <span className="absolute -right-2 -bottom-4 text-[28px] text-secondary-gray-1">{index + 1}</span>
                                        </a>
                                    )
                                })
                            }
                        </div>
                    }
                </div>

                <div className="lg:col-span-10 col-span-1 p-8 overflow-y-scroll h-inherit">
                    <div className='flex items-end'>
                        {
                            isEditingName ? 
                            <input type='text' className='px-1 w-auto rounded-md font-ObelixPro text-[28px] text-secondary-gray-1 stroke-text border border-2 border-[#616060]' name='comic-title' value={title} onChange={(e) => handleTitleChange(e)}/> :
                            <span className='truncate font-ObelixPro text-[28px] text-secondary-gray-1 stroke-text px-1'>{title}</span>
                        }
                        {
                            isEditable && (
                                isEditingName ?
                                    <>
                                        <span className='cursor-pointer font-Inter text-sm ml-4 text-[#616060]' onClick={handleRenameConfirm}>
                                            <a>Confirm</a>
                                        </span>
                                        <span className='cursor-pointer font-Inter text-sm ml-4 text-[#616060]' onClick={handleRenameCancel}>
                                            <a>Cancel</a>
                                        </span>
                                    </> :
                                    <span className='cursor-pointer font-Inter text-sm ml-4 text-[#616060]' onClick={handleRename}>
                                        <a>Rename</a>
                                    </span>
                            )
                        }
                    </div>
                    <div className='p-5 max-w-[1040px] m-auto'>
                        {
                            panels.length > 0 && 
                            <ComicStripEditor 
                                showTipsModal={setShowModal} 
                                updatePanel={updatePanel} 
                                panelData={panels} 
                                selectedPanel={selectedPanel}
                                isEditable={isEditable}
                                type={'Problem'}
                            />
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProblemComicGenerator;