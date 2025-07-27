import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useRouter } from "next/router";
import Image from "next/image";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ExtensionOutlinedIcon from "@mui/icons-material/ExtensionOutlined";
import AutoAwesomeMosaicOutlinedIcon from "@mui/icons-material/AutoAwesomeMosaicOutlined";
import road_assistance_mg from "/public/static/images/roadassistance.png";
import Spinner from "@/components/Spinner";
import AudioPlayer from "@/components/AudioPlayer";
import ResponseModal from "@/components/ResponseModal";
import { Venture, EntreRoadsideAssistance } from "@/types/venture.type";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import UserAvatar from "@/components/UserAvatar";

const RoadAssistanceDetail = () => {
  const tablist = [
    {
      label: "Notifications",
      link: "/dashboard/messages",
    },
    {
      label: "Entrepreneurial Roadside Assistance",
      link: "/dashboard/messages/roadassistances",
    },
    // {
    //     label: 'Community Roadside Assistance',
    //     link: '/dashboard/messages/racommunity'
    // }
  ];

  const tabIcons = [
    <HelpOutlineIcon key={0} />,
    <ExtensionOutlinedIcon key={1} />,
    <AutoAwesomeMosaicOutlinedIcon key={2} />,
  ];

  const { data: session } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const { id } = router.query;
  let ventureId = "";
  if (typeof id === "string" && id !== "") {
    ventureId = id.toString();
  }

  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [venture, setVenture] = useState<Venture>();
  const [era, setEra] = useState<EntreRoadsideAssistance | null | undefined>();
  const [requestData, setRequestData] = useState<any>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [isTextResponse, setIsTextResponse] = useState(false);

  const handleCancelClicked = () => {
    router.push(`/dashboard/messages/roadassistances`);
  };

  const closeResponseModal = () => {
    setShowResponseModal(false);
  };

  const addResponse = (data: any) => {
    if (responseData != null) {
      setResponseData((prev: any) => [...prev, data]);
    } else {
      setResponseData([data]);
    }
    setShowResponseModal(false);
  };

  const getVenture = async () => {
    if (ventureId != "") {
      setIsLoading(true);
      const response = await fetch(`/api/ventures/${id}`, {
        method: "GET",
      });

      if (!response.ok) {
        setIsLoading(false);
        const { err } = await response.json();
        console.log(err);
      } else {
        const { venture } = await response.json();
        if (venture.mentee != null && venture.mentee != undefined) {
          if (venture.mentee.email == user.email) {
            setIsEditable(true);
          }
        }
        if (venture.era != undefined && venture.era != null) {
          setEra(venture.era);
          if (venture.era.request != null && venture.era.request != undefined) {
            setRequestData(venture.era.request);
          }
          if (
            venture.era.response != null &&
            venture.era.response != undefined
          ) {
            setResponseData(venture.era.response);
          }
        }
        setVenture(venture);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    document.title = "Entrepreneurial Roadside Assistance Detail - Turtle Boat";
    getVenture();
  }, []);

  const handleResponseWithText = () => {
    setIsTextResponse(true);
    setShowResponseModal(true);
  };

  const handleResponseWithEmail = () => {
    setIsTextResponse(false);
    setShowResponseModal(true);
  };

  return (
    <>
      {isLoading ? (
        <div className="grid place-items-center h-screen">
          <Spinner text="Loading data ..." />
        </div>
      ) : (
        <>
          <div className="block lg:flex justify-between items-center sticky top-0 bg-white z-10 pt-2 pb-4">
            <a
              onClick={handleCancelClicked}
              className="cursor-pointer flex items-center text-[20px] font-Inter font-bold lg:flex"
            >
              <span className="flex">
                <KeyboardBackspaceIcon />
              </span>
              <h1 className="ml-[15px]">All Requests</h1>
            </a>
            <div className="flex justify-center sm-w-full">
              <ul className="block md:flex text-gray-500">
                {tablist.map((item: any, index: number) => {
                  return (
                    <li className="mr-2 flex items-center" key={`tab-${index}`}>
                      <Link
                        href={item.link}
                        className={`w-full inline-flex p-4 border-b-2 text-[16px] font-Inter font-semibold ${
                          index == 1
                            ? "text-tertiary-red border-tertiary-red"
                            : "border-transparent hover:text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="hidden sm:flex">
                            {tabIcons[index]}
                          </span>
                          <span className="sm:ml-[10px] sm:max-w-fit md:max-w-[150px] lg:max-w-fit truncate">
                            {item.label}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-9 gap-x-4 my-[10px] px-0 sm:px-10">
            <div className="col-span-1 xl:col-span-6">
              <div className="bg-secondary-gray-1 rounded-lg border border border-secondary-gray-3 px-9 py-7">
                <div className="flex items-center gap-x-2">
                  {/* <Image className='rounded-full' src={venture?.mentee.image ?? '/user.png'} alt={venture?.mentee.name} width={40} height={40}/> */}
                  <UserAvatar user={venture?.mentee} size={40} classes={""} />
                  <label className="font-Inter font-bold text-black">
                    {venture?.mentee.name}
                  </label>
                </div>
                {requestData != null && (
                  <>
                    <div className="flex items-center gap-x-2 mt-4">
                      <div className="px-4 py-2 rounded-[20px] border border border-secondary-gray bg-white">
                        <label>{requestData.type.label}</label>
                      </div>
                    </div>
                    <div className="mt-8">
                      <h2 className="font-Inter font-bold text-tertiary-red">
                        Specific Help Request
                      </h2>
                      <p className="mt-4">{requestData.specificHelpRequest}</p>
                    </div>
                    <div className="mt-8">
                      <h2 className="font-Inter font-bold text-tertiary-red">
                        What did you do to address this problem on your own?
                      </h2>
                      <p className="mt-4">{requestData.whatYouDid}</p>
                    </div>
                    <div className="mt-8">
                      <h2 className="font-Inter font-bold text-tertiary-red">
                        Background Info
                      </h2>
                      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 xl:grid-cols-3 gap-x-4 gap-y-4">
                        {requestData.elevatorType == "0" && (
                          <div className="flex flex-col items-center justify-around py-5 shadow-md rounded-lg bg-white border border border-secondary-gray-3">
                            <h3 className="font-Inter text-center font-bold">
                              Elevator Pitch
                            </h3>
                            <AudioPlayer audioData={venture?.audio} />
                          </div>
                        )}
                        <div className="flex flex-col items-center justify-around py-5 shadow-md rounded-lg bg-white border border border-secondary-gray-3">
                          <h3 className="font-Inter text-center font-bold">
                            Comic Strip
                          </h3>
                          <Link
                            target="_blank"
                            className="font-Inter text-primary-blue h-[50px] flex items-center"
                            href={`/dashboard/toolbox/comicstrip/${ventureId}`}
                          >
                            View
                          </Link>
                        </div>
                        {requestData.files.map(
                          (fileItem: any, index: number) => {
                            return (
                              <div
                                key={`file_item_${index}`}
                                className="flex flex-col items-center justify-around py-5 shadow-md rounded-lg bg-white border border border-secondary-gray-3"
                              >
                                <h3 className="font-Inter text-center font-bold">
                                  {fileItem.name}
                                </h3>
                                <Link
                                  className="font-Inter text-primary-blue h-[50px] flex items-center"
                                  href={fileItem.url}
                                  target="_blank"
                                >
                                  View
                                </Link>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                    {(requestData.elevatorType == "1" ||
                      requestData.elevatorType == "2") && (
                      <>
                        <div className="mt-4">
                          <h2 className="font-Inter font-bold text-black">
                            Opening Hook
                          </h2>
                          <p className="mt-2">{requestData.opening}</p>
                        </div>
                        <div className="mt-4">
                          <h2 className="font-Inter font-bold text-black">
                            Problem
                          </h2>
                          <p className="mt-2">{requestData.problem}</p>
                        </div>
                        <div className="mt-4">
                          <h2 className="font-Inter font-bold text-black">
                            Character
                          </h2>
                          <p className="mt-2">{requestData.character}</p>
                        </div>
                        <div className="mt-4">
                          <h2 className="font-Inter font-bold text-black">
                            Setting
                          </h2>
                          <p className="mt-2">{requestData.setting}</p>
                        </div>
                        <div className="mt-4">
                          <h2 className="font-Inter font-bold text-black">
                            Solution
                          </h2>
                          <p className="mt-2">{requestData.solution}</p>
                        </div>
                        <div className="mt-4">
                          <h2 className="font-Inter font-bold text-black">
                            Closing Hook
                          </h2>
                          <p className="mt-2">{requestData.closing}</p>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
              {responseData != null &&
                responseData != undefined &&
                responseData.length > 0 && (
                  <>
                    <div className="mt-7 mb-0">
                      <h2 className="font-Inter font-bold text-black text-[20px]">
                        Response
                      </h2>
                    </div>
                    {responseData.map((responseItem: any, index: number) => {
                      return (
                        <div
                          key={`reponseitem-${index}`}
                          className="bg-secondary-gray-1 rounded-lg border border border-secondary-gray-3 px-9 py-7 mt-4"
                        >
                          <div className="flex items-center gap-x-2">
                            <UserAvatar
                              user={responseItem?.user}
                              size={40}
                              classes={""}
                            />
                            <label className="font-Inter font-bold text-black">
                              {responseItem?.user.name}
                            </label>
                          </div>
                          <div className="mt-8">
                            {responseItem.isForward && (
                              <h3 className="font-Inter font-bold text-black">
                                Your help request was forwarded by{" "}
                                {responseItem.user.name}
                              </h3>
                            )}
                            <p className="mt-4">{responseItem.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
            </div>
            <div className="mt-5 lg:mt-0 bg-accent-yellow rounded-lg border border border-secondary-gray-3 px-9 py-7 col-span-1 xl:col-span-3">
              <div className="flex items-center gap-x-2">
                <Image
                  className="rounded-full"
                  src={road_assistance_mg}
                  alt={"Road Assistance Icon"}
                  width={38}
                  height={38}
                />
                <h2 className="font-Inter font-bold text-black">
                  Help Them Get Unstuck!!
                </h2>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-y-5">
                {/* <Link href='#' className='bg-white px-7 py-8 shadow-md rounded-lg border border border-secondary-gray-3'>
                                <label className='font-Inter font-bold text-black'>Schedule a 15 minute Zoom</label>
                            </Link>
                            <Link href='#' className='bg-white px-7 py-8 shadow-md rounded-lg border border border-secondary-gray-3'>
                                <label className='font-Inter font-bold text-black'>Upload a 3 minute video response</label>
                            </Link> */}
                <div
                  onClick={handleResponseWithText}
                  className="bg-white px-7 py-8 shadow-md rounded-lg border border border-secondary-gray-3 cursor-pointer"
                >
                  <h3 className="font-Inter font-bold text-black cursor-pointer">
                    Send a text-based response
                  </h3>
                </div>
                <div
                  onClick={handleResponseWithEmail}
                  className="bg-white px-7 py-8 shadow-md rounded-lg border border border-secondary-gray-3 cursor-pointer"
                >
                  <h3 className="font-Inter font-bold text-black cursor-pointer">
                    Forward this request to someone in your network that you
                    think can help
                  </h3>
                </div>
                <Link
                  href="/dashboard/toolbox/lemonade/add"
                  className="bg-white px-7 py-8 shadow-md rounded-lg border border border-secondary-gray-3 cursor-pointer"
                >
                  <h3 className="font-Inter font-bold text-black">
                    Start a Coffee Chat
                  </h3>
                </Link>
              </div>
            </div>
          </div>

          <ResponseModal
            showModal={showResponseModal}
            closeFunc={closeResponseModal}
            addResponse={addResponse}
            isTextResponse={isTextResponse}
            ventureId={ventureId}
            mentee={venture?.mentee}
          />
        </>
      )}
    </>
  );
};

export default RoadAssistanceDetail;
