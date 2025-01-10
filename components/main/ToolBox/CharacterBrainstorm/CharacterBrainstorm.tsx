import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useRouter } from "next/router";
import Image from "next/image";
import Select from "react-select";
import Swal from "sweetalert2";
import OutsideClickHandler from "react-outside-click-handler";

import { Venture } from "@/types/venture.type";
import { Comment } from "@/types/module.type";
import Spinner from "@/components/Spinner";
import TokenItem from "@/components/layouts/TokenItem";
import Pillar from "@/components/main/MyVentures/GameBoard/Pillar";
import CommentItem from "@/components/main/Module/CommentItem";
import Upload from "@/components/main/Module/Upload";
// import Editor from "@/components/main/Module/Editor";
const Editor = dynamic(() => import("@/components/main/Module/Editor"), { ssr: false });
import dynamic from "next/dynamic";
import CharacterItem from "./CharacterItem";
import HelpIcon from "@mui/icons-material/Help";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Cart from "/public/static/images/cart.svg";
import Payer from "/public/static/images/payer.svg";
import UserCard from "/public/static/images/user_card.svg";

import NoHurtImg from "/public/static/images/toolbox/hurt0.png";
import BitHurtImg from "/public/static/images/toolbox/hurt1.png";
import MoreHurtImg from "/public/static/images/toolbox/hurt2.png";
import EvenMoreHurtImg from "/public/static/images/toolbox/hurt3.png";
import LotHurtImg from "/public/static/images/toolbox/hurt4.png";
import WorstHurtImg from "/public/static/images/toolbox/hurt5.png";

import { Character } from "@/types/character.type";

const powerOptions = [
  {
    value: 0,
    label: "No power to solve",
  },
  {
    value: 1,
    label: "A little power to solve",
  },
  {
    value: 2,
    label: "Some power to solve",
  },
  {
    value: 3,
    label: "A lot of power to solve",
  },
];

const feelingList = [
  {
    text: "No Hurt",
    img: NoHurtImg,
    value: 0,
  },
  {
    text: "Hurts Little Bit",
    img: MoreHurtImg,
    value: 2,
  },
  {
    text: "Hurts Bit More",
    img: BitHurtImg,
    value: 4,
  },
  {
    text: "Hurts Even More",
    img: EvenMoreHurtImg,
    value: 6,
  },
  {
    text: "Hurts Whole Lot",
    img: LotHurtImg,
    value: 8,
  },
  {
    text: "Hurts Worst",
    img: WorstHurtImg,
    value: 10,
  },
];

const initialCharacters: Character[] = [
  {
    name: "Character 1",
    isUser: false,
    isBuyer: false,
    isPayer: false,
    feeling: -1,
    primaryMotivator: "",
    headacheProblem: "",
    headacheFrequency: "",
    solvingPower: 0,
  },
  {
    name: "Character 2",
    isUser: false,
    isBuyer: false,
    isPayer: false,
    feeling: -1,
    primaryMotivator: "",
    headacheProblem: "",
    headacheFrequency: "",
    solvingPower: 0,
  },
  {
    name: "Character 3",
    isUser: false,
    isBuyer: false,
    isPayer: false,
    feeling: -1,
    primaryMotivator: "",
    headacheProblem: "",
    headacheFrequency: "",
    solvingPower: 0,
  },
  {
    name: "Character 4",
    isUser: false,
    isBuyer: false,
    isPayer: false,
    feeling: -1,
    primaryMotivator: "",
    headacheProblem: "",
    headacheFrequency: "",
    solvingPower: 0,
  },
];

