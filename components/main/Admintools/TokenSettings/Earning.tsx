import React, { useState, useMemo, useEffect } from 'react'
import Spinner from "@/components/Spinner"
import { useRouter } from 'next/router';
import ActionsTable from './ActionsTable';

const Earning = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [tokenActions, setTokenActions] = useState<any[]>([])

    const getTokenActions = async () => {
        setIsLoading(true);
        let tokenList: any[] = [];
        const response = await fetch(`/api/tokensettings`, {
            method: 'GET'
        });

        if (!response.ok) {
            setIsLoading(false);
            const { err } = await response.json();
            console.log(err)
        } else {
            const { tokens } = await response.json();
            tokenList = tokens.map((token: any, index: number) => {
                let tokenAction = {
                    no: token.no,
                    name: token.name,
                    tokenAmount: token.tokenAmount,
                    tokenId: token._id
                }
                return tokenAction;
            })
            setTokenActions(tokenList);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getTokenActions();
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
                Header: "Tokens Earned",
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
                            <h2 className='font-Inter font-bold text-primary-black px-4 py-4 text-[18px]'>Actions</h2>
                            <ActionsTable columns={columns} data={tokenActions} />
                        </div>
                }
            </div>
        </>
    );
}

export default Earning;