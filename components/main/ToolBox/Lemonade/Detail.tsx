import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useRouter } from "next/router";
import { Transition } from "@headlessui/react";
import { v4 as uuid } from "uuid";
import Image from "next/image";
import Pusher from "pusher-js";
import Swal from "sweetalert2";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ExtensionOutlinedIcon from "@mui/icons-material/ExtensionOutlined";
import GroupIcon from "@mui/icons-material/Group";
import SendIcon from "@mui/icons-material/Send";
import ForumIcon from "@mui/icons-material/Forum";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import Spinner from "@/components/Spinner";
import UserAvatar from "@/components/UserAvatar";
import LemonadePitch from "@/components/LemonadePitch";
import InviteLemonadeParticipants from "@/components/InviteLemonadeParticipants";
import { Lemonade } from "@/types/lemonade.type";

import InstructionImg from "/public/static/images/instruction.png";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? "", {
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? "",
});

const messageColorClasses = [
  "border border-secondary-gray-2 py-2 px-4 rounded-lg w-fit bg-[#DCECFB]",
  "border border-secondary-gray-2 py-2 px-4 rounded-lg w-fit bg-[#DCFBEA]",
  "border border-secondary-gray-2 py-2 px-4 rounded-lg w-fit bg-[#FFDBDB]",
  "border border-secondary-gray-2 py-2 px-4 rounded-lg w-fit bg-[#F2F3CE]",
  "border border-secondary-gray-2 py-2 px-4 rounded-lg w-fit bg-[#D0CEF3]",
];

const purposes = ["Expand", "Challenge", "Clarify", "Diverge"];

const focuses = ["Problem", "Setting", "Character", "Solution"];

