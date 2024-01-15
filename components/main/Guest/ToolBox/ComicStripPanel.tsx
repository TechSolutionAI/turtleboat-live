import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ComicPanel, ComicStrip } from "@/types/comicstrip.type";

const initialPanels: ComicPanel[] = [
    {
        thumbnail: '',
        thumbPubId: '',
        nodes: [],
    },
    {
        thumbnail: '',
        thumbPubId: '',
        nodes: [],
    },
    {
        thumbnail: '',
        thumbPubId: '',
        nodes: [],
    },
    {
        thumbnail: '',
        thumbPubId: '',
        nodes: [],
    },
]

const ComicStripPanel = ({
    type,
    data,
    ventureId,
    memberType
}: {
    type?: String,
    data?: ComicStrip | null | undefined,
    ventureId?: String,
    memberType: String
}) => {
    const router = useRouter();
    const [panels, setPanels] = useState<ComicPanel[] | null | undefined>(initialPanels);
    const [isNew, setIsNew] = useState<boolean>(true);

    useEffect(() => {
        if (data != null && data != undefined) {
            setPanels(data.panels);
            setIsNew(false);
        }
    }, []);

    const handleEditComicStrip = () => {
        // if (type == 'Problem') {
        //     router.push(`/dashboard/toolbox/comicstrip/${ventureId}?tab=0`);
        // } else if (type == 'Solution') {
        //     router.push(`/dashboard/toolbox/comicstrip/${ventureId}?tab=1`);
        // }
    }

    return (
        <div className="w-full relative shadow-md font-Inter rounded-lg px-6 py-5">
            <h2 className='truncate text-lg font-bold font-Inter'>{type} Comic Strip</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-[30px] gap-x-8 pt-8">
                {
                    panels != undefined && panels != null && panels.map((panelItem: ComicPanel, index: number) => {
                        return (
                            <div key={`panel-${index}`} className='flex items-center justify-center'>
                                <div className='h-[240px] w-[240px] shadow-md bg-[#ffea79] flex items-center justify-center'>
                                    {
                                        panelItem.thumbnail != '' &&
                                        <img src={panelItem.thumbnail} alt={data?.title}/>
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className="pt-5 flex justify-end font-Inter">
                <button
                    className="text-sm bg-primary-blue text-white active:bg-primary-blue px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleEditComicStrip}
                >
                    {
                        memberType == 'mentee' ? 
                        isNew ? 'New comic strip' : 'Edit comic strip' :
                        'View comic strip'
                    }
                </button>
            </div>
        </div>
    )
}

export default ComicStripPanel;