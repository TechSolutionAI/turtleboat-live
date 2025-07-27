import React, { useState } from "react";
import Image from 'next/image';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import UserBadge from '/public/static/images/user_badge.svg';
import BuyerBadge from '/public/static/images/buyer_badge.svg';
import PayerBadge from '/public/static/images/payer_badge.svg';
import PowerBadge from '/public/static/images/power_badge.svg';
import { Character } from '@/types/character.type';

interface CharacterProps {
    size?: number;
    data: Character;
    id: number;
    isSelected: boolean;
    handleCharacterSelected: any;
    style?: React.CSSProperties;
    color?: string
}

const CharacterItem = ({ size, data, id, isSelected, handleCharacterSelected, style, color }: CharacterProps) => {
    const handleClick = () => {
        handleCharacterSelected(id);
    }
    return (
        <div
            onClick={handleClick} 
            className={`cursor-pointer bg-[#ECDBFF] border ${isSelected ? `border-4 border-primary-blue` : `border border-[#B6B6B6]`} rounded-md p-1`} style={style}>
            <div className='flex items-center bg-white max-w-[185px] px-1 py-2 rounded-md gap-x-1 min-w-[180px]'>
                <AccountCircleRoundedIcon sx={{ fontSize: "30px", color: "#4C2E87" }}/> 
                <div className='truncate'>{data.name}</div>
            </div>
            <div className='flex items-center min-h-[38px] pt-[8px] gap-x-1'>
                {
                    data.isUser && (
                        // <Image src={UserBadge} alt='' width={39} height={39} className="rounded-full cursor-pointer"/>
                        <UserBadge alt='' width={39} height={39} className="rounded-full cursor-pointer"/>
                    )
                }
                {
                    data.isBuyer && (
                        // <Image src={BuyerBadge} alt='' width={39} height={39} className="rounded-full cursor-pointer"/>
                        <BuyerBadge alt='' width={39} height={39} className="rounded-full cursor-pointer"/>
                    )
                }
                {
                    data.isPayer && (
                        // <Image src={PayerBadge} alt='' width={39} height={39} className="rounded-full cursor-pointer"/>
                        <PayerBadge alt='' width={39} height={39} className="rounded-full cursor-pointer"/>
                    )
                }
                {
                    data.solvingPower == 3 && (
                        // <Image src={PowerBadge} alt='' width={39} height={39} className="rounded-full cursor-pointer"/>
                        <PowerBadge alt='' width={39} height={39} className="rounded-full cursor-pointer"/>
                    )
                }
            </div>
        </div>
    );
};

export default CharacterItem;
