import React, { useState, useEffect, useMemo } from 'react';
import Spinner from "@/components/Spinner"
import RequestsTable from './RequestsTable';
import Swal from "sweetalert2";

const Redemption = () => {
    const [claimRequests, setClaimRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getClaimRequests = async () => {
        let tempList: any[] = [];
        setIsLoading(true);
        const response = await fetch('/api/claimreward', {
            method: 'GET'
        });
    
        if (!response.ok) {
            setIsLoading(false);
            const { err } = await response.json();
            console.log(err)
        } else {
            setIsLoading(false);
            const { claimList } = await response.json();
            tempList = claimList.map((item: any, index: number) => {
                const filteredDates = item.dates.filter((date: any) => date.startDate != null ).map((dateItem: any) => dateItem.startDate);

                let listItem = {
                    no: index + 1,
                    user: item.user.name,
                    title: item.rewardInfo.name,
                    description: item.rewardInfo.description,
                    cost: item.rewardInfo.cost,
                    image: item.user.image,
                    action: item._id,
                    email: item.user.email,
                    rewardId: item.rewardInfo._id,
                    dates: filteredDates,
                    note: item.content,
                    userId: item.user._id
                }
                return listItem;
            })
            setClaimRequests(tempList)
        }
    };

    const approveClaimRequest = async (data: any) => {
        const response = await fetch(`/api/claimreward/${data.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid: data.userId,
                uemail: data.email,
                cid: data.cid
            })
        });
    
        if (!response.ok) {
            const { err } = await response.json();
            console.log(err)
            return { success: false, err: err };
        } else {
            return { success: true };
        }
    };

    useEffect(() => {
        document.title = "Redemption - Turtle Boat";
        getClaimRequests();
    }, []);

    const columns = useMemo(
        () => [
            {
                Header: "No",
                accessor: "no",
                isCenter: false,
            },
            {
                Header: "Reward Title",
                accessor: "title",
                disableSortBy: true
            },
            {
                Header: "Reward Description",
                accessor: "description",
                isCenter: false,
            },
            {
                Header: "Cost",
                accessor: "cost",
                isCenter: false,
            },
            {
                Header: "User",
                accessor: "image",
                isCenter: true,
                disableSortBy: true
            },
            {
                Header: "Email",
                accessor: "email",
                isCenter: false,
                disableSortBy: true
            },
            {
                Header: "Available Dates",
                accessor: "dates",
                isCenter: true,
                disableSortBy: true
            },
            {
                Header: "Note",
                accessor: "note",
                isCenter: true,
                disableSortBy: true
            },
            {
                Header: "Action",
                accessor: "action",
                isCenter: true,
                disableSortBy: true
            },
        ],
        []
    );

    const handleApproved = (data: any) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Approve Claim Reward Request`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, approve it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const result = await approveClaimRequest(data);
                if (result.success) {
                    Swal.fire(
                        'Approved successfully!',
                        `Approved successfully!`,
                        'success'
                    );
                } else {
                    Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: result.err,
                    })
                }
            }
        })
    }

    return (
        <>
            <div className='pt-[60px]'>
                {
                    isLoading ?
                        <div className='pt-[100px] grid grid-cols-1 gap-x-[100px]'>
                            <Spinner text="Loading Redemption Reports..."/> 
                        </div>:
                        <>
                        <RequestsTable columns={columns} data={claimRequests} handleApproved={handleApproved} />
                        </>
                }
            </div>
        </>
    )
}

export default Redemption;