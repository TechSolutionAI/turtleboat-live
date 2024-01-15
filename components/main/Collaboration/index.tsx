import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import Spinner from "@/components/Spinner";
import Upload from "./Upload";
import CommentItem from "./CommentItem";
import TokenItem from "@/components/layouts/TokenItem";
import { Comment } from "@/types/module.type";
import { collaTablist } from "@/utils/constant";
const Editor = dynamic(() => import("./Editor"), { ssr: false });

const Index = () => {
  const { data: session } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  let collaborationId = localStorage.getItem("collaborationId");
  let ventureId = "";
  const { id, type } = router.query;
  if (typeof id === "string" && id !== "") {
    collaborationId = id.split("-")[0];
    ventureId = id.split("-")[1];
  }

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isCommentSaved, setIsCommentSaved] = useState(false);
  const [serverTime, setServerTime] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState<string>("");
  const [files, setFormFiles] = useState<FileList | null>(null);
  const [selectedTab, setSelectedTab] = useState(
    type != null ? parseInt(type.toString()) : 0
  );

  const getCollaboration = async () => {
    setIsLoading(true);
    let url = `/api/collaboration/${collaborationId}`;
    if (ventureId != undefined) {
      url = `/api/collaboration/${collaborationId}-${ventureId}`;
    }
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      setIsLoading(false);
      const { err } = await response.json();
      console.log(err);
    } else {
      const { collaboration, serverTime, ventureTitle } = await response.json();
      setServerTime(serverTime);
      setTitle(ventureTitle);
      if (collaboration.comments) {
        setAllComments(collaboration.comments);
        const filteredComments = collaboration.comments.filter(function (
          comment: Comment
        ) {
          return comment.type == selectedTab;
        });
        setComments(filteredComments);
      }
      setIsLoading(false);
    }
  };

  const addComment = (comment: Comment) => {
    setAllComments((prev) => [...prev, comment]);
    setComments((prev) => [...prev, comment]);
    setCommentContent("");
    setFormFiles(null);
    setIsCommentSaved(true);
  };

  const handleCancelClicked = () => {
    if (type != null || type != undefined) {
      router.push(`/dashboard/messages`);
    } else {
      router.push(`/dashboard/myventures/${ventureId}`);
    }
  };

  const saveComment = async () => {
    if (commentContent != "" || files != null) {
      const formData = new FormData();
      formData.append("content", commentContent);
      if (typeof collaborationId === "string" && collaborationId !== "") {
        formData.append("cid", collaborationId.toString());
      }
      if (typeof ventureId === "string" && ventureId !== "") {
        formData.append("vid", ventureId.toString());
      }
      if (typeof user._id === "string" && user._id !== "") {
        formData.append("uid", user._id.toString());
      }
      formData.append("type", selectedTab.toString());
      if (files != null) {
        for (let i = 0; i < files.length; i++) {
          formData.append(`file${i}`, files[i]);
        }
      }

      setIsCreating(true);
      const response = await fetch("/api/collaboration", {
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
        })
          .then(() => {
            setIsCreating(false);
          })
          .catch((err) => console.log(err));
      } else {
        const { result } = await response.json();
        setIsCreating(false);
        addComment(result);
      }
    } else {
    }
  };

  const handleClick = (index: number) => {
    setSelectedTab(index);
  };

  useEffect(() => {
    const filteredComments = allComments.filter(function (comment: Comment) {
      return comment.type == selectedTab;
    });
    setComments(filteredComments);
  }, [selectedTab]);

  useEffect(() => {
    document.title = "Collaboration - Turtle Boat";
    getCollaboration();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="grid place-items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex flex-row justify-between w-full bg-white items-center mt-[-40px] p-[20px] z-20">
            <a
              onClick={handleCancelClicked}
              className="cursor-pointer flex items-center text-[20px] font-Inter font-bold lg:flex"
            >
              <span className="flex">
                <KeyboardBackspaceIcon />
              </span>
              <h1 className="ml-[15px]">
                {type != null || type != undefined
                  ? "Back to Notification logs"
                  : `Back to ${title} Dashboard`}
              </h1>
            </a>
            <TokenItem />
          </div>
          <div className="flex justify-center">
            <ul className="flex text-gray-500">
              {collaTablist.map((item, index) => {
                return (
                  <li className="mr-2" key={`tab-${index}`}>
                    <a
                      href="#"
                      className={`inline-flex p-4 border-b-2 text-[16px] font-Inter font-semibold ${
                        selectedTab == index
                          ? "text-tertiary-red border-tertiary-red"
                          : "border-transparent hover:text-gray-600 hover:border-gray-300"
                      }`}
                      onClick={() => handleClick(index)}
                    >
                      <div className="flex items-center">
                        <span>{item}</span>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="mt-[40px] rounded-xl bg-[#F7F7F9] lg:mx-[5%] xl:mx-[10%] 2xl:mx-[15%] px-[40px] py-[34px] flex flex-col justify-center font-Inter">
            <h1 className="font-Inter font-bold text-xl">Team Collaboration</h1>
            {comments != null &&
              comments.length > 0 &&
              comments.map((comment: Comment, index: number) => {
                return (
                  <div key={`comment-${comment.type + "_" + index}`}>
                    <CommentItem comment={comment} serverTime={serverTime} />
                  </div>
                );
              })}
            <Upload setFormFiles={setFormFiles} isInit={isCommentSaved} />
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
          </div>
        </>
      )}
    </>
  );
};

export default Index;