const CHARACTER_STYLES = [
  { left: "0%", top: "22%", transform: "translateX(0%, -22%)" },
  { right: "0%", top: "22%", transform: "translateX(0%, -22%)" },
  { right: "0%", bottom: "22%", transform: "translateX(0%, -22%)" },
  { left: "0%", bottom: "22%", transform: "translateX(0%, -22%)" },
  { left: "50%", transform: "translateX(-50%)" },
  { bottom: "0%", left: "50%", transform: "translate(-50%, 0%)" },
  { top: "50%", left: "-1%", transform: "translateY(-50%)" },
  { top: "50%", right: "-1%", transform: "translateY(-50%)" },
  { right: "13%", bottom: "3%", transform: "translateX(-13%, -3%)" },
  { left: "13%", top: "3%", transform: "translateX(-13%, -3%)" },
  { left: "13%", bottom: "3%", transform: "translateX(-13%, -3%)" },
  { right: "13%", top: "3%", transform: "translateX(-13%, -3%)" },
];

const CHARACTER_ARROW_STYLES = [
  {
    top: "50%",
    background: "#4E6BD1",
    transform: "rotate(22deg)",
    transformOrigin: "100% 100%",
    zIndex: -1,
    width: "50%",
  },
  {
    top: "50%",
    background: "#4E6BD1",
    transform: "rotate(158deg)",
    transformOrigin: "100% 100%",
    zIndex: -1,
    width: "50%",
  },
  {
    top: "50%",
    background: "#4E6BD1",
    transform: "rotate(202deg)",
    transformOrigin: "100% 100%",
    zIndex: -1,
    width: "50%",
  },
  {
    top: "50%",
    background: "#4E6BD1",
    transform: "rotate(-22deg)",
    transformOrigin: "100% 100%",
    zIndex: -1,
    width: "50%",
  },
  {
    top: "70%",
    background: "#4E6BD1",
    transform: "rotate(90deg)",
    transformOrigin: "100% 100%",
    zIndex: -1,
    width: "50%",
  },
  {
    top: "30%",
    background: "#4E6BD1",
    transform: "rotate(270deg)",
    transformOrigin: "100% 100%",
    zIndex: -1,
    width: "50%",
  },
  {
    top: "50%",
    background: "#4E6BD1",
    transform: "rotate(0deg)",
    transformOrigin: "100% 100%",
    zIndex: -1,
    width: "50%",
  },
  {
    top: "50%",
    background: "#4E6BD1",
    transform: "rotate(180deg)",
    transformOrigin: "100% 100%",
    zIndex: -1,
    width: "50%",
  },
  {
    top: "50%",
    background: "#4E6BD1",
    transform: "rotate(222deg)",
    transformOrigin: "100% 100%",
    zIndex: -1,
    width: "50%",
  },
  {
    top: "50%",
    background: "#4E6BD1",
    transform: "rotate(44deg)",
    transformOrigin: "100% 100%",
    zIndex: -1,
    width: "50%",
  },
  {
    top: "50%",
    background: "#4E6BD1",
    transform: "rotate(-43deg)",
    transformOrigin: "100% 100%",
    zIndex: -1,
    width: "50%",
  },
  {
    top: "50%",
    background: "#4E6BD1",
    transform: "rotate(136deg)",
    transformOrigin: "100% 100%",
    zIndex: -1,
    width: "50%",
  },
];

const GROUP_STYLES = [
  { left: "13%", top: "7%" },
  { right: "25%", top: "7%" },
  { right: "32%", bottom: "38%" },
  { left: "20%", bottom: "38%" },
];

