import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import dynamic from "next/dynamic";
import { ModuleItem } from "@/types/module.type";

import Image from "next/image";
import Swal from "sweetalert2";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import InfoIcon from "@mui/icons-material/Info";
import OutsideClickHandler from "react-outside-click-handler";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import IcoDocument from "/public/static/images/document.svg";

import Spinner from "@/components/Spinner";
import Upload from "./Upload";
import CommentItem from "./CommentItem";
import { Comment } from "@/types/module.type";
import { checkListLabels } from "@/database/modules";
import CommentList from "./CommentList";
const EditorView = dynamic(() => import("@/components/EditorView"), {
    ssr: false,
});
const Editor = dynamic(() => import("./Editor"), { ssr: false });

const Index = () => {
    const { data: session } = useSession();
    const user = session?.user as User;
    const router = useRouter();
    let selectedVentureId = localStorage.getItem("selectedVentureId");
    let moduleId = "";
    const { id } = router.query;
    if (typeof id === "string" && id !== "") {
        selectedVentureId = id.split("-")[0];
        moduleId = id.split("-")[1];
    }
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isCheckedOff, setIsCheckedOff] = useState(false);
    const [isCommentSaved, setIsCommentSaved] = useState(false);
    const [moduleItem, setModuleItem] = useState<ModuleItem>();
    const [moduleTitle, setModuleTitle] = useState<string>("");
    const [menteeName, setMenteeName] = useState<string>("");
    const [serverTime, setServerTime] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [checkListValues, setCheckListValues] = useState<boolean[]>([]);
    const [memberType, setMemberType] = useState<string>("");
    const [commentContent, setCommentContent] = useState<string>("");
    const [files, setFormFiles] = useState<FileList | null>(null);

    const getModule = async () => {
        setIsLoading(true);
        const response = await fetch(`/api/ventures/${selectedVentureId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                mid: moduleId,
            }),
        });

        if (!response.ok) {
            setIsLoading(false);
            const { err } = await response.json();
            console.log(err);
        } else {
            const { venture, serverTime } = await response.json();
            setServerTime(serverTime);
            if (venture.length > 0) {
                if (venture[0].matchedModules.length > 0) {
                    setModuleTitle(venture[0].matchedModules[0].module.title);
                    document.title =
                        "Module - " +
                        venture[0].matchedModules[0].module.title +
                        " - Turtle Boat";
                    setModuleItem(venture[0].matchedModules[0]);
                    if (
                        venture[0].matchedModules[0].checkList != null &&
                        venture[0].matchedModules[0].checkList != undefined
                    ) {
                        setCheckListValues(venture[0].matchedModules[0].checkList);
                    } else {
                        const defaultCheckList = checkListLabels.map((item: string) => {
                            return false;
                        });
                        setCheckListValues(defaultCheckList);
                    }
                    setContent(venture[0].matchedModules[0].module.content);
                    if (
                        venture[0].matchedModules[0].isCheckedOff != undefined &&
                        venture[0].matchedModules[0].isCheckedOff != null
                    ) {
                        setIsCheckedOff(venture[0].matchedModules[0].isCheckedOff);
                    }
                    if (venture[0].matchedModules[0].comments) {
                        setComments(venture[0].matchedModules[0].comments);
                    }
                }
                if (venture[0].mentee != null && venture[0].mentee != undefined) {
                    setMenteeName(venture[0].mentee.name);
                    if (venture[0].mentee.email == user.email) {
                        setMemberType("mentee");
                    } else {
                        setMemberType("mentor");
                    }
                }
            }
            setIsLoading(false);
        }
    };

    const addComment = (comment: Comment) => {
        setComments((prev) => [...prev, comment]);
        setCommentContent("");
        setFormFiles(null);
        setIsCommentSaved(true);
    };

    const handleCancelClicked = () => {
        router.push(`/dashboard/myventures/${selectedVentureId}`);
    };

    const saveModuleComment = async () => {
        if (commentContent != "" || files != null) {
            const formData = new FormData();
            formData.append("content", commentContent);
            if (typeof moduleId === "string" && moduleId !== "") {
                formData.append("mid", moduleId);
            }
            if (typeof selectedVentureId === "string" && selectedVentureId !== "") {
                formData.append("vid", selectedVentureId.toString());
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
            const response = await fetch("/api/comments", {
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
                // Swal.fire({
                //     icon: "success",
                //     title: "Success!",
                //     allowOutsideClick: false,
                //     text: `Your comment was added successfully!`,
                // })
                //     .then(() => {
                //     })
                //     .catch((err) => console.log(err));
            }
        }
    };

    const toggleIsCheckedOff = async () => {
        const formData = new FormData();
        formData.append("content", commentContent);
        if (typeof moduleId === "string" && moduleId !== "") {
            formData.append("mid", moduleId);
        }
        if (typeof selectedVentureId === "string" && selectedVentureId !== "") {
            formData.append("vid", selectedVentureId.toString());
        }
        formData.append("checked", !isCheckedOff ? "1" : "0");
        const response = await fetch("/api/comments", {
            method: "PUT",
            body: formData,
        });

        if (!response.ok) {
            const { err } = await response.json();
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err,
            })
                .then(() => { })
                .catch((err: any) => console.log(err));
        } else {
            const { result } = await response.json();
            setIsCheckedOff(!isCheckedOff);
        }
    };

    const saveCheckList = async () => {
        const response = await fetch("/api/checklist", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                vid: selectedVentureId,
                mid: moduleId,
                checkList: checkListValues,
            }),
        });

        if (!response.ok) {
            const { err } = await response.json();
            console.log(err);
        } else {
            const { result } = await response.json();
        }
    };

    const handleCheckListChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        let temp = [...checkListValues];
        temp[index] = temp[index] ? false : true;
        setCheckListValues(temp);
    };

    useEffect(() => {
        getModule();
    }, []);

    return (
        <>
            {
                isLoading ? (
                    <div className="grid place-items-center h-screen">
                        <Spinner />
                    </div>
                ) : (
                    <>
                        <div className="block md:flex flex-row justify-between w-full bg-white items-center mt-[-40px] p-[20px] z-20">
                            <a
                                onClick={handleCancelClicked}
                                className="cursor-pointer flex items-center text-[20px] font-Inter font-bold lg:flex"
                            >
                                <span className="flex">
                                    <KeyboardBackspaceIcon />
                                </span>
                                <h1 className="ml-[15px]">
                                    Back to {menteeName}&#39;s Dashboard
                                </h1>
                            </a>
                            <div className="md:w-auto w-[100%] relative inline-flex items-center cursor-pointer gap-x-2">
                                {/* <button className={`rounded-[50px] my-[7px] text-secondary-gray-4 float-right bg-[#F3F4F6]`} onClick={() => {
                                    setMoreOpen(!moreOpen);
                                }}>
                                    <MoreHorizIcon />
                                </button> */}
                                <div
                                    className="flex items-center rounded-lg bg-tertiary-blue text-primary-blue px-2 py-1 m-3 gap-x-1"
                                    onClick={() => {
                                        setMoreOpen(!moreOpen);
                                    }}
                                >
                                    <div className="text-center">
                                        <InfoIcon />
                                    </div>
                                    <div className="font-Inter text-sm">Expand Proof Checklist</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        value=""
                                        className="sr-only peer"
                                        checked={isCheckedOff}
                                        onChange={toggleIsCheckedOff}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-md font-small font-Inter text-gray-900 ">
                                        {isCheckedOff ? "Have Enough Proof" : "Need More Proof"}
                                    </span>
                                </label>
                                {
                                    moreOpen && (
                                        <OutsideClickHandler
                                            onOutsideClick={() => {
                                                setMoreOpen(false);
                                                saveCheckList();
                                            }}
                                        >
                                            <div className="absolute right-[0px] top-[40px] left-0 mt-[10px] z-10 border-2 border-secondary-gray w-[225px] rounded-lg bg-white">
                                                <div className="font-Inter font-bold text-black text-[13px] px-[15px] pt-[8px]">
                                                    You and/or your mentors can check off (or uncheck) below
                                                    to help you figure out if you have “Enough Proof” or “Need
                                                    More Proof”:
                                                </div>
                                                <ul className="font-Inter font-semibold text-[12px] px-[15px] py-[5px]">
                                                    {checkListLabels.map((label: string, index: number) => {
                                                        return (
                                                            <li
                                                                key={`checklist-${index}`}
                                                                className="py-[3px] cursor-pointer flex items-center"
                                                                onClick={() => {
                                                                    // setMoreOpen(false)
                                                                }}
                                                            >
                                                                <label className="relative flex items-baseline">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={`checklist-${index}`}
                                                                        name={`checklist-${index}`}
                                                                        checked={checkListValues[index]}
                                                                        className="w-3 h-3 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-blue"
                                                                        onChange={(e) =>
                                                                            handleCheckListChange(e, index)
                                                                        }
                                                                    />
                                                                    <span className="ml-3 -mt-[5px] text-[13px] font-medium font-Inter text-black w-[165px]">
                                                                        {label}
                                                                    </span>
                                                                </label>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </OutsideClickHandler>
                                    )
                                }
                            </div>
                        </div>
                        <div className="mt-[40px] rounded-xl bg-[#F7F7F9] lg:mx-[5%] xl:mx-[10%] 2xl:mx-[15%] px-[40px] py-[34px] flex flex-col justify-center font-Inter">
                            <h1 className="font-Inter font-bold text-xl">{moduleTitle}</h1>
                            <EditorView value={content} />
                            {
                                moduleItem?.module?.files != undefined &&
                                moduleItem?.module?.files?.length > 0 && (
                                    <div className="pt-[30px]">
                                        <label className="text-[14px] text-[#232325]">
                                            ATTACHMENTS
                                        </label>
                                        <div className="text-[#2E65F3] font-semibold text-[14px] py-[15px]">
                                            {
                                                moduleItem?.module.files.map(
                                                    (fileItem: any, index: number) => {
                                                        return (
                                                            <div
                                                                className="flex items-center"
                                                                key={`file_${index}`}
                                                            >
                                                                {/* <Image src={ico_document} alt={fileItem.name} /> */}
                                                                <IcoDocument alt={fileItem.name} />
                                                                <a
                                                                    href={fileItem.url}
                                                                    target="_blank"
                                                                    className="pl-[5px]"
                                                                >
                                                                    {fileItem.name}
                                                                </a>
                                                            </div>
                                                        );
                                                    }
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            }
                            <div className="border-b border-[#6F727A] py-[15px]"></div>
                            <h1 className="font-Inter font-bold text-xl sm:mt-[35px] mt-[10px]">
                                Mentor/Mentee Discussion
                            </h1>
                            <CommentList comments={comments} serverTime={serverTime} />
                            {/* {
                                comments != null &&
                                comments.length > 0 &&
                                comments.map((comment: Comment, index: number) => {
                                    return (
                                        <div key={`comment-${index}`}>
                                            <CommentItem comment={comment} serverTime={serverTime} />
                                        </div>
                                    );
                                })
                            } */}
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
                                    onClick={saveModuleComment}
                                >
                                    {isCreating ? <Spinner text="Posting..." /> : "Post"}
                                </button>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    );
};

export default Index;
