import React, { useState, useMemo, useEffect } from 'react'
import Spinner from "@/components/Spinner"
import { useRouter } from 'next/router';
import TokensTable from './TokensTable';

const HowToEarnToken = () => {
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
                    description: token.description,
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
        document.title = "How To Earn Tokens - Turtle Boat"
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
                Header: "Activity",
                accessor: "name",
                isCenter: false,
            },
            {
                Header: "Description",
                accessor: "description",
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
            <label className={"font-Inter font-bold text-[20px] sm:text-[30px] text-primary-black mt-[100px] leading-tight"}>
                How to Earn Tokens
            </label>
            <p className={"mt-5 font-Inter text-[14px]"}>
            The CORE community works to bridge the gap of resources, enriching not only the student, but the teacher and the community itself. Being virtually “present & engaged” in CORE is represented by Turtle Tokens. Earn Turtle Tokens through interacting: asking for help, helping others, increasing visibility and showcasing talents, ideas, and problem-solving skills. The greater the engagement, the greater the enrichment of the community. Earn tokens that are redeemable for perks related to fun and expertise that might be outside of your wheelhouse. Or, redeem to gift a bundle of tokens to another CORE member.
            </p>
            <div className='pt-[20px] grid grid-cols-1 gap-x-[100px]'>
                {
                    isLoading ?
                        <div className='pt-[100px] grid grid-cols-1 gap-x-[100px]'>
                            <Spinner text="Loading..."/> 
                        </div> :
                        <div className='shadow-md rounded-lg'>
                            <TokensTable columns={columns} data={tokenActions} />
                        </div>
                }
            </div>
        </>
    );
}

export default HowToEarnToken;