const CharacterBrainstorm = () => {
  const [redirect, setRedirect] = useState<string>("");
  const { data: session } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const { id } = router.query;
  let ventureId = "";
  if (typeof id === "string" && id !== "") {
    localStorage.setItem("selectedVentureId", id.toString());
    ventureId = id.toString();
  }
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [venture, setVenture] = useState<Venture>();

  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [selectedCharacter, setSelectedCharacter] = useState<Character>();
  const [isAddingCharacter, setIsAddingCharacter] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const [buyerDropdownOpen, setBuyerDropdownOpen] = useState<boolean>(false);
  const [payerDropdownOpen, setPayerDropdownOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<string>("Select");
  const [selectedBuyer, setSelectedBuyer] = useState<string>("Select");
  const [selectedPayer, setSelectedPayer] = useState<string>("Select");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [characterName, setCharacterName] = useState<string>("");
  const [problemContent, setProblemContent] = useState<string>("");
  const [primaryMotivator, setPrimaryMotivator] = useState<string>("");
  const [headacheProblem, setHeadacheProblem] = useState<string>("");
  const [headacheFrequency, setHeadacheFrequency] = useState<string>("");
  const [selectedCharacterId, setSelectedCharacterId] = useState<number>(-1);
  const [problemContentLength, setProblemContentLength] = useState<number>(0);
  const [selectedPower, setSelectedPower] = useState<any | null>();
  const [ventureList, setVentureList] = useState<any[]>([]);
  const [saveDropdownOpen, setSaveDropdownOpen] = useState<boolean>(false);
  const [selectedVentureIndex, setSelectedVentureIndex] = useState<number>(-1);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [serverTime, setServerTime] = useState<string>("");
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
        const { venture, serverTime } = await response.json();
        setServerTime(serverTime);
        if (venture.mentee != null && venture.mentee != undefined) {
          if (venture.mentee.email == user.email) {
            setIsEditable(true);
            setMemberType("mentee");
          } else {
            setMemberType("mentor");
          }
        }
        if (
          venture.stakeholderScenario != undefined &&
          venture.stakeholderScenario != null
        ) {
          setCharacters(venture.stakeholderScenario.characters);
          setProblemContent(venture.stakeholderScenario.problem);
          setComments(venture.stakeholderScenario.comments ?? []);
          venture.stakeholderScenario.characters.map(
            (character: Character, index: number) => {
              if (character.isUser && character?.name) {
                setSelectedUser(character.name);
              }
              if (character.isBuyer && character?.name) {
                setSelectedBuyer(character.name);
              }
              if (character.isPayer && character?.name) {
                setSelectedPayer(character.name);
              }
            }
          );
        }
        setVenture(venture);
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
    document.title = "ToolBox - Character Brainstorm - Turtle Boat";
    getVenture();
  }, []);

  const handleCharacterSelected = (index: number) => {
    setIsAddingCharacter(true);
    const temp = characters[index];
    if (temp !== undefined) {
      setSelectedCharacter(temp);
      setCharacterName(temp.name);
      setSelectedPower(powerOptions[temp.solvingPower]);
      setPrimaryMotivator(temp.primaryMotivator);
      setHeadacheProblem(temp.headacheProblem);
      setHeadacheFrequency(temp.headacheFrequency);
      setSelectedCharacterId(index);
    }
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
      const response = await fetch("/api/comments/characterbrainstorm", {
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
        // addComment(result);
      }
    }
  };

  const size = 71;

  const characterItems: any[] = [];
  const arrows: any[] = [];
  characters.forEach((item, index) => {
    characterItems.push(
      <CharacterItem
        style={{
          position: "absolute",
          ...CHARACTER_STYLES[index],
        }}
        key={`pilliars_${index}`}
        data={item}
        id={index}
        handleCharacterSelected={handleCharacterSelected}
        isSelected={index == selectedCharacterId}
      />
    );
    arrows.push(
      <div
        key={`arrow_${index}`}
        className="absolute h-[5px]"
        style={{
          ...CHARACTER_ARROW_STYLES[index],
        }}
      ></div>
    );
  });

  const handleTextChange = (value: string) => {
    setProblemContent(value);
    setProblemContentLength(value.length);
  };

  const handleSolvingPowerChange = (selected: any) => {
    if (selectedCharacter != undefined) {
      let tempCharacter = selectedCharacter;
      tempCharacter.solvingPower = selected.value;
      setSelectedCharacter(tempCharacter);

      let temp = [...characters];
      temp[selectedCharacterId] = tempCharacter;
      setCharacters(temp);
    }
    setSelectedPower(selected);
  };

  const handleNameChange = (value: string) => {
    if (selectedCharacter != undefined) {
      let tempCharacter = selectedCharacter;
      tempCharacter.name = value;
      setCharacterName(value);
      setSelectedCharacter(tempCharacter);

      let temp = [...characters];
      temp[selectedCharacterId] = tempCharacter;
      setCharacters(temp);
    }
  };

  const handlePrimaryMotivatorChange = (value: string) => {
    if (selectedCharacter != undefined) {
      let tempCharacter = selectedCharacter;
      tempCharacter.primaryMotivator = value;
      setPrimaryMotivator(value);
      setSelectedCharacter(tempCharacter);

      let temp = [...characters];
      temp[selectedCharacterId] = tempCharacter;
      setCharacters(temp);
    }
  };

  const handleFeelingSelected = (value: number) => {
    if (selectedCharacter != undefined && isEditable) {
      let tempCharacter = selectedCharacter;
      tempCharacter.feeling = value;
      setSelectedCharacter(tempCharacter);

      let temp = [...characters];
      temp[selectedCharacterId] = tempCharacter;
      setCharacters(temp);
    }
  };

  const handleHeadacheProblemChange = (value: string) => {
    if (selectedCharacter != undefined) {
      let tempCharacter = selectedCharacter;
      tempCharacter.headacheProblem = value;
      setHeadacheProblem(value);
      setSelectedCharacter(tempCharacter);

      let temp = [...characters];
      temp[selectedCharacterId] = tempCharacter;
      setCharacters(temp);
    }
  };

  const handleHeadacheFrequencyChange = (value: string) => {
    if (selectedCharacter != undefined) {
      let tempCharacter = selectedCharacter;
      tempCharacter.headacheFrequency = value;
      setHeadacheFrequency(value);
      setSelectedCharacter(tempCharacter);

      let temp = [...characters];
      temp[selectedCharacterId] = tempCharacter;
      setCharacters(temp);
    }
  };

  const handleAddClick = () => {
    setIsAddingCharacter(true);
    if (characters.length < 12) {
      const characterLength = characters.length;
      const newCharacter = {
        name: `Character ${characterLength + 1}`,
        isUser: false,
        isBuyer: false,
        isPayer: false,
        feeling: -1,
        primaryMotivator: "",
        headacheProblem: "",
        headacheFrequency: "",
        solvingPower: 0,
      };
      setSelectedCharacter(newCharacter);
      setCharacterName(newCharacter.name);
      setPrimaryMotivator("");
      setHeadacheProblem("");
      setHeadacheFrequency("");
      setCharacters((prevCharacters) => [...prevCharacters, newCharacter]);
      setSelectedCharacterId(characterLength);
    }
  };

  const handleUserSelected = (id: number) => {
    let temp = characters.map((character: Character, index: number) => {
      let tempCharacter = character;
      tempCharacter.isUser = id == index;
      if (id == index && character?.name) {
        setSelectedUser(character.name);
      }
      return tempCharacter;
    });
    setCharacters(temp);
  };

  const handleBuyerSelected = (id: number) => {
    let temp = characters.map((character: Character, index: number) => {
      let tempCharacter = character;
      tempCharacter.isBuyer = id == index;
      if (id == index && character?.name) {
        setSelectedBuyer(character.name);
      }
      return tempCharacter;
    });
    setCharacters(temp);
  };

  const handlePayerSelected = (id: number) => {
    let temp = characters.map((character: Character, index: number) => {
      let tempCharacter = character;
      tempCharacter.isPayer = id == index;
      if (id == index && character?.name) {
        setSelectedPayer(character.name);
      }
      return tempCharacter;
    });
    setCharacters(temp);
  };

  const handleDeleteCharacter = () => {
    let temp = [...characters];
    temp.splice(selectedCharacterId, 1);
    setCharacters(temp);
    setSelectedCharacterId(-1);
    setIsAddingCharacter(false);
  };

  const saveStakeholderScenario = async (index: number) => {
    if (problemContentLength == 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You cannot save if the Problem box is empty",
      })
        .then(() => {
          console.log("Saving failed");
        })
        .catch((err) => console.log(err));

      return;
    }
    if (session != undefined) {
      if (problemContent != "") {
        setIsSaving(true);
        var data = {
          characters: characters,
          problem: problemContent,
        };
        const response = await fetch("/api/stakeholderscenario", {
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
            text: `Stakeholder Scenario was save successfully!`,
          })
            .then(() => { })
            .catch((err) => console.log(err));
        }
      }
    } else {
      // Alert Part for Non-members
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <div
        className={`block sm:flex items-center font-Inter justify-between py-0 -mt-5`}
      >
        <div className="flex items-center">
          <button className="cursor-pointer" onClick={handleBack}>
            <KeyboardBackspaceIcon />
          </button>
          <h1 className="font-bold text-[20px] py-0 ml-3">
            Back to{" "}
            {router.pathname.includes("[id]")
              ? `${venture?.mentee.name}'s Dashboard`
              : "Toolbox"}
          </h1>
        </div>
        <TokenItem />
      </div>
      {isLoading ? (
        <div className="grid place-items-center h-screen">
          <Spinner text={"Loading Stakeholder ..."} />
        </div>
      ) : (
        <>
          <div className="z-10 md:flex justify-between sticky top-0 pb-4 pt-2 bg-white gap-y-4">
            <div className="flex items-center text-[20px] font-Inter lg:flex p-2">
              <h1 className="font-Inter font-bold mr-1">
                Who Should Care & Why? Brainstorm{" "}
                <button
                  data-modal-target="default-modal"
                  data-modal-toggle="default-modal"
                  onClick={() => {
                    setShowHelp(true);
                  }}
                >
                  <HelpIcon sx={{ color: "#9CA1AD" }} />
                </button>
              </h1>
              {showHelp && (
                <OutsideClickHandler
                  onOutsideClick={() => {
                    setShowHelp(false);
                  }}
                >
                  <div className="absolute z-50 mt-5 left-[30px] border-2 border-secondary-gray w-[350px] rounded-lg bg-white">
                    <div className="font-bold text-black text-[13px] px-[15px] pt-[15px]">
                      Who Can Support Me...Or Potentially Stop Me?
                    </div>
                    <div className="text-[14px] px-[15px] py-[15px]">
                      Most users don’t live in isolated silos….they
                      live/work/play and interact with other people. Whether
                      it’s monetary, societal, political, psychological, or
                      other reasons, there are other influencers that can stand
                      in the way of your success. Some may influence more than
                      others, but it’s important to understand how it links and
                      what could help or hinder your success. Use this tool to
                      play out different scenarios of Who Should Care & Why, and
                      how that can affect who buys and/or pays for the product
                      if the user has less ability to do so. And if a potential
                      Character can stop you from succeeding, what are things
                      they care about that can transform them into an ally
                      instead?
                    </div>
                  </div>
                </OutsideClickHandler>
              )}
            </div>
            <div className="md:flex grid grid-cols-1 lg:grid-cols-2 gap-y-2 relative">
              {isEditable && (
                <button
                  className="flex items-center justify-center lg:ml-[15px] ml-0 bg-secondary-gray-3 text-white active:bg-secondary-gray-3 px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 font-Inter truncate"
                  type="button"
                  onClick={handleAddClick}
                >
                  <span className="flex">
                    <AddCircleRoundedIcon />
                  </span>
                  <span className="ml-[10px]">Add Character</span>
                </button>
              )}
              {isEditable &&
                (ventureId != "" ? (
                  <button
                    className="flex items-center justify-center ml-[15px] bg-tertiary-red text-white active:bg-tertiary-red px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 font-Inter truncate"
                    type="button"
                    onClick={() => saveStakeholderScenario(-1)}
                  >
                    {isSaving ? <Spinner text="Saving" /> : "Save"}
                  </button>
                ) : (
                  <button
                    className="flex items-center justify-center bg-tertiary-red text-white active:bg-tertiary-red px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 font-Inter truncate"
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
                    className={`absolute right-0 top-10 mt-[10px] border-2 border-secondary-gray w-[200px] rounded-[8px] bg-white`}
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
                              saveStakeholderScenario(index);
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 my-[10px]">
            <div className="col-span-1 xl:col-span-3 ">
              <div className="w-fit md:w-full px-5 py-5 justify-center mt-5 overflow-x-auto">
                <div
                  id="CharacterBrainstorm"
                  className="relative w-[950px] h-[700px] m-auto"
                >
                  <div
                    // onClick={handleModuleClicked}
                    className="cursor-pointer center-circle absolute py-2 px-4 flex-col top-[50%] left-[50%] w-[416px] h-[300px] bg-white border-4 border-[#ffffff] box-border rounded-[40px] -translate-x-1/2 -translate-y-1/2 flex"
                    style={{
                      boxShadow:
                        "0px 4px 4px rgba(0, 0, 0, 0.25), inset 0px 4px 10px rgba(0, 0, 0, 0.35)",
                    }}
                  >
                    <Pillar
                      text={"risk_meter"}
                      size={142}
                      color={`#4169e1`}
                      style={{
                        position: "absolute",
                        top: "-80px",
                        transform: "translateX(-50%)",
                        left: "50%",
                      }}
                    />
                    <h1 className="w-full mt-[5px] text-[24px] font-bold text-[#000000]">
                      Problem I am solving
                    </h1>
                    {isEditable ? (
                      <>
                        <textarea
                          maxLength={450}
                          className="h-[220px] focus:outline-0"
                          placeholder="Describe the problem you are trying to solve..."
                          value={problemContent}
                          onChange={(e) => handleTextChange(e.target.value)}
                        ></textarea>
                        <span className="text-right px-2">
                          {problemContentLength} / 450
                        </span>
                      </>
                    ) : (
                      <p className="h-[220px]">{problemContent}</p>
                    )}
                  </div>
                  {characterItems}
                  {arrows}
                </div>
              </div>
              <div className="grid grid-cols-3 shadow-md rounded-lg py-2 px-4 mt-10">
                <div className="relative">
                  <div className="flex font-Inter font-bold gap-x-2">
                    {/* <Image
                      src={UserCard}
                      alt=""
                      width={25}
                      className="cursor-pointer"
                    /> */}
                    <UserCard
                      alt=""
                      width={25}
                      className="cursor-pointer"
                    />
                    <span>User</span>
                  </div>
                  <div
                    className="flex font-Inter italic mt-2 cursor-pointer"
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                    }}
                  >
                    <span>{selectedUser}</span>
                    <span className="flex">
                      <KeyboardArrowDownRoundedIcon />
                    </span>
                  </div>
                  {isEditable && userDropdownOpen && (
                    <OutsideClickHandler
                      onOutsideClick={() => setUserDropdownOpen(false)}
                    >
                      <div
                        className={`absolute bottom-[80px] mt-[10px] shadow-md w-[300px] rounded-lg bg-white`}
                      >
                        <ul className="font-Inter text-[16px] rounded-lg">
                          {characters.map(
                            (character: Character, index: number) => {
                              return (
                                <li
                                  key={`user_${index}`}
                                  className="py-[18px] px-[20px] rounded-lg cursor-default hover:bg-secondary-gray-1"
                                  onClick={() => {
                                    handleUserSelected(index);
                                    setUserDropdownOpen(false);
                                  }}
                                >
                                  {character.name}
                                </li>
                              );
                            }
                          )}
                        </ul>
                      </div>
                    </OutsideClickHandler>
                  )}
                </div>
                <div className="relative">
                  <div className="flex font-Inter font-bold gap-x-2">
                    {/* <Image
                      src={Cart}
                      alt=""
                      width={25}
                      className="cursor-pointer"
                    /> */}
                    <Cart
                      alt=""
                      width={25}
                      className="cursor-pointer"
                    />
                    <span>Buyer</span>
                  </div>
                  <div
                    className="flex font-Inter italic mt-2 cursor-pointer"
                    onClick={() => {
                      setBuyerDropdownOpen(!buyerDropdownOpen);
                    }}
                  >
                    <span>{selectedBuyer}</span>
                    <span className="flex">
                      <KeyboardArrowDownRoundedIcon />
                    </span>
                  </div>
                  {isEditable && buyerDropdownOpen && (
                    <OutsideClickHandler
                      onOutsideClick={() => setBuyerDropdownOpen(false)}
                    >
                      <div
                        className={`absolute bottom-[80px] mt-[10px] shadow-md w-[300px] rounded-lg bg-white`}
                      >
                        <ul className="font-Inter text-[16px] rounded-lg">
                          {characters.map(
                            (character: Character, index: number) => {
                              return (
                                <li
                                  key={`buyer_${index}`}
                                  className="py-[18px] px-[20px] rounded-lg cursor-default hover:bg-secondary-gray-1"
                                  onClick={() => {
                                    handleBuyerSelected(index);
                                    setBuyerDropdownOpen(false);
                                  }}
                                >
                                  {character.name}
                                </li>
                              );
                            }
                          )}
                        </ul>
                      </div>
                    </OutsideClickHandler>
                  )}
                </div>
                <div className="relative">
                  <div className="flex font-Inter font-bold gap-x-2">
                    {/* <Image
                      src={Payer}
                      alt=""
                      width={25}
                      className="cursor-pointer"
                    /> */}
                    <Payer
                      alt=""
                      width={25}
                      className="cursor-pointer"
                    />
                    <span>Payer</span>
                  </div>
                  <div
                    className="flex font-Inter italic mt-2 cursor-pointer"
                    onClick={() => {
                      setPayerDropdownOpen(!payerDropdownOpen);
                    }}
                  >
                    <span>{selectedPayer}</span>
                    <span className="flex">
                      <KeyboardArrowDownRoundedIcon />
                    </span>
                  </div>

                  {isEditable && payerDropdownOpen && (
                    <OutsideClickHandler
                      onOutsideClick={() => setPayerDropdownOpen(false)}
                    >
                      <div
                        className={`absolute bottom-[80px] mt-[10px] shadow-md w-[300px] rounded-lg bg-white`}
                      >
                        <ul className="font-Inter text-[16px] rounded-lg">
                          {characters.map(
                            (character: Character, index: number) => {
                              return (
                                <li
                                  key={`payer_${index}`}
                                  className="py-[18px] px-[20px] rounded-lg cursor-default hover:bg-secondary-gray-1"
                                  onClick={() => {
                                    handlePayerSelected(index);
                                    setPayerDropdownOpen(false);
                                  }}
                                >
                                  {character.name}
                                </li>
                              );
                            }
                          )}
                        </ul>
                      </div>
                    </OutsideClickHandler>
                  )}
                </div>
              </div>
            </div>
            <div className="shadow-md rounded-lg p-2">
              {!isAddingCharacter ? (
                <div className="rounded-lg bg-tertiary-blue text-primary-blue p-3 m-3">
                  <div className="text-center">
                    <InfoIcon />
                  </div>
                  <div className="font-Inter text-sm">
                    Select a character card from the brainstorm map to edit
                    their problem traits.
                  </div>
                </div>
              ) : (
                selectedCharacter != undefined && (
                  <div>
                    <div className="flex items-center rounded-lg bg-[#ECDBFF] p-3">
                      <div className="font-Inter text-sm w-[80%] truncate">
                        {isEditingName ? (
                          <input
                            className={`block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 
                                                focus:outline-none focus:border-primary-blue focus:ring-primary-blue `}
                            type="text"
                            value={characterName}
                            onChange={(e) => handleNameChange(e.target.value)}
                          />
                        ) : (
                          <>{characterName}</>
                        )}
                      </div>
                      {isEditable && (
                        <div className="text-center w-[20%]">
                          {!isEditingName ? (
                            <EditIcon
                              onClick={() => {
                                setIsEditingName(true);
                              }}
                            />
                          ) : (
                            <CloseIcon
                              onClick={() => {
                                setIsEditingName(false);
                              }}
                            />
                          )}
                          <DeleteIcon onClick={handleDeleteCharacter} />
                        </div>
                      )}
                    </div>
                    <div className="py-3 px-1">
                      <label className="font-Inter font-bold text-sm">
                        How do they feel in relation to the problem?
                      </label>
                      <div className="flex mt-5 justify-around">
                        {feelingList.map((item: any, index: number) => {
                          return (
                            <div
                              key={`feeling_${index}`}
                              className={`flex flex-col items-center cursor-pointer ${selectedCharacter.feeling == item.value
                                ? "bg-primary-blue text-white"
                                : ""
                                }`}
                              onClick={() => handleFeelingSelected(item.value)}
                            >
                              <Image
                                src={item.img}
                                alt={item.text}
                                width={40}
                                height={40}
                              />
                              <div>{item.value}</div>
                              {/* <div className='text-center'>{item.text}</div> */}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="py-3 px-1">
                      <label className="font-Inter font-bold text-sm">
                        What is their primary motivator?
                      </label>
                      {isEditable ? (
                        <textarea
                          rows={4}
                          value={primaryMotivator}
                          onChange={(e) =>
                            handlePrimaryMotivatorChange(e.target.value)
                          }
                          className={`block p-2.5 mt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 
                                            focus:outline-none focus:border-primary-blue focus:ring-primary-blue `}
                          placeholder="Motivators are usually around Money, Status, Time/efficiency, Well-being of someone/something they love, Quality."
                        ></textarea>
                      ) : (
                        <p>{primaryMotivator}</p>
                      )}
                    </div>
                    <div className="py-3 px-1">
                      <label className="font-Inter font-bold text-sm">
                        What part of the problem creates a headache for them?
                      </label>
                      {isEditable ? (
                        <textarea
                          rows={4}
                          value={headacheProblem}
                          onChange={(e) =>
                            handleHeadacheProblemChange(e.target.value)
                          }
                          className={`block p-2.5 mt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 
                                            focus:outline-none focus:border-primary-blue focus:ring-primary-blue `}
                          placeholder="Get specific about why this problem is a problem for them and why."
                        ></textarea>
                      ) : (
                        <p>{headacheProblem}</p>
                      )}
                    </div>
                    <div className="py-3 px-1">
                      <label className="font-Inter font-bold text-sm">
                        How severe or frequent is the headache?
                      </label>
                      {
                        isEditable ? (
                          <textarea
                            rows={4}
                            value={headacheFrequency}
                            onChange={(e) =>
                              handleHeadacheFrequencyChange(e.target.value)
                            }
                            className={`block p-2.5 mt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 
                                            focus:outline-none focus:border-primary-blue focus:ring-primary-blue `}
                            placeholder="This might require you to think more granularly about your Character, as something like Teenager will be too broad."
                          ></textarea>
                        ) : (
                          <p>{headacheFrequency}</p>
                        )
                      }
                    </div>
                    <div className="py-3 px-1">
                      <label className="font-Inter font-bold text-sm mb-5">
                        How much power do they have to solve the problem?
                      </label>
                      {isEditable ? (
                        <Select
                          options={powerOptions}
                          value={selectedPower}
                          onChange={handleSolvingPowerChange}
                          isSearchable={false}
                          styles={{
                            control: (provided: any, state: any) => ({
                              ...provided,
                              borderRadius: "5px",
                              marginTop: "16px",
                              padding: "3px",
                              border: state.isFocused
                                ? "1px solid #2E65F3"
                                : "1px solid #2E65F3",
                            }),
                            option: (provided: any, state: any) => ({
                              ...provided,
                              backgroundColor: state.isSelected
                                ? "#2E65F3"
                                : "transparent",
                              color: state.isSelected ? "white" : "#4a5568",
                              ":hover": {
                                backgroundColor: state.isSelected
                                  ? "#2E65F3"
                                  : "#e2e8f0",
                                color: state.isSelected ? "white" : "#4a5568",
                              },
                            }),
                          }}
                        />
                      ) : (
                        <p>{selectedPower.label}</p>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="mt-[40px] rounded-xl bg-[#F7F7F9] px-[40px] py-[34px] flex flex-col justify-center font-Inter mb-5">
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
              onChange={(data: string) => {
                setCommentContent(data);
              }}
            />
            <div className="flex items-center justify-end font-Inter font-bold pt-5">
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

export default CharacterBrainstorm;
