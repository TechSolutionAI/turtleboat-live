import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import OutsideClickHandler from "react-outside-click-handler";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Venture } from "@/types/venture.type";
import Spinner from "@/components/Spinner";
import ClaimRewardModal from "@/components/ClaimRewardModal";
import Swal from "sweetalert2";
import token_icon from "/public/static/images/token_icon.png";
import token_line from "/public/static/images/token_line.png";
import turtle_coin from "/public/static/images/turtle_coin.png";
import gift_icon from "/public/static/images/gift_white.png";

const Index = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as User;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rewards, setRewards] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [selectedRewardIndex, setSelectedRewardIndex] = useState(0);
  const [showClaimModal, setShowClaimModal] = useState(false);

  const getRewards = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/rewards`, {
      method: "GET",
    });

    if (!response.ok) {
      setIsLoading(false);
      const { err } = await response.json();
      console.log(err);
    } else {
      const { rewards } = await response.json();
      setRewards(rewards);
      getInfo();
      setIsLoading(false);
    }
  };

  const getInfo = async () => {
    const response = await fetch(`/api/usertokens/${user._id}`, {
      method: "GET",
    });

    if (!response.ok) {
      const { err } = await response.json();
      console.log(err);
    } else {
      const { tokens, levels } = await response.json();
      setTokenAmount(tokens);
      setLevels(levels);
    }
  };

  const closeClaimModal = () => {
    setShowClaimModal(false);
  };

  useEffect(() => {
    document.title = "Redeem - Turtle Boat";
    getRewards();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="grid place-items-center h-full">
          <Spinner text={"Loading ..."} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-[30px] gap-x-10">
            <div className="flex items-center shadow-md justify-center rounded-lg gap-x-4 py-10">
              <Link href={`#`}>
                <Image
                  alt="Token Icon"
                  src={token_icon}
                  width={100}
                  height={100}
                />
              </Link>
              <div className="flex flex-col justify-center text-[#A57F20]">
                <div className="justify-center text-[25px] font-Inter font-bold text-center lg:text-left">
                  {tokenAmount}
                </div>
                <div className="justify-center font-Inter font-bold">
                  Redeemable Tokens
                </div>
              </div>
            </div>
            <div className="rounded-lg flex-col justify-around shadow-md grid grid-cols-1 gap-x-2 gap-y-2 py-10 px-10">
              {levels.length > 2 && (
                <>
                  <div className="grid grid-cols-7 relative items-center">
                    <div className="text-left col-span-2 px-8 2xl:px-16">
                      <div className="font-Inter font-bold text-[14px] text-black py-1">
                        {levels[0].tokenAmount}
                      </div>
                      <div className="font-Inter font-bold text-[14px] text-black py-1">
                        {levels[0].name}
                      </div>
                    </div>
                    <div className="text-left col-span-3 px-8 2xl:px-16">
                      <div className="font-Inter font-bold text-[14px] text-black py-1">
                        {levels[1].tokenAmount}
                      </div>
                      <div className="font-Inter font-bold text-[14px] text-black py-1">
                        {levels[1].name}
                      </div>
                    </div>
                    <div className="text-left col-span-2 px-8 2xl:px-16">
                      <div className="font-Inter font-bold text-[14px] text-black py-1">
                        {levels[2].tokenAmount}
                      </div>
                      <div className="font-Inter font-bold text-[14px] text-black py-1">
                        {levels[2].name}
                      </div>
                    </div>
                    <Image
                      className="absolute w-full"
                      src={token_line}
                      alt={"Arrow Image"}
                    />
                  </div>
                  <Link
                    href="/dashboard/about/howtoearntoken"
                    className="font-Inter text-[12px] text-center text-primary-blue underline underline-offset-2 decoration-1"
                  >
                    How to earn tokens
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-y-[30px] gap-x-10 mt-5">
            <div>
              <h1 className="truncate text-[24px] font-bold font-Inter py-4">
                My Activity Level
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-[30px] gap-x-10 items-center">
                {rewards.map((item: any, index: number) => {
                  return (
                    <div
                      className={`cursor-pointer`}
                      key={`reward_link_${index}`}
                    >
                      <div
                        className="flex flex-col justify-between gap-x-2 shadow-md min-h-[225px] font-Inter rounded-lg"
                        key={`reward_${index}`}
                      >
                        <div className="gap-x-2 flex items-center text-[20px] bg-[#5884F6] rounded-t-lg font-bold text-white px-[40px] py-[10px] ">
                          <Image
                            src={gift_icon}
                            alt={"Gift Icon"}
                            width={25}
                            height={25}
                          />
                          <Link className="block truncate" href={``}>
                            {item.name}
                          </Link>
                        </div>
                        <div className="text-[14px] pt-[10px] text-black px-[40px] py-[12px] min-h-[110px]">
                          <p className="pt-1 line-clamp-4">
                            {item.description}
                          </p>
                        </div>
                        <div
                          className={`flex items-center px-[35px] py-[12px] justify-between`}
                        >
                          <div className={`flex items-center gap-x-2`}>
                            <Image
                              src={turtle_coin}
                              alt={"Token Icon"}
                              width={40}
                              height={40}
                            />
                            <label
                              className={`font-Inter font-bold text-[#A57F20] text-[18px]`}
                            >
                              {item.cost} Tokens
                            </label>
                          </div>
                          <button
                            className="text-sm flex items-center justify-center bg-[#E8B023] text-white active:bg-[#E8B023] px-3 py-2 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 font-Inter truncate"
                            type="button"
                            onClick={() => {
                              if (
                                user.tokens &&
                                user.tokens >= rewards[index].cost
                              ) {
                                setSelectedRewardIndex(index);
                                setShowClaimModal(true);
                              } else {
                                Swal.fire({
                                  icon: "warning",
                                  title: "Oops...",
                                  text: "Your token balance is not enough for redeem this reward",
                                })
                                  .then(() => {})
                                  .catch((err) => console.log(err));
                              }
                            }}
                          >
                            Redeem
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {!isLoading && rewards.length == 0 && <>No Reward Items</>}
              </div>
            </div>
          </div>
        </>
      )}

      <ClaimRewardModal
        showModal={showClaimModal}
        closeFunc={closeClaimModal}
        rewardData={rewards[selectedRewardIndex]}
      />
    </div>
  );
};

export default Index;
