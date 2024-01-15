import React, { useState } from "react";
import Image from 'next/image';
import WonderSquare from "./WonderSquare";
import PillarSvg from "/public/static/images/pillar.svg";

interface PillarProps {
  size: number;
  text: string;
  style?: React.CSSProperties;
  color: string
}

const Pillar = ({ size, text, style, color }: PillarProps) => {
  const innerContent = (
    <div className="content flex flex-col items-center w-full">
      <Image src={PillarSvg} className={`w-[23px] h-[34px] ${text == 'risk_meter' ? 'mt-0' : 'mt-[-25px]'}`} alt="" />
      <h2 className="font-bold text-[22px] text-center text-white">{text == 'risk_meter' ? '' : text}</h2>
    </div>
  );
  return (
    <div className="pillar cursor-default" style={style}>
      <WonderSquare
        style={{ backgroundColor: color }}
        size={text == 'risk_meter' ? size - 40 : size}
        data={null}
        content={innerContent}
      />
    </div>
  );
};

export default Pillar;
