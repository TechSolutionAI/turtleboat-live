import React, { useState, useEffect } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import Image from 'next/image';
import turtle_coin from '/public/static/images/turtle_coin.png';
import RedeemModal from "@/components/RedeemModal";

const MenteeTokenItem = ({
    userId
}: {
    userId: string
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [quarterTokens, setQuarterTokens] = useState(0);
    const [tokenData, setTokenData] = useState<any>({
        tokenAmount: 0,
        totalTokens: 0,
        quarterTokens: 0
    });

    const getInfo = async () => {
        setIsLoading(true);
        const response = await fetch(`/api/usertokens/${userId}`, {
            method: 'GET',
        });
    
        if (!response.ok) {
            setIsLoading(false);
            const { err } = await response.json();
            console.log(err)
        } else {
            const { tokens, totalEarnedTokens, tokensEarnedQuarter } = await response.json();
            setTokenData({
                tokenAmount: tokens,
                totalTokens: totalEarnedTokens,
                quarterTokens: tokensEarnedQuarter
            });
            setQuarterTokens(tokensEarnedQuarter);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getInfo();
    }, []);


    return (
        <>
            <div className={`flex items-center cursor-pointer relative`} onClick={() => {
                setDropdownOpen(!dropdownOpen);
            }}>
                <label className={`font-Inter font-bold text-[#A57F20] text-[18px]`}>{tokenData.tokenAmount}</label>
                <Image src={turtle_coin} alt={'Token Icon'} width={60} height={60}/>
                {
                    !isLoading && dropdownOpen && (
                    <OutsideClickHandler onOutsideClick={() => {
                        setDropdownOpen(false)
                    }}>
                        <div className={`absolute z-50 right-[10px] top-[70px] mt-[10px] border border-secondary-gray w-[480px] rounded-[8px] bg-white`}>
                            <RedeemModal data={tokenData} newToken={null}/>
                        </div>
                    </OutsideClickHandler>
                )}
            </div>
        </>
    );
};

export default MenteeTokenItem;