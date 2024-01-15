import React, { useState, useMemo, useEffect } from 'react'
import Spinner from "@/components/Spinner"
import { useRouter } from 'next/router';
import RewardsTable from './RewardsTable';

const Rewards = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [rewards, setRewards] = useState<any[]>([])

    const getRewards = async () => {
        setIsLoading(true);
        let rewardList: any[] = [];
        const response = await fetch(`/api/rewards`, {
            method: 'GET'
        });

        if (!response.ok) {
            setIsLoading(false);
            const { err } = await response.json();
            console.log(err)
        } else {
            const { rewards } = await response.json();
            rewardList = rewards.map((reward: any, index: number) => {
                let tokenItem = {
                    no: reward.no,
                    name: reward.name,
                    description: reward.description,
                    cost: reward.cost,
                    rewardId: reward._id
                }
                return tokenItem;
            })
            setRewards(rewardList);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getRewards();
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
                Header: "Cost",
                accessor: "cost",
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
                            <h2 className='font-Inter font-bold text-primary-black px-4 py-4 text-[18px]'>Rewards</h2>
                            <RewardsTable columns={columns} data={rewards} />
                        </div>
                }
            </div>
        </>
    );
}

export default Rewards;