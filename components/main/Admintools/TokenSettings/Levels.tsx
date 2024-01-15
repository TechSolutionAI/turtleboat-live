import React, { useState, useMemo, useEffect } from 'react'
import Spinner from "@/components/Spinner"
import { useRouter } from 'next/router';
import LevelsTable from './LevelsTable';

const Levels = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [levels, setLevels] = useState<any[]>([])

    const getLevels = async () => {
        setIsLoading(true);
        let levelList: any[] = [];
        const response = await fetch(`/api/levels`, {
            method: 'GET'
        });

        if (!response.ok) {
            setIsLoading(false);
            const { err } = await response.json();
            console.log(err)
        } else {
            const { levels } = await response.json();
            levelList = levels.map((level: any, index: number) => {
                let tokenItem = {
                    no: level.no,
                    name: level.name,
                    description: level.description,
                    tokenAmount: level.tokenAmount,
                    levelId: level._id
                }
                return tokenItem;
            })
            setLevels(levelList);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getLevels();
    }, []);

    const columns = useMemo(
        () => [
            {
                Header: "No",
                accessor: "no",
                isCenter: false,
                disableSortBy: true
            },
            {
                Header: "Title",
                accessor: "name",
                isCenter: false,
            },
            {
                Header: "Description",
                accessor: "description",
                isCenter: false,
            },
            {
                Header: "Tokens",
                accessor: "tokenAmount",
                isCenter: true,
            },
        ],
        []
    );

    return (
        <>
            <div className='pt-[75px]'>
                {
                    isLoading ?
                        <div className='pt-[100px] grid grid-cols-1 gap-x-[100px]'>
                            <Spinner text="Loading..."/> 
                        </div> :
                        <div className='shadow-md rounded-lg'>
                            <h2 className='font-Inter font-bold text-primary-black px-4 py-4 text-[18px]'>Levels</h2>
                            <LevelsTable columns={columns} data={levels} />
                        </div>
                }
            </div>
        </>
    );
}

export default Levels;