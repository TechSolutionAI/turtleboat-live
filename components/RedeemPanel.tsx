import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import Spinner from "@/components/Spinner";
import token_icon from "/public/static/images/token_icon.png";
import token_line from "/public/static/images/token_line.png";

const RedeemPanel = () => {
  const { data: session } = useSession();
  const user = session?.user as User;
  const [isLoading, setIsLoading] = useState(false);
  const [quarterTokens, setQuarterTokens] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [tokenAmount, setTokenAmount] = useState(0);
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

  const getInfo = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/usertokens/${user._id}`, {
      method: "GET",
    });

    if (!response.ok) {
      setIsLoading(false);
      const { err } = await response.json();
      console.log(err);
    } else {
      const { tokens, totalEarnedTokens, tokensEarnedQuarter } =
        await response.json();
      setQuarterTokens(tokensEarnedQuarter);
      setTotalTokens(totalEarnedTokens);
      setTokenAmount(tokens);
      getLevels();
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <div className="col-span-1 sm:col-span-2 rounded-xl flex-col justify-around shadow-md grid grid-cols-1 gap-x-2 gap-y-4 py-3 px-8">
      {isLoading ? (
        <div className="pt-[100px] grid grid-cols-1 gap-x-[100px]">
          <Spinner text="Loading..." />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4">
            <div className="text-left col-span-3">
              <div className="font-Inter font-bold text-[20px] text-black">
                Tokens
              </div>
              <div className="font-Inter font-bold text-[18px] text-black">
                {quarterTokens}
              </div>
              <div className="font-Inter font-bold text-[14px] text-black">
                Tokens earned this quarter
              </div>
            </div>
            <div>
              <Image
                src={token_icon}
                alt={"Token Icon"}
                width={70}
                height={70}
              />
            </div>
          </div>
          {levels.length > 2 && (
            <div className="grid grid-cols-7 relative items-center">
              <div className="text-left col-span-2 px-8">
                <div className="font-Inter font-bold text-[12px] text-black py-2">
                  {levels[0].tokenAmount}
                </div>
                <div className="font-Inter font-bold text-[12px] text-black py-2">
                  {levels[0].name}
                </div>
              </div>
              <div className="text-left col-span-3 px-8">
                <div className="font-Inter font-bold text-[12px] text-black py-2">
                  {levels[1].tokenAmount}
                </div>
                <div className="font-Inter font-bold text-[12px] text-black py-2">
                  {levels[1].name}
                </div>
              </div>
              <div className="text-left col-span-2 px-8">
                <div className="font-Inter font-bold text-[12px] text-black py-2">
                  {levels[2].tokenAmount}
                </div>
                <div className="font-Inter font-bold text-[12px] text-black py-2">
                  {levels[2].name}
                </div>
              </div>
              <Image
                className="absolute w-full"
                src={token_line}
                alt={"Arrow Image"}
              />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex flex-col items-center justify-center shadow-md rounded-lg bg-primary-blue py-2">
              <div className="font-Inter font-bold text-[14px] text-white text-center pt-1">
                Tokens earned this quarter
              </div>
              <div className="font-Inter font-bold text-[16px] text-white text-center pt-1">
                {totalTokens}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center shadow-md rounded-lg bg-primary-blue py-2">
              <div className="font-Inter font-bold text-[14px] text-white text-center pt-1">
                Redeemable Tokens
              </div>
              <div className="font-Inter font-bold text-[16px] text-white text-center pt-1">
                {tokenAmount}
              </div>
            </div>
          </div>
          <div>
            <Link
              href="/dashboard/redeem"
              className="text-sm h-fit flex w-full items-center justify-center gap-x-1 font-Inter font-bold bg-tertiary-red text-white active:bg-tertiary-red px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
            >
              Redeem Rewards
            </Link>
          </div>
          <p className="font-Inter text-[12px] text-center">
            Ask for help and help others. Being virtually{" "}
            <q>present & engaged</q> in CORE is represented by Turtle Tokens.
            Earn Turtle Tokens by being virtually present & engaged.
          </p>
        </>
      )}
    </div>
  );
};

export default RedeemPanel;
