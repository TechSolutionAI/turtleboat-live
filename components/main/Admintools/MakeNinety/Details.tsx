import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Swal from "sweetalert2";
import Spinner from "@/components/Spinner";
import TokenItem from "@/components/layouts/TokenItem";
import UserAvatar from "@/components/UserAvatar";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import { NinetyVideo, VideoComment } from "@/types/ninetyvideo.type";
import { formatDate } from "@/utils/utils";

import { emotionList } from "@/utils/constant";
import Link from "next/link";

const Details = () => {
  const { data: session, status } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const { id } = router.query;
  let videoId = "";
  if (typeof id === "string" && id !== "") {
    videoId = id.toString();
  }
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState(false);
  const [video, setVideo] = useState<NinetyVideo>();
  const [moreVideos, setMoreVideos] = useState<NinetyVideo[]>([]);
  const [commentList, setCommentList] = useState<VideoComment[]>([]);
  const [isClicked, setIsClicked] = useState(false);
  const [problem, setProblem] = useState("");
  const [helpee, setHelpee] = useState("");
  const [reason, setReason] = useState("");
  const [solution, setSolution] = useState("");

  const [emotions, setEmotions] = useState<any[]>(emotionList);

  const getVideo = async () => {
    if (videoId != "") {
      setIsLoading(true);
      const response = await fetch(`/api/makeninety/${id}`, {
        method: "GET",
      });

      if (!response.ok) {
        setIsLoading(false);
        const { err } = await response.json();
        console.log(err);
      } else {
        const { video, moreVideos } = await response.json();
        setVideo(video);
        document.title = video.title + " - Turtle Boat Admin";
        setMoreVideos(moreVideos);
        if (video?.type != 1) {
          video.comments.map((commentItem: any) => {
            if (commentItem.user._id == user._id) {
              const emotionsData = emotionList.map((emotion: any) => {
                if (emotion.value == commentItem.emotion) {
                  return {
                    text: emotion.text,
                    img: emotion.img,
                    value: emotion.value,
                    isSelected: true,
                  };
                } else {
                  return emotion;
                }
              });

              setEmotions(emotionsData);
            }
          });
        }
        setCommentList(video.comments.reverse());
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getVideo();
  }, []);

  const handleBackClick = () => {
    router.push("/dashboard/admin/makeninety");
  };

  const handleAddComment = () => {
    let comment_temp: VideoComment = {
      problem: problem,
      helpee: helpee,
      reason: reason,
      solution: solution,
      user: user,
    };
    if (problem != "" || helpee != "" || reason != "" || solution != "") {
      addComment(comment_temp);
    }
  };

  const handleAddEmoji = async (emojivalue: number) => {
    // setIsCreating(true);
    const response = await fetch(`/api/ninetyemoji/${videoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: {
          emotion: emojivalue,
          user: user,
        },
      }),
    });

    if (!response.ok) {
      const { err } = await response.json();
      console.log(err);
      // Swal.fire({
      //     icon: 'error',
      //     title: 'Oops...',
      //     text: err,
      // })
      //     .then(() => {
      //         setIsCreating(false);
      //         console.log("Saving failed");
      //     })
      //     .catch(err => console.log(err));
    } else {
      // setIsCreating(false);
      // Swal.fire({
      //     icon: 'success',
      //     title: 'Success!',
      //     allowOutsideClick: false,
      //     text: `Your feedback was posted successfully!`,
      // }).then(() => {
      // }).catch(err => console.log(err));
    }
  };

  const addComment = async (data: VideoComment) => {
    setIsCreating(true);
    const response = await fetch(`/api/makeninety/${videoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: data,
        type: 1,
      }),
    });

    if (!response.ok) {
      const { err } = await response.json();
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err,
      })
        .then(() => {
          setIsCreating(false);
          console.log("Saving failed");
        })
        .catch((err) => console.log(err));
    } else {
      setIsCreating(false);
      Swal.fire({
        icon: "success",
        title: "Success!",
        allowOutsideClick: false,
        text: `Your feedback was posted successfully!`,
      })
        .then(() => {
          setCommentList((prev) => [data, ...prev]);
          setIsClicked(false);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="grid place-items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center sticky top-0 bg-white z-10 pt-2 pb-4">
            <div
              className="cursor-pointer flex items-center text-[20px] font-Inter font-bold lg:flex p-2"
              onClick={handleBackClick}
            >
              <span className="flex">
                <KeyboardBackspaceIcon />
              </span>
              <span className="font-Inter font-bold ml-[15px]">All Videos</span>
            </div>
            <TokenItem />
          </div>

          {video != undefined &&
            (video.type == 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-y-4 sm:gap-8">
                <div className="col-span-12 lg:col-span-7">
                  <video
                    className="rounded-2xl w-full max-h-[400px] min-h-[400px]"
                    controls
                  >
                    <source src={video?.video.url} />
                  </video>
                  <div className="font-Inter inline-grid gap-y-1 pt-2">
                    <label className="text-lg font-semibold">
                      {video?.title}
                    </label>
                    <p className="my-[10px]">{video?.description}</p>
                    <label>{video?.author.name}</label>
                    <label>{formatDate(video?.updatedAt)}</label>
                  </div>
                  <div className="mt-7">
                    <label className="text-lg font-semibold font-Inter">
                      More Videos By This Member
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                      {moreVideos.map(
                        (videoItem: NinetyVideo, index: number) => {
                          return (
                            <Link
                              key={`video_item_${index}`}
                              className="grid grid-cols-10 gap-3 font-Inter cursor-pointer"
                              href={`/dashboard/core/makeninety/${videoItem._id}`}
                            >
                              <div className="col-span-4">
                                <video className="rounded-lg max-h-[100px] w-[100%] object-cover">
                                  <source src={videoItem.video.url} />
                                </video>
                              </div>
                              <div className="col-span-6">
                                <Link
                                  href={`/dashboard/core/makeninety/${videoItem._id}`}
                                  className="text-md break-words text-[#333] font-bold font-Inter cursor-pointer"
                                >
                                  {videoItem.title}
                                </Link>
                              </div>
                            </Link>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-5 bg-gray-100 rounded-lg border-[1px] border-secondary-gray font-Inter">
                  <>
                    {isClicked ? (
                      <div className="px-5 font-Inter border-[1px] border-secondary-gray">
                        <div className="inline-grid py-5">
                          <label className="text-lg font-semibold">
                            ADD COMMENT
                          </label>
                          <label className="text-md">
                            Respond to each prompt to submit your comment
                          </label>
                        </div>
                        <div>
                          <div>
                            <div className="flex justify-between text-md py-2">
                              <label className="font-semibold">
                                What I hear is the problem you are addressing
                              </label>
                              <label className="">{problem.length}/250</label>
                            </div>
                            <textarea
                              maxLength={250}
                              rows={3}
                              className="block p-3 w-full text-[14px] text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-primary-blue focus:ring-primary-blue placeholder:text-[14px]"
                              placeholder="Write your answers here..."
                              onChange={(e) => {
                                setProblem(e.target.value);
                              }}
                              value={problem}
                            ></textarea>
                          </div>

                          <div>
                            <div className="flex justify-between text-md py-2">
                              <label className="font-semibold">
                                Who I think you&#39;re trying to help
                              </label>
                              <label className="">{helpee.length}/250</label>
                            </div>
                            <textarea
                              maxLength={250}
                              rows={3}
                              className="block p-3 w-full text-[14px] text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-primary-blue focus:ring-primary-blue placeholder:text-[14px]"
                              placeholder="Write your answers here..."
                              onChange={(e) => {
                                setHelpee(e.target.value);
                              }}
                              value={helpee}
                            ></textarea>
                          </div>

                          <div>
                            <div className="flex justify-between text-md py-2">
                              <label className="font-semibold">
                                Why I (as the listener) should care about this
                                problem
                              </label>
                              <label className="">{reason.length}/250</label>
                            </div>
                            <textarea
                              maxLength={250}
                              rows={3}
                              className="block p-3 w-full text-[14px] text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-primary-blue focus:ring-primary-blue placeholder:text-[14px]"
                              placeholder="Write your answers here..."
                              onChange={(e) => {
                                setReason(e.target.value);
                              }}
                              value={reason}
                            ></textarea>
                          </div>

                          <div>
                            <div className="flex justify-between text-md py-2">
                              <label className="font-semibold">
                                What I believe is your unique approach to
                                solving this problem
                              </label>
                              <label className="">{solution.length}/250</label>
                            </div>
                            <textarea
                              maxLength={250}
                              rows={3}
                              className="block p-3 w-full text-[14px] text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-primary-blue focus:ring-primary-blue placeholder:text-[14px]"
                              placeholder="Write your answers here..."
                              onChange={(e) => {
                                setSolution(e.target.value);
                              }}
                              value={solution}
                            ></textarea>
                          </div>
                        </div>
                        <div className="flex justify-end py-5 gap-7 text-md">
                          <button
                            className="px-3 py-3 font-bold"
                            onClick={() => setIsClicked(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-3 py-3 bg-[#2E65F3] text-white font-bold rounded-lg"
                            onClick={handleAddComment}
                          >
                            {isCreating ? (
                              <Spinner text="Saving..." />
                            ) : (
                              "Comment"
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between px-7 py-6 border-b-[1px] border-secondary-gray text-lg items-center">
                        <label className="font-semibold">COMMENTS</label>
                        <button
                          className="px-2 py-2 bg-primary-black text-sm text-white rounded-md"
                          onClick={() => {
                            setIsClicked(true);
                            setProblem("");
                            setHelpee("");
                            setReason("");
                            setSolution("");
                          }}
                        >
                          Add Comment
                        </button>
                      </div>
                    )}

                    {commentList.map((item: VideoComment, index: number) => {
                      return (
                        <div
                          key={`comment_${index}`}
                          className="px-5 border-b-[1px] border-secondary-gray py-4"
                        >
                          <div className="flex items-center">
                            <UserAvatar
                              user={item.user}
                              size={33}
                              classes={
                                "w-[33px] h-[33px] rounded-full cursor-pointer"
                              }
                            />
                            <label className="text-lg ml-4">
                              {item.user?.name}
                            </label>
                          </div>
                          <div className="flex flex-col">
                            <div className="mt-3 text-md">
                              <label className="font-semibold">
                                What I hear is the problem you are addressing
                              </label>
                              <p className="mt-1 break-words">{item.problem}</p>
                            </div>
                            <div className="mt-3 text-md">
                              <label className="font-semibold">
                                Who I think you&#39;re trying to help
                              </label>
                              <p className="mt-1 break-words">{item.helpee}</p>
                            </div>

                            <div className="mt-3 text-md">
                              <label className="font-semibold">
                                Why I (as the listener) should care about this
                                problem
                              </label>
                              <p className="mt-1 break-words">{item.reason}</p>
                            </div>

                            <div className="mt-3 text-md">
                              <label className="font-semibold">
                                What I believe is your unique approach to
                                solving this problem
                              </label>
                              <p className="mt-1 break-words">
                                {item.solution}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                </div>
              </div>
            ) : (
              <div className="w-full lg:w-[70%] m-auto">
                <div className="">
                  <video
                    className="rounded-2xl w-full max-h-[400px] min-h-[400px]"
                    controls
                  >
                    <source src={video?.video.url} />
                  </video>
                  <div className="font-Inter inline-grid gap-y-1 pt-2">
                    <label className="text-lg font-semibold">
                      {video?.title}
                    </label>
                    <p className="my-[10px]">{video?.description}</p>
                    <label>{video?.author.name}</label>
                    <label>{formatDate(video?.updatedAt)}</label>
                  </div>
                  {
                    <div className="block md:flex mt-5">
                      <div className="block sm:flex items-center justify-center">
                        {emotions.map((item: any, index: number) => {
                          if (!(video.type == 2 && index == 0)) {
                            return (
                              <div
                                key={`emoji_${index}`}
                                onClick={() => {
                                  handleAddEmoji(
                                    !item.isSelected ? item.value : -1
                                  );
                                  const temp = [...emotions];
                                  const newEmotions = temp.map(
                                    (tempItem: any) => {
                                      if (item.value == tempItem.value) {
                                        return {
                                          text: tempItem.text,
                                          img: tempItem.img,
                                          value: tempItem.value,
                                          isSelected: !item.isSelected,
                                        };
                                      } else {
                                        return {
                                          text: tempItem.text,
                                          img: tempItem.img,
                                          value: tempItem.value,
                                          isSelected: false,
                                        };
                                      }
                                    }
                                  );
                                  setEmotions(newEmotions);
                                }}
                                className={`flex flex-col rounded-lg items-center cursor-pointer p-1 ${
                                  item.isSelected
                                    ? "bg-primary-blue text-white"
                                    : ""
                                }`}
                              >
                                <Image
                                  src={item.img}
                                  alt={item.text}
                                  width={45}
                                  height={45}
                                />
                                <div className="w-[75px] text-center">
                                  {item.text}
                                </div>
                              </div>
                            );
                          }
                        })}
                      </div>
                      {/* <div className="flex items-center justify-center py-2">
                                            <button className="px-2 py-2 bg-primary-black text-sm text-white rounded-md" 
                                            onClick={handleAddEmoji}>{isCreating ? <Spinner text="Saving..." /> : "Save Feedback"}</button>
                                        </div> */}
                    </div>
                  }
                  <div className="mt-7">
                    <label className="text-lg font-semibold font-Inter">
                      More Videos By This Member
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                      {moreVideos.map(
                        (videoItem: NinetyVideo, index: number) => {
                          return (
                            <Link
                              key={`video_item_${index}`}
                              className="grid grid-cols-10 gap-3 font-Inter cursor-pointer"
                              href={`/dashboard/core/makeninety/${videoItem._id}`}
                            >
                              <div className="col-span-4">
                                <video className="rounded-lg max-h-[100px] w-[100%] object-cover">
                                  <source src={videoItem.video.url} />
                                </video>
                              </div>
                              <div className="col-span-6">
                                <Link
                                  href={`/dashboard/core/makeninety/${videoItem._id}`}
                                  className="text-md break-words text-[#333] font-bold font-Inter cursor-pointer"
                                >
                                  {videoItem.title}
                                </Link>
                              </div>
                            </Link>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </>
      )}
    </>
  );
};

export default Details;