const LemonadeDetail = () => {
  const [redirect, setRedirect] = useState<string>("");
  const { data: session } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasPitch, setHasPitch] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [remaining, setRemaining] = useState<number>(0);
  const [lemonade, setLemonade] = useState<Lemonade>();
  const [comments, setComments] = useState<any[]>([]);
  const [pitch, setPitch] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const [focus, setFocus] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [purposeError, setPurposeError] = useState<boolean>(false);
  const [pitchError, setPitchError] = useState<boolean>(false);
  const [focusError, setFocusError] = useState<boolean>(false);
  const [msgError, setMsgError] = useState<boolean>(false);
  const [remainingError, setRemainingError] = useState<boolean>(false);
  const [messageOpen, setMessageOpen] = useState<boolean>(false);
  const [pitchUploading, setPitchUploading] = useState<boolean>(false);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [showInstruction, setShowInstruction] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isInitiator, setIsInitiator] = useState<boolean>(false);
  const [isParticipant, setIsParticipant] = useState<boolean>(false);

  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const getLemonade = async () => {
    if (id != "") {
      setIsLoading(true);
      const response = await fetch(`/api/lemonades/${id}`, {
        method: "GET",
      });

      if (!response.ok) {
        setIsLoading(false);
        const { err } = await response.json();
        console.log(err);
      } else {
        const { lemonade } = await response.json();
        calculateRemaining(lemonade);
        // setLemonade(lemonade);
        // setComments(lemonade.comments);
        setIsLoading(false);
      }
    }
  };

  const handleCancelClicked = () => {
    router.push(`/dashboard/toolbox/lemonade/`);
  };

  const closeInviteModal = () => {
    setShowInviteModal(false);
  };

  const closeInstructionModal = () => {
    setShowInstruction(false);
  };

  const handleMessageChange = (value: string) => {
    setMsgError(value == "");
    setMessage(value);
  };

  const calculateRemaining = (lemonade: Lemonade) => {
    let isMember = false;
    const updatedParticipants = lemonade.participants.map(
      (participant: any) => {
        if (participant.email == user.email) {
          isMember = true;
          setIsParticipant(true);
          setHasPitch(participant.hasPitch);
          if (participant.isInitiator) {
            setIsInitiator(true);
          }
          setRemaining(20 - participant.commentCount);
          return {
            ...participant,
            commentCount: participant.commentCount,
          };
        } else {
          return participant;
        }
      }
    );
    if (isMember) {
      let temp = lemonade;
      temp.participants = updatedParticipants;
      setLemonade(temp);
      setComments(temp.comments);
    } else {
      router.push(`/dashboard/toolbox/lemonade/`);
    }
  };

  const updateRemainingForOthers = (comment: any) => {
    if (lemonade) {
      const updatedParticipants = lemonade.participants.map(
        (participant: any) => {
          if (participant.email == comment.user.email) {
            return {
              ...participant,
              commentCount: participant.commentCount - 1,
            };
          } else {
            return participant;
          }
        }
      );
      let temp = lemonade;
      temp.participants = updatedParticipants;
      setLemonade(temp);
    }
  };

  const saveAudio = (audioData: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(audioData);
    reader.onloadend = async () => {
      if (reader.result != null && typeof reader.result === "string") {
        const base64data = reader.result?.split(",")[1];
        if (!base64data) {
          console.error("Failed to convert audio to base64");
          return;
        }
        setPitchUploading(true);
        // Now you can send the base64 encoded data to the server using fetch or any other library.
        const response = await fetch("/api/audio", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: base64data, id: uuid() }),
        });

        if (!response.ok) {
          setPitchUploading(false);
          const { err } = await response.json();
          console.log(err);
        } else {
          setPitchUploading(false);
          const { url } = await response.json();
          setPitchError(false);
          setPitch(url);
        }
      }
    };
  };

  const postMessage = async () => {
    if (remaining == 0 && !hasPitch) {
      if (pitch == "") {
        setPitchError(true);
      } else {
        setPitchError(false);
        setIsSaving(true);
        const response = await fetch(`/api/lemonades/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            purpose: "",
            focus: "",
            content: pitch,
            user: {
              email: user.email,
              name: user.name,
              image: user.image,
              _id: user._id,
            },
          }),
        });

        if (!response.ok) {
          setIsSaving(false);
          const { err } = await response.json();
          console.log(err);
        } else {
          const { result } = await response.json();
          calculateRemaining(result);
          setFocus("");
          setPurpose("");
          setMessage("");
          setComments(result.comments);
          setIsSaving(false);
        }
      }
    } else {
      setFocusError(focus == "");
      setPurposeError(purpose == "");
      setMsgError(message == "");
      setRemainingError(remaining == 0);
      if (focus != "" && purpose != "" && message != "" && remaining > 0) {
        setIsSaving(true);
        const response = await fetch(`/api/lemonades/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            purpose: purpose,
            focus: focus,
            content: message,
            user: {
              email: user.email,
              name: user.name,
              image: user.image,
              _id: user._id,
            },
          }),
        });

        if (!response.ok) {
          setIsSaving(false);
          const { err } = await response.json();
          console.log(err);
        } else {
          const { result } = await response.json();
          calculateRemaining(result);
          setFocus("");
          setPurpose("");
          setMessage("");
          setComments(result.comments);
          setIsSaving(false);
        }
      }
    }
  };

  const openInviteModal = () => {
    if (lemonade?.participants && lemonade?.participants.length < 5) {
      setShowInviteModal(true);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "This 50 Ways to Lemonade Battle is full",
      });
    }
  };

  const markComplete = async () => {
    setIsUpdating(true);
    const response = await fetch("/api/lemonades", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    });

    if (!response.ok) {
      const { err } = await response.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err,
      })
        .then(() => {
          setIsUpdating(false);
          console.log("Updating status was failed");
        })
        .catch((err) => console.log(err));
    } else {
      setIsUpdating(false);
      Swal.fire({
        icon: "success",
        title: "Success!",
        allowOutsideClick: false,
        text: `Completed Successfully!`,
      })
        .then(() => {
          if (lemonade) {
            const temp = lemonade;
            temp.isCompleted = true;
            setLemonade(temp);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    document.title = "50 Ways to Lemonade Battle Detail - Turtle Boat";
    getLemonade();
    const channel = pusher.subscribe(`user-${user._id}`);

    channel.bind("lemonade-message", (data: any) => {
      setComments((prevComments) => [...prevComments, data]);
      updateRemainingForOthers(data);
    });

    return () => {
      pusher.unsubscribe(`user-${user._id}`);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isLoading ? (
    <div className="grid place-items-center h-screen">
      <Spinner text={"Loading ..."} />
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
          <h1 className="ml-[15px]">All 50 Ways to Lemonade</h1>
        </a>
      </div>
      <div className="px-0 sm:px-5 font-Inter">
        <div className="rounded-lg border border-1 border-secondary-gray-3 px-0 pt-7 lg:mb-0 mb-[30px]">
          <div className="block md:flex justify-between items-center px-9">
            <h2 className="font-Inter font-bold text-black text-[20px] py-2">
              {lemonade?.name}
            </h2>
            {isInitiator &&
              (!lemonade?.isCompleted ? (
                <button
                  className="w-full md:w-fit bg-secondary-green text-white active:bg-secondary-green px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  onClick={markComplete}
                >
                  {isUpdating ? (
                    <Spinner size={"7"} text={"Updating ..."} />
                  ) : (
                    <>
                      Mark Brainstrom Complete <CheckCircleIcon />
                    </>
                  )}
                </button>
              ) : (
                <div
                  className={`justify-center flex flex-col text-center px-[15px] sm:py-3 py-4 rounded-full bg-tertiary-green text-secondary-green border-l-1 border-tertiary-green`}
                >
                  <span className="self-center text-sm font-medium">
                    Completed
                  </span>
                </div>
              ))}
          </div>
          <div className="block md:flex justify-between mt-2 px-9">
            <div className="grid xl:grid-cols-2 grid-cols-1 gap-x-4 gap-y-1">
              {lemonade?.participants.map((participant: any, index: number) => {
                return (
                  <div
                    className="flex items-center"
                    key={`participant_${index}`}
                  >
                    <div className="flex items-center">
                      <UserAvatar
                        user={participant}
                        size={33}
                        classes={
                          "w-[33px] h-[33px] rounded-full cursor-pointer"
                        }
                      />
                      <label className="text-[14px] sm:text-[18px] ml-2">
                        {participant.name}
                      </label>
                    </div>
                    <span className="text-secondary-gray-4 ml-2 text-[12px] sm:text-[16px]">
                      {20 - participant.commentCount}/20 remaining
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="text-center py-2">
              <div className="flex items-center gap-x-2">
                {windowWidth >= 1024 && (
                  <button
                    className="flex items-center p-2 bg-tertiary-red text-white hover:bg-white hover:text-tertiary-red border-2 border-tertiary-red cursor-pointer shadow-lg rounded-full text-lg"
                    onClick={() => setShowInstruction(true)}
                  >
                    <InfoOutlined />
                  </button>
                )}
                {windowWidth >= 1024 && !lemonade?.isCompleted && (
                  <button
                    className="w-full bg-tertiary-red text-white active:bg-tertiary-red px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={openInviteModal}
                  >
                    Invite <GroupIcon />
                  </button>
                )}
              </div>
              <p>{lemonade?.participants.length}/5 participants</p>
            </div>
          </div>
          <hr className="mt-2 border-dotted border-[2px]" />
          <div className="grid lg:grid-cols-2 grid-cols-1 px-0">
            {(windowWidth >= 1024 || messageOpen) && (
              <div className="px-5">
                <div className="">
                  <h3 className="font-bold text-[16px] py-2">Purpose</h3>
                  <p>{lemonade?.name}</p>
                </div>
                <div className="">
                  <h3 className="font-bold text-[16px] py-2">Anchor Pillar</h3>
                  <p>{lemonade?.pillar}</p>
                </div>
                <div className="">
                  <h3 className="font-bold text-[16px] py-2">Content</h3>
                  <p>{lemonade?.description}</p>
                </div>
                <div className="flex items-center gap-x-2">
                  <h3 className="font-bold text-[16px] py-2">Sound Bite</h3>
                  <LemonadePitch
                    isRecordable={false}
                    audioData={lemonade?.pitch == "" ? null : lemonade?.pitch}
                    saveAudio={saveAudio}
                    isAudioLoading={false}
                  />
                </div>
                {lemonade?.isCompleted ? (
                  <div className="rounded-lg bg-tertiary-blue text-primary-blue p-3">
                    <div className="text-center">
                      <InfoOutlined />
                    </div>
                    <div className="font-Inter text-center">
                      This Brainstorm was completed successfully.
                    </div>
                  </div>
                ) : remaining == 0 && hasPitch ? (
                  <div className="rounded-lg bg-tertiary-blue text-primary-blue p-3">
                    <div className="text-center">
                      <InfoOutlined />
                    </div>
                    <div className="font-Inter text-center text-sm">
                      This Brainstorm was completed successfully.
                    </div>
                  </div>
                ) : remaining == 0 && !hasPitch ? (
                  <>
                    <div className="rounded-lg bg-tertiary-blue text-primary-blue p-3">
                      <div className="text-center">
                        <InfoOutlined />
                      </div>
                      <div className="font-Inter text-center">
                        Thanks for posting message, Please record your
                        completing audio here.
                      </div>
                    </div>
                    <LemonadePitch
                      isRecordable={true}
                      audioData={null}
                      saveAudio={saveAudio}
                      isAudioLoading={false}
                    />
                    {pitchError && (
                      <div className="py-1">
                        <span className="text-secondary-red text-sm">
                          Please record your pitch
                        </span>
                      </div>
                    )}
                    {pitchUploading && (
                      <div className="py-1">
                        <span className="text-sm">Uploading pitch ...</span>
                      </div>
                    )}
                    {pitch != "" && (
                      <div className="py-1">
                        <span className="text-sm">
                          Pitch was uploaded successfully
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-[16px] pt-2 pb-4">
                      I want to ...
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      {purposes.map((item: string, index: number) => {
                        return (
                          <div
                            onClick={() => {
                              setPurpose(item);
                              setPurposeError(false);
                            }}
                            key={`purpose_${index}`}
                            className={`${
                              item == purpose
                                ? "bg-primary-blue text-white"
                                : "border-primary-blue text-primary-blue"
                            } border border-1 border-primary-blue px-6 py-2 rounded-full w-fit cursor-pointer`}
                          >
                            {item}
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-secondary-gray-4 py-4">
                      <strong>{purpose}</strong> on prior comments (&quot;Yes,
                      and...&quot;)
                    </p>
                    {!remainingError && purposeError && (
                      <div className="py-1">
                        <span className="text-secondary-red text-sm">
                          Please select this field
                        </span>
                      </div>
                    )}
                    <h3 className="font-bold text-[16px] pt-2 pb-4">
                      Regarding ...
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      {focuses.map((item: string, index: number) => {
                        return (
                          <div
                            onClick={() => {
                              setFocus(item);
                              setFocusError(false);
                            }}
                            key={`focus_${index}`}
                            className={`${
                              item == focus
                                ? "bg-primary-blue text-white"
                                : "border-primary-blue text-primary-blue"
                            } border border-1 border-primary-blue px-6 py-2 rounded-full w-fit cursor-pointer`}
                          >
                            {item}
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-secondary-gray-4 py-4">
                      Direct your action toward the <strong>{focus}</strong>{" "}
                      pillar
                    </p>
                    {!remainingError && focusError && (
                      <div className="py-1">
                        <span className="text-secondary-red text-sm">
                          Please select this field
                        </span>
                      </div>
                    )}
                    <h3 className="font-bold text-[16px] pb-4">
                      My thoughts ...
                    </h3>
                    <textarea
                      rows={10}
                      value={message}
                      onChange={(e) => handleMessageChange(e.target.value)}
                      maxLength={500}
                      className={`block p-2.5 mt-0 w-full text-md text-gray-900 bg-white rounded-lg border border-gray-300              focus:outline-none focus:border-primary-blue focus:ring-primary-blue`}
                      placeholder="Enter Your thoughts here ..."
                    ></textarea>
                    <p className="text-secondary-gray-4 pt-4">
                      {message.length}/500 Characters
                    </p>
                    {!remainingError && msgError && (
                      <div className="py-1">
                        <span className="text-secondary-red text-sm">
                          Please fill this field
                        </span>
                      </div>
                    )}
                    {remainingError && (
                      <div className="py-1">
                        <span className="text-secondary-red text-sm">
                          You don&#39;t have remaining comments
                        </span>
                      </div>
                    )}
                  </>
                )}
                {!hasPitch && !lemonade?.isCompleted && (
                  <div className="mt-4 flex items-center gap-x-3">
                    <button
                      className="bg-primary-blue text-white active:bg-primary-blue px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      onClick={postMessage}
                    >
                      {isSaving ? <Spinner text={`Posting...`} /> : "Post"}
                    </button>
                    <p className="text-[22px] text-[#F2994A]">
                      {remaining}/20 remaining
                    </p>
                  </div>
                )}
              </div>
            )}
            {(windowWidth >= 1024 || !messageOpen) && (
              <div
                className={`px-2 ${
                  windowWidth >= 1024 ? "max-h-[825px]" : ""
                } overflow-y-auto lg:border-l-4 lg:border-white-500 lg:shadow`}
              >
                {comments.map((comment: any, index: number) => {
                  let colorId = 0;
                  lemonade?.participants.map(
                    (participant: any, pId: number) => {
                      if (participant.email == comment.user.email)
                        colorId = pId;
                    }
                  );
                  const classStr = messageColorClasses[colorId];
                  return (
                    <div
                      className={`flex flex-col ${
                        comment.user.email == user.email
                          ? "items-end"
                          : "items-start"
                      } py-2`}
                      key={`comment_${index}`}
                    >
                      <div className={`${classStr} max-w-[100%]`}>
                        {comment.purpose != "" ? (
                          <>
                            <strong>
                              {comment.purpose} {comment.focus}
                            </strong>
                            <p className="mt-[10px] break-words">
                              {comment.content}
                            </p>
                          </>
                        ) : (
                          <LemonadePitch
                            isRecordable={false}
                            audioData={
                              comment?.content == "" ? null : comment?.content
                            }
                            saveAudio={saveAudio}
                            isAudioLoading={false}
                          />
                        )}
                      </div>
                      <UserAvatar
                        user={comment.user}
                        size={33}
                        classes={
                          "w-[33px] h-[33px] rounded-full cursor-pointer mt-2"
                        }
                      />
                    </div>
                  );
                })}

                {comments.length == 0 && (
                  <div className="font-Inter text-center py-4">
                    No messages to display.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {windowWidth < 1024 && (
          <div className="bg-tertiary-red sticky text-white m-auto bottom-2 flex items-center border border-1 border-tertiary-red w-full rounded-full gap-2 px-3 py-4 justify-around">
            <button
              className="hover:text-tertiary-blue cursor-pointer"
              onClick={() => setMessageOpen(true)}
            >
              <SendIcon />
            </button>
            <button
              className="hover:text-tertiary-blue cursor-pointer"
              onClick={() => setMessageOpen(false)}
            >
              <ForumIcon />
            </button>
            <button
              className="hover:text-tertiary-blue cursor-pointer"
              onClick={openInviteModal}
            >
              <GroupIcon />
            </button>
            <button
              className="hover:text-tertiary-blue cursor-pointer"
              onClick={() => setShowInstruction(true)}
            >
              <InfoOutlined />
            </button>
          </div>
        )}
      </div>
      {id != null && id != undefined && (
        <InviteLemonadeParticipants
          showModal={showInviteModal}
          closeFunc={closeInviteModal}
          lemonadeId={id.toString()}
        />
      )}
      <InstructionModal
        showModal={showInstruction}
        closeFunc={closeInstructionModal}
      />
    </>
  );
};

const InstructionModal = ({
  showModal,
  closeFunc,
}: {
  showModal: boolean;
  closeFunc: Function;
}) => {
  return (
    <>
      <Transition
        show={showModal}
        enter="transition-opacity duration-100"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className={`fixed top-0 left-0 right-0 w-full flex 
                        justify-center items-center p-4 
                        overflow-x-hidden overflow-y-auto 
                        md:inset-0 h-[calc(100%-1rem)] max-h-full z-[41]`}
        >
          <div className="relative w-full max-w-3xl max-h-full font-Inter">
            <div className="relative bg-accent-yellow rounded-lg shadow">
              <button
                type="button"
                className={`absolute top-3 right-2.5 
                                    text-gray-400 bg-transparent 
                                    hover:bg-gray-200 hover:text-gray-900 
                                    rounded-lg text-sm p-1.5 ml-auto inline-flex items-center`}
                onClick={() => closeFunc()}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="px-6 pt-4 pb-2 rounded">
                <h1 className="flex items-center text-base font-semibold font-Inter text-gray-900 lg:text-xl gap-x-2">
                  <ExtensionOutlinedIcon /> Battle of entrepreneurial wits
                  instructions
                </h1>
              </div>
              <div className="px-6 pb-4 max-h-[814px] overflow-y-auto">
                <div className="font-Inter text-[14px]">
                  <p className="mt-0 mb-2 font-bold">
                    1. Select the purpose of your comment:
                  </p>
                  <ul className="ml-[20px] list-unset">
                    <li className="pt-0 pb-1">
                      <strong>Expand</strong> = to build upon the prior
                      commenter&#39;s narrative to either provide more
                      color/context
                    </li>
                    <li className="py-1">
                      <strong>Clarify</strong> = to refine a prior statement you
                      made, or to respond to someone&#39;s misinterpretation;
                    </li>
                    <li className="py-1">
                      <strong>Challenge</strong> = to thoughtfully express doubt
                      with a reason provided, or to play devil&#39;s advocate
                    </li>
                    <li className="py-1">
                      <strong>Counter</strong> = to provide logic or proof as a
                      comeback to a challenge
                    </li>
                    <li className="py-1">
                      <strong>Diverge</strong> = to to pivot the brainstorm
                      thread by swapping only 1 story pillar at a time
                    </li>
                  </ul>
                </div>
                <div className="font-Inter text-[14px]">
                  <p className="my-2 font-bold">
                    2. Select the focus(problem, character, setting, solution)
                    of your comment
                  </p>
                  <Image
                    src={InstructionImg}
                    alt="Instruction Image"
                    className="m-auto"
                    height={312}
                  />
                </div>
                <div className="font-Inter text-[14px]">
                  <p className="mt-2 mb-2 font-bold">
                    3. Comment(you have 20 comments available)
                  </p>
                  <p className="ml-[20px] text-tertiary-red">Examples:</p>
                  <ul className="ml-[20px] list-none text-tertiary-red italic">
                    <li className="py-1">
                      <strong>CHALLENGE Problem</strong> = &quot;I understand
                      the general problem space you&#39;re in, but it&#39; a
                      huge problem. What are the specific pain points you&#39;re
                      trying to address?&quot;
                    </li>
                    <li className="py-1">
                      <strong>EXPAND Solution</strong> &quot;since your product
                      requires staff to understand how to interpret the data,
                      perhaps you can add a service component to your offering
                      and create a SAAS model?&quot;
                    </li>
                    <li className="py-1">
                      <strong>CHALLENGE Character</strong> &quot;even though the
                      pain point is real, I don&#39;t believe folks realize the
                      problem until it&#39;s too late and therefore too late to
                      purchase your product&quot;
                    </li>
                    <li className="py-1">
                      <strong>DIVERGE Character</strong> &quot;I wonder if
                      instead of focusing on the pediatric market, there&#39;s
                      more demand in the geriatric market, as they have the same
                      pain point, and are the user and the buyer which can
                      simplify&quot;
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <div
        className={`bg-gray-900 bg-opacity-50 fixed inset-0 z-40 ${
          !showModal ? "hidden" : ""
        }`}
      ></div>
    </>
  );
};

export default LemonadeDetail;
