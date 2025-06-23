import React, { useState, useEffect } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import Pusher from "pusher-js";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { User } from "next-auth";

import Image from 'next/image';
import turtle_coin from '/public/static/images/turtle_coin.png';
import RedeemModal from "@/components/RedeemModal";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? "", {
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? "",
});

interface TokenAction {
    name: string;
    tokenAmount: number;
    description: string;
    type: number;
}

const TokenItem = () => {
    const router = useRouter();
    const { data: session} = useSession();
    const user = session?.user as User;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasNewToken, setHasNewToken] = useState(false);
    const [quarterTokens, setQuarterTokens] = useState(0);
    const [tokenData, setTokenData] = useState<any>({
        tokenAmount: 0,
        totalTokens: 0,
        quarterTokens: 0
    });

    const [newTokenInfo, setNewTokenInfo] = useState<any>({
        type: 0,
        name: '',
        amount: 0
    });

    const markAsView = async () => {
        const response = await fetch(`/api/usertokens/${user._id}`, {
            method: 'POST',
        });
    
        if (!response.ok) {
            const { err } = await response.json();
            console.log(err)
        } else {
            const { success } = await response.json();
            if (success) {
                setHasNewToken(false);
                setNewTokenInfo({
                    type: 0,
                    name: '',
                    amount: 0
                })
            }
        }
    };

    const getInfo = async () => {
        setIsLoading(true);
        const response = await fetch(`/api/usertokens/${user._id}`, {
            method: 'GET',
        });
    
        if (!response.ok) {
            setIsLoading(false);
            const { err } = await response.json();
            console.log(err)
        } else {
            const { tokens, totalEarnedTokens, tokensEarnedQuarter, latestAction } = await response.json();
            setTokenData({
                tokenAmount: tokens,
                totalTokens: totalEarnedTokens,
                quarterTokens: tokensEarnedQuarter
            });
            if (latestAction != null) {
                setNewTokenInfo({
                    type: latestAction.type,
                    name: latestAction.name,
                    amount: latestAction.tokenAmount
                });
                setHasNewToken(true);
            }
            setQuarterTokens(tokensEarnedQuarter);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session != undefined) {
            getInfo();
            const channel = pusher.subscribe(`user-token-${user._id}`);
    
            channel.bind("token-history", (data: TokenAction) => {
                getInfo();
            });
    
            return () => {
                pusher.unsubscribe(`user-token-${user._id}`);
            };
        }
    }, []);


    return (
        <>
            <div className={`flex items-center cursor-pointer relative`} onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setTimeout(markAsView, 3000);
            }}>
                <label className={`font-Inter font-bold text-[#A57F20] text-[18px]`}>{tokenData.tokenAmount}</label>
                <Image src={turtle_coin} alt={'Token Icon'} width={60} height={60}/>
                {
                    hasNewToken && (
                        <div className="absolute inline-flex items-center justify-center w-4 h-4 text-xs sm:w-5 sm:h-5 sm:text-sm font-bold text-white bg-[#27AE60] rounded-full top-1 right-0">!</div>
                    )
                }
                {
                    !isLoading && dropdownOpen && (
                    <OutsideClickHandler onOutsideClick={() => {
                        setDropdownOpen(false)
                        setHasNewToken(false);
                        setNewTokenInfo({
                            type: 0,
                            name: '',
                            amount: 0
                        })
                    }}>
                        <div className={`absolute z-50 right-[10px] top-[70px] mt-[10px] border-1 border-secondary-gray w-[480px] rounded-[8px] bg-white`}>
                            <RedeemModal data={tokenData} newToken={newTokenInfo}/>
                        </div>
                    </OutsideClickHandler>
                )}
            </div>
        </>
    );
};

export default TokenItem;