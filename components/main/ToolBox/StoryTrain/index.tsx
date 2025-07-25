import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import Image from "next/image";
import Swal from "sweetalert2";
import OutsideClickHandler from "react-outside-click-handler";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Tooltip } from "react-tooltip";

import OpeningImg from "/public/static/images/train_opening_cartoon.png";
import ProblemImg from "/public/static/images/train_problem_cartoon.png";
import SolutionImg from "/public/static/images/train_solution_cartoon.png";
import SettingImg from "/public/static/images/train_setting_cartoon.png";
import CharacterImg from "/public/static/images/train_character_cartoon.png";
import ClosingImg from "/public/static/images/train_closing_cartoon.png";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import Spinner from "@/components/Spinner";
import CommentItem from "@/components/main/Module/CommentItem";
import Upload from "@/components/main/Module/Upload";
import Editor from "@/components/main/Module/Editor";
import { Venture } from "@/types/venture.type";
import { Comment } from "@/types/module.type";
import { trains } from "@/utils/constant";

const trainAssets = [
  {
    color: "#000000",
    textColor: "#000000",
    img: OpeningImg,
  },
  {
    color: "#4169e1",
    textColor: "#2a52cb",
    img: ProblemImg,
  },
  {
    color: "#5A2391",
    textColor: "#5A2391",
    img: CharacterImg,
  },
  {
    color: "#00BEBE",
    textColor: "#027879",
    img: SettingImg,
  },
  {
    color: "#ff00ff",
    textColor: "#8b008a",
    img: SolutionImg,
  },
  {
    color: "#000000",
    textColor: "#000000",
    img: ClosingImg,
  },
];

