import React from "react";
import { useRouter } from "next/router";
import LockClosed from '/public/static/images/lock-closed.svg'
import LockOpened from '/public/static/images/lock-opened.svg'
import Image from 'next/image';
import { ModuleItem } from '@/types/module.type';

export const WONDERSQ_SIZE_RATIO = 1.42;

interface WonderSquareProps {
  size: number;
  data: any;
  active?: boolean;
  content?: React.ReactNode;
  style?: React.CSSProperties;
  templ?: any;
}

const WonderSquare = ({ size, data, content, style }: WonderSquareProps) => {
  const router = useRouter();
  const newSize = size / WONDERSQ_SIZE_RATIO;

  const wonderSquare = (
    <div
      className="wonder-square w-[100%] h-[100%] bg-white border-4 border-white box-border rounded-[8px] -translate-x-1/2 -translate-y-1/2 rotate-45 relative top-[50%] left-[50%] font-Inter"
      style={{
        width: `${newSize}px`,
        height: `${newSize}px`,
        pointerEvents: "all",
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), inset 0px 4px 10px rgba(0, 0, 0, 0.25)',
        ...style,
      }}
    ></div>
  );

  const handleModuleClicked = () => {
    if ((content == null || content == undefined) && data._id != '' && data.isCheck && !data.isLock) {
      router.push(`/dashboard/myventures/module/${data.ventureId}-${data._id}`);
    }
  }
  
  const tooltipText = content == undefined && data._id != '' && data.isCheck ? data.title : '';

  return (
    <div
      className={`wonder-square-container relative`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        pointerEvents: "none"
      }}
      onClick={handleModuleClicked}
      data-tooltip-id={"module-tool-tip"}
      data-tooltip-content={tooltipText}
    >
      {wonderSquare}
      <div
        className={`ws-content absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[100%] text-center pointer-events-none`}
      >
        {content ?
          content :
          (
            data._id != '' && data.isCheck ?
              data.isLock ?
                <div className="flex justify-center">
                  {/* <Image src={LockClosed} className="w-[30px]" alt="" /> */}
                  <LockClosed className="w-[30px]" alt="" />
                </div>
                :
                // <div className="flex justify-center" >
                //   <Image src={LockOpened} className="w-[30px]" alt="" />
                // </div>
                <a className={`font-Inter text-[24px] font-black`}>?</a>
              :
              <a className={`font-Inter text-[24px] font-black`}></a>
          )}
      </div>
    </div>
  );
};

export default WonderSquare;
