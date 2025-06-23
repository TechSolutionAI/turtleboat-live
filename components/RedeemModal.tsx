import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import token_icon from "/public/static/images/token_icon.png";
import token_line from "/public/static/images/token_line.png";

const RedeemModal = ({ data, newToken }: { data: any; newToken: any }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [levels, setLevels] = useState<any[]>([]);

  const getLevels = async () => {
    setIsLoading(true);
    let levelList: any[] = [];
    const response = await fetch(`/api/levels`, {
      method: "GET",
    });

    if (!response.ok) {
      setIsLoading(false);
      const { err } = await response.json();
      console.log(err);
    } else {
      const { levels } = await response.json();
      levelList = levels.map((level: any, index: number) => {
        let tokenItem = {
          no: level.no,
          name: level.name,
          description: level.description,
          tokenAmount: level.tokenAmount,
          levelId: level._id,
        };
        return tokenItem;
      });
      setLevels(levelList);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLevels();
  }, []);

  return (
    <div className="col-span-1 sm:col-span-2 rounded-xl flex-col justify-around shadow-lg grid grid-cols-1 gap-x-2 gap-y-2 py-3 px-8">
      <div className="grid grid-cols-4">
        <div className="text-left col-span-3">
          <div className="font-Inter font-bold text-[20px] text-black">
            {data.quarterTokens}
          </div>
          <div className="font-Inter font-bold text-[14px] text-black">
            Tokens earned this quarter
          </div>
          {newToken != null && newToken.name != "" && (
            <div className="font-Inter text-[12px] text-white bg-[#27AE60] px-2 py-1 inline-block rounded-md">
              ! {newToken.name} {`${newToken.type == 0 ? "-" : newToken.amount >= 0 ? "+" : ""}`}
              {newToken.amount}
            </div>
          )}
        </div>
        <div>
          <Image src={token_icon} alt={"Token Icon"} width={70} height={70} />
        </div>
      </div>
      {isLoading ? (
        <></>
      ) : (
        levels.length > 2 && (
          <div className="grid grid-cols-7 relative items-center -mx-4">
            <div className="text-left col-span-2 px-8">
              <div className="font-Inter font-bold text-[12px] text-black py-1">
                {levels[0].tokenAmount}
              </div>
              <div className="font-Inter font-bold text-[12px] text-black py-1">
                {levels[0].name}
              </div>
            </div>
            <div className="text-left col-span-3 px-8">
              <div className="font-Inter font-bold text-[12px] text-black py-1">
                {levels[1].tokenAmount}
              </div>
              <div className="font-Inter font-bold text-[12px] text-black py-1">
                {levels[1].name}
              </div>
            </div>
            <div className="text-left col-span-2 px-8">
              <div className="font-Inter font-bold text-[12px] text-black py-1">
                {levels[2].tokenAmount}
              </div>
              <div className="font-Inter font-bold text-[12px] text-black py-1">
                {levels[2].name}
              </div>
            </div>
            <Image
              className="absolute w-full"
              src={token_line}
              alt={"Arrow Image"}
            />
          </div>
        )
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        <div className="flex flex-col items-center justify-center shadow-md rounded-lg bg-primary-blue py-1">
          <div className="font-Inter font-bold text-[14px] text-white text-center pt-1">
            Tokens earned to date
          </div>
          <div className="font-Inter font-bold text-[16px] text-white text-center pt-1">
            {data.totalTokens}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center shadow-md rounded-lg bg-primary-blue py-1">
          <div className="font-Inter font-bold text-[14px] text-white text-center pt-1">
            Redeemable Tokens
          </div>
          <div className="font-Inter font-bold text-[16px] text-white text-center pt-1">
            {data.tokenAmount}
          </div>
        </div>
      </div>
      <div>
        <Link
          href="/dashboard/redeem"
          className="cursor-pointer text-sm h-fit flex w-full items-center justify-center gap-x-1 font-Inter font-bold bg-tertiary-red text-white active:bg-tertiary-red px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
        >
          See Rewards
        </Link>
      </div>
      <Link
        href="/dashboard/about/howtoearntoken"
        className="font-Inter text-[12px] text-center text-primary-blue underline underline-offset-2 decoration-1"
      >
        How to earn tokens
      </Link>
    </div>
  );
};

export default RedeemModal;