const Index = () => {
  const { data: session } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  let ventureId = "";
  const { id } = router.query;
  if (typeof id === "string" && id !== "") {
    ventureId = id.toString();
  }

  const [trainItems, setTrainItems] = useState<any[]>(trains);
  const [venture, setVenture] = useState<Venture>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [ventureList, setVentureList] = useState<any[]>([]);
  const [saveDropdownOpen, setSaveDropdownOpen] = useState<boolean>(false);
  const [selectedVentureIndex, setSelectedVentureIndex] = useState<number>(-1);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState<string>("");
  const [memberType, setMemberType] = useState<string>("");
  const [files, setFormFiles] = useState<FileList | null>(null);
  const [isCommentSaved, setIsCommentSaved] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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
        setVenture(venture);
        if (venture.mentee != null && venture.mentee != undefined) {
          if (venture.mentee.email == user.email) {
            setIsEditable(true);
            setMemberType("mentee");
          } else {
            setMemberType("mentor");
          }
        }
        if (venture.storyTrain != undefined && venture.storyTrain != null) {
          setTrainItems(venture.storyTrain);
        }
        if (venture.storyTrainComments != undefined && venture.storyTrainComments != null) {
          setComments(venture.storyTrainComments);
        }
        setIsLoading(false);
      }
    } else {
      if (user != undefined) {
        setIsLoading(true);
        const response = await fetch(`/api/users/${user._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          setIsLoading(false);
          const { err } = await response.json();
          console.log(err);
        } else {
          const { ventures, userVentures } = await response.json();
          let savingOptions: any[] = [];
          userVentures.map((userVentureItem: any) => {
            ventures.map((ventureItem: any) => {
              if (
                ventureItem._id == userVentureItem.ventureId &&
                userVentureItem.role == "mentee"
              ) {
                savingOptions.push({
                  label: ventureItem.title,
                  value: ventureItem._id,
                });
              }
            });
          });
          setIsEditable(true);
          setVentureList(savingOptions);
          setIsLoading(false);
        }
      } else {
        setIsEditable(true);
      }
    }
  };

  useEffect(() => {
    document.title = "ToolBox - Story Train - Turtle Boat";
    getVenture();
  }, []);

  const saveStoryTrain = async (index: number) => {
    if (session != undefined) {
      setIsSaving(true);
      var data = trainItems;
      const response = await fetch("/api/storytrain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vid: ventureId != "" ? ventureId : ventureList[index].value,
          data: data,
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
            setIsSaving(false);
            console.log("Saving failed");
          })
          .catch((err) => console.log(err));
      } else {
        setIsSaving(false);
        Swal.fire({
          icon: "success",
          title: "Success!",
          allowOutsideClick: false,
          text: `Story Train was save successfully!`,
        })
          .then(() => { })
          .catch((err) => console.log(err));
      }
    } else {
      // Alert Part for Non-members
    }
  };

  const handleCancelClicked = () => {
    if (session != undefined && ventureId != "") {
      router.push(`/dashboard/myventures/${ventureId}`);
    } else {
      router.push(`/dashboard/toolbox`);
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(trainItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTrainItems(items);
  };

  const handleTrainItemChange = (e: any, index: number) => {
    let temp = [...trainItems];
    temp[index].value = e.target.value;
    setTrainItems(temp);
  };

  const addComment = (comment: Comment) => {
    setComments((prev) => [...prev, comment]);
    setCommentContent("");
    setFormFiles(null);
    setIsCommentSaved(true);
  };

  const saveComment = async () => {
    if (commentContent != "" || files != null) {
      const formData = new FormData();
      formData.append("content", commentContent);
      if (typeof ventureId === "string" && ventureId !== "") {
        formData.append("vid", ventureId.toString());
      }
      if (typeof user._id === "string" && user._id !== "") {
        formData.append("uid", user._id.toString());
      }
      if (files != null) {
        for (let i = 0; i < files.length; i++) {
          formData.append(`file${i}`, files[i]);
        }
      }

      setIsCreating(true);
      const response = await fetch("/api/comments/storytrain", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setIsCreating(false);
        const { err } = await response.json();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err,
        }).then(() => {
          setIsCreating(false);
        }).catch((err) => console.log(err));
      } else {
        const { result } = await response.json();
        setIsCreating(false);
        addComment(result);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="grid place-items-center h-screen">
          <Spinner text="Loading story train ..." />
        </div>
      ) : (
        <>
          <div className="flex flex-row w-full bg-white justify-between items-center p-[20px] z-20 sticky top-0 pb-4 pt-2 bg-white ">
            <a
              onClick={handleCancelClicked}
              className="cursor-pointer flex items-center text-[20px] font-Inter font-bold lg:flex"
            >
              <span className="flex">
                <KeyboardBackspaceIcon />
              </span>
              <h1 className="ml-[15px]">
                Back to{" "}
                {router.pathname.includes("[id]")
                  ? `${venture?.mentee.name}'s Dashboard`
                  : "Toolbox"}
              </h1>
            </a>
            <div className="relative">
              {isEditable &&
                (ventureId != "" ? (
                  <button
                    className="flex items-center justify-center ml-[15px] bg-tertiary-red text-white active:bg-tertiary-red px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 font-Inter truncate"
                    type="button"
                    onClick={() => saveStoryTrain(-1)}
                  >
                    {isSaving ? <Spinner text="Saving" /> : "Save"}
                  </button>
                ) : (
                  <button
                    className="flex items-center justify-center bg-tertiary-red text-white active:bg-tertiary-red px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 font-Inter truncate"
                    type="button"
                    onClick={() => {
                      if (session != undefined) {
                        setSaveDropdownOpen(!saveDropdownOpen);
                      } else {
                        // Alert Part for Non-members
                      }
                    }}
                  >
                    {isSaving ? <Spinner text="Saving" /> : "Save to Venture"}
                    <span className="flex">
                      <KeyboardArrowDownRoundedIcon />
                    </span>
                  </button>
                ))}
              {saveDropdownOpen && (
                <OutsideClickHandler
                  onOutsideClick={() => setSaveDropdownOpen(false)}
                >
                  <div
                    className={`absolute left-0 z-0 top-10 mt-[10px] border-2 border-secondary-gray w-[200px] rounded-[8px] bg-white`}
                  >
                    <ul className="font-Inter font-semibold text-sm px-0">
                      {ventureList.map((option: any, index: number) => {
                        return (
                          <li
                            key={`venture_item_${index}`}
                            className="flex items-center justify-between px-[20px] py-[10px] cursor-default border-b-2 border-secondary-gray"
                            onClick={() => {
                              setSaveDropdownOpen(!saveDropdownOpen);
                              setSelectedVentureIndex(index);
                              saveStoryTrain(index);
                            }}
                          >
                            {option.label}
                            {index == selectedVentureIndex && (
                              <CheckCircleIcon fontSize="small" />
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </OutsideClickHandler>
              )}
            </div>
          </div>
          <div className="mt-[40px] rounded-xl lg:mx-[5%] xl:mx-[10%] 2xl:mx-[15%] px-[40px] py-[34px] flex flex-col justify-center font-Inter">
            The value of an idea is zero unless it can be communicated. Whether
            it&#39;s potential users, investors, or partners, you&#39;ll need to
            be able to tell convey key points in an engaging and often
            time-constrained situation. Use this Story Train to craft your sound
            bites. You will always need an Opening Hook to start (such as a
            personal anecdote or shocking stat) and a Closing Hook (such as why
            you chose this particular problem to solve, why you believe your
            solution offers better benefits, and why you feel you are the right
            person to tackle this problem) to end, but you can drag the sound
            bites of your 4 Pillars and re-arrange how you want to tell the
            story.
          </div>
          <div className="py-10 flex space-between font-Inter">
            {trainItems.map((item: any, index: number) => {
              return (
                <div className="relative" key={`train-${index}`}>
                  <Image src={trainAssets[item.order].img} alt={item.label} />
                  <p
                    className={`font-Inter font-bold pt-5 truncate text-center text-[${trainAssets[item.order].color
                      }]`}
                    style={{
                      color: `${trainAssets[item.order].color}`,
                    }}
                  >
                    {item.label}
                  </p>
                  {index == 0 ? (
                    <p
                      className={`hidden lg:visible absolute w-full top-[30%] pr-[8%] pl-[15%] font-Inter font-bold break-words lg:text-xs xl:line-clamp-3 xl:text-sm text-xs line-clamp-3 text-[${trainAssets[item.order].color
                        }]`}
                      style={{
                        color: `${trainAssets[item.order].textColor}`,
                      }}
                      data-tooltip-id={"train-tool-tip"}
                      data-tooltip-content={item.value}
                      data-tooltip-place="top"
                    >
                      {item.value}
                    </p>
                  ) : (
                    <p
                      className={`hidden lg:visible absolute w-full top-[20%] px-[8%] font-Inter font-bold break-words lg:text-xs xl:line-clamp-4 xl:text-sm text-xs line-clamp-3 text-[${trainAssets[item.order].color
                        }]`}
                      style={{
                        color: `${trainAssets[item.order].textColor}`,
                      }}
                      data-tooltip-id={"train-tool-tip"}
                      data-tooltip-content={item.value}
                      data-tooltip-place="top"
                    >
                      {item.value}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <Tooltip id={"train-tool-tip"} className={`train-tooltip`} />
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="tasks" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="grid grid-cols-1 lg:grid-cols-6 gap-y-[30px] gap-x-8 trains"
                >
                  {trainItems.map((item: any, index: number) => {
                    if (index == 0 || index == trainItems.length - 1) {
                      return (
                        <div
                          key={item.id}
                          className="border border-dashed border-1 border-primary-black px-4 pt-5 pb-8"
                        >
                          <h2 className="text-black font-Inter text-md text-center font-bold">
                            {item.label}
                          </h2>
                          <div className="mt-4 text-black font-Inter text-sm text-center">
                            {isEditable ? (
                              <textarea
                                className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-primary-blue focus:ring-primary-blue break-words"
                                maxLength={350}
                                rows={20}
                                value={item.value}
                                onChange={(e) =>
                                  handleTrainItemChange(e, index)
                                }
                              />
                            ) : (
                              <p className="break-words">{item.value}</p>
                            )}
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <Draggable
                          key={item.id}
                          draggableId={item.id.toString()}
                          index={index}
                          isDragDisabled={
                            index == 0 || index == trainItems.length - 1
                              ? true
                              : !isEditable
                          }
                        >
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className="border border-dashed border-1 border-primary-black px-4 pt-5 pb-8"
                            >
                              {isEditable && (
                                <DragIndicatorIcon className="absolute text-secondary-gray-4" />
                              )}
                              <h2 className="text-black font-Inter text-md text-center font-bold">
                                {item.label}
                              </h2>
                              <div className="mt-4 text-black font-Inter text-sm text-center">
                                {isEditable ? (
                                  <textarea
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-primary-blue focus:ring-primary-blue break-words"
                                    maxLength={350}
                                    rows={20}
                                    value={item.value}
                                    onChange={(e) =>
                                      handleTrainItemChange(e, index)
                                    }
                                  />
                                ) : (
                                  <p className="break-words">{item.value}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    }
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* <div className="mt-[40px] rounded-xl bg-[#F7F7F9] px-[40px] py-[34px] flex flex-col justify-center font-Inter">
            <h1 className="font-Inter font-bold text-xl sm:mt-[35px] mt-[10px]">
              Mentor/Mentee Discussion
            </h1>
            {
              comments != null &&
              comments.length > 0 &&
              comments.map((comment: Comment, index: number) => {
                return (
                  <div key={`comment-${index}`}>
                    <CommentItem comment={comment} serverTime={serverTime} />
                  </div>
                );
              })
            }
            {
              memberType == "mentee" ? (
                <Upload setFormFiles={setFormFiles} isInit={isCommentSaved} />
              ) : (
                <></>
              )
            }
            <Editor
              value={commentContent}
              onChange={(data) => {
                setCommentContent(data);
              }}
            />
            <div className="flex items-center justify-end font-Inter font-bold pt-5">
              <button
                className="text-[#232325] background-transparent px-6 py-2 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={handleCancelClicked}
              >
                Cancel
              </button>
              <button
                className="bg-primary-blue text-white active:bg-primary-blue px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={saveComment}
              >
                {isCreating ? <Spinner text="Posting..." /> : "Post"}
              </button>
            </div>
          </div> */}
          {/* <ul className="grid grid-cols-6 gap-y-[30px] gap-x-8 trains">
                            {
                                trains.map((item: any, index: number) => { 
                                    return (
                                        <li className="border border-dashed border-1 border-primary-black px-4 pt-5 pb-8">
                                            <div className="text-black font-Inter text-md text-center">
                                                {item.label}
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul> */}
          {/* {
                            isEditable &&
                            <div className="flex items-center justify-end font-Inter font-bold pt-5">
                                <button
                                    className="bg-primary-blue text-white active:bg-primary-blue px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={saveStoryTrain}
                                >
                                    {isSaving ? <Spinner text='Saving ...'/> : 'Save story train'}
                                </button>
                            </div>
                        } */}
        </>
      )}
    </>
  );
};

export default Index;
