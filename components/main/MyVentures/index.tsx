import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { User } from "next-auth";
import Image from "next/image";
import OutsideClickHandler from "react-outside-click-handler";
import { Transition } from "@headlessui/react";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Venture } from "@/types/venture.type";
import Spinner from "@/components/Spinner";
import { formatDate } from "@/utils/utils";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Swal from "sweetalert2";
import UserAvatar from "@/components/UserAvatar";

const placeholders = [
  "Search by Venture",
  "Search by Mentee",
  "Search by Mentor",
  "Search by Course",
];

const Index = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as User;
  const [searchText, setSearchText] = useState<string>("");
  const [orgVentures, setOrgVentures] = useState<Venture[]>([]);
  const [orgTeamVentures, setOrgTeamVentures] = useState<Venture[]>([]);
  const [orgUserVentures, setOrgUserVentures] = useState<any[]>([]);
  const [filteredVentures, setFilteredVentures] = useState<Venture[]>([]);
  const [venturesAsMentee, setVenturesAsMentee] = useState<Venture[]>([]);
  const [venturesAsMentor, setVenturesAsMentor] = useState<Venture[]>([]);
  const [teamVentures, setTeamVentures] = useState<Venture[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isOpenInnovation, setIsOpenInnovation] = useState(false);
  const [searchType, setSearchType] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [introMsg, setIntroMsg] = useState<string>("");
  const [isEmptyText, setIsEmptyText] = useState(false);

  const getVentures = async () => {
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
      const { ventures, userVentures, teamVentureList } = await response.json();
      setOrgUserVentures(userVentures);
      setOrgVentures(ventures);
      setFilteredVentures(ventures);
      setOrgTeamVentures(teamVentureList);
      const asMenteeList = ventures.filter(
        (ventureItem: any) =>
          userVentures.find(
            (userVentureItem: any) =>
              userVentureItem.ventureId == ventureItem._id &&
              userVentureItem.role == "mentee"
          ) != undefined
      );
      const asMentorList = ventures.filter(
        (ventureItem: any) =>
          userVentures.find(
            (userVentureItem: any) =>
              userVentureItem.ventureId == ventureItem._id &&
              userVentureItem.role == "mentor"
          ) != undefined
      );
      setVenturesAsMentee(asMenteeList);
      setVenturesAsMentor(asMentorList);
      setTeamVentures(teamVentureList);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = "My Ventures - Turtle Boat";
    getVentures();
  }, []);

  const handleVentureClicked = (ventureId: string) => {
    router.push(`/dashboard/myventures/${ventureId}`);
  };

  const handleFilterVentures = (value: string) => {
    const tempVentures = orgVentures;
    const tempTeamVentures = orgTeamVentures;
    const tempUserVentures = orgUserVentures;
    let filteredUserVentures: any[] = [];
    const filteredList = tempVentures.filter((item, index) => {
      if (searchType == 0) {
        if (item.title.toLowerCase().includes(value.toLocaleLowerCase())) {
          const matchedUserVenture = tempUserVentures.find(
            (userVentureItem: any) => userVentureItem.ventureId == item._id
          );
          filteredUserVentures.push(matchedUserVenture);
          return item;
        }
      } else if (searchType == 1) {
        if (
          item.mentee.name
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          item.mentee.email
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
        ) {
          const matchedUserVenture = tempUserVentures.find(
            (userVentureItem: any) => userVentureItem.ventureId == item._id
          );
          filteredUserVentures.push(matchedUserVenture);
          return item;
        }
      } else if (searchType == 2) {
        let matchedCount = 0;
        item.mentors.map((mentor: any) => {
          if (
            mentor.name
              .toLocaleLowerCase()
              .includes(value.toLocaleLowerCase()) ||
            mentor.email.toLocaleLowerCase().includes(value.toLocaleLowerCase())
          ) {
            matchedCount++;
          }
        });
        if (matchedCount > 0) {
          const matchedUserVenture = tempUserVentures.find(
            (userVentureItem: any) => userVentureItem.ventureId == item._id
          );
          filteredUserVentures.push(matchedUserVenture);
          return item;
        }
      } else if (searchType == 3) {
        if (
          item.course.title
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
        ) {
          const matchedUserVenture = tempUserVentures.find(
            (userVentureItem: any) => userVentureItem.ventureId == item._id
          );
          filteredUserVentures.push(matchedUserVenture);
          return item;
        }
      }
    });

    const filteredTeamList = tempTeamVentures.filter((item, index) => {
      if (searchType == 0) {
        if (item.title.toLowerCase().includes(value.toLocaleLowerCase())) {
          return item;
        }
      } else if (searchType == 1) {
        if (
          item.mentee.name
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          item.mentee.email
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
        ) {
          return item;
        }
      } else if (searchType == 2) {
        let matchedCount = 0;
        item.mentors.map((mentor: any) => {
          if (
            mentor.name
              .toLocaleLowerCase()
              .includes(value.toLocaleLowerCase()) ||
            mentor.email.toLocaleLowerCase().includes(value.toLocaleLowerCase())
          ) {
            matchedCount++;
          }
        });
        if (matchedCount > 0) {
          return item;
        }
      } else if (searchType == 3) {
        if (
          item.course.title
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
        ) {
          return item;
        }
      }
    });
    setVenturesAsMentee(
      filteredList.filter(
        (ventureItem: any) =>
          filteredUserVentures.find(
            (userVentureItem: any) =>
              userVentureItem.ventureId == ventureItem._id &&
              userVentureItem.role == "mentee"
          ) != undefined
      )
    );
    setVenturesAsMentor(
      filteredList.filter(
        (ventureItem: any) =>
          filteredUserVentures.find(
            (userVentureItem: any) =>
              userVentureItem.ventureId == ventureItem._id &&
              userVentureItem.role == "mentor"
          ) != undefined
      )
    );
    setTeamVentures(filteredTeamList);
  };

  const onRequestInnovationSubmit = async () => {
    if (introMsg != "") {
      setIsSubmitting(true);
      const response = await fetch("/api/innovation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user._id,
          note: introMsg,
        }),
      });

      if (!response.ok) {
        setIsSubmitting(false);
        setIsOpenInnovation(false);
        const { err } = await response.json();
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err,
        });
      } else {
        setIsSubmitting(false);
        setIsOpenInnovation(false);
        const { success, err } = await response.json();
        if (success) {
          Swal.fire(
            "Thanks!",
            "Your request for New Innovation has been sent",
            "success"
          );
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err,
          });
        }
      }
    } else {
      setIsEmptyText(true);
    }
  };

  return (
    <div>
      <div className="pb-[32px]">
        <h1 className="font-Inter font-bold text-[24px] text-[#232325] mt-0">
          My Ventures
        </h1>
        <p className={"mt-5 font-Inter text-[14px]"}>
          As a CORE Member you have your own Personal Thinkspace to jot thoughts, track progress, and “be messy” as you figure out whether this is an idea you want to pursue. If you are part of a yCITIES or partner program, your multiple ventures will be kept separate below. Mentees will have a dedicated Thinkspace similar to your Personal Thinkspace, except the prompts behind the puzzle pieces are tailored to the specific programming.  Mentors will be able to have a view-and-comment-only access into the MENTEE Thinkspace.
        </p>
      </div>
      {isLoading ? (
        <div className="grid place-items-center h-full">
          <Spinner text={"Loading ventures..."} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-[30px] gap-x-10 items-center">
            <div className="pb-[32px] w-full relative items-center justify-between text-[#707279]">
              <input
                className="search-filter border-2 border-secondary-gray bg-white h-10 px-5 pr-8 rounded-lg text-sm focus:outline-none"
                type="search"
                name="search"
                value={searchText}
                placeholder={placeholders[searchType]}
                onChange={(e) => {
                  handleFilterVentures(e.target.value);
                  setSearchText(e.target.value);
                }}
              />
              <button
                type="submit"
                className="absolute right-[45px] top-[5px]"
                onClick={() => {
                  setFilterOpen(!filterOpen);
                }}
              >
                <FilterListIcon width={20} height={20} />
              </button>
              {filterOpen && (
                <div className="absolute right-10 z-0 top-10 ">
                  <OutsideClickHandler
                    onOutsideClick={() => setFilterOpen(false)}
                  >
                    <div
                      className={`mt-[10px] border-2 border-secondary-gray w-[200px] rounded-[8px] bg-white`}
                    >
                      <ul className="font-Inter font-semibold text-sm px-0">
                        <li
                          className="flex items-center justify-between px-[20px] py-[10px] cursor-default border-b-2 border-secondary-gray"
                          onClick={() => {
                            setSearchType(0);
                            setFilterOpen(!filterOpen);
                            setSearchText("");
                          }}
                        >
                          Search by Venture
                          {searchType == 0 && (
                            <CheckCircleIcon fontSize="small" />
                          )}
                        </li>
                        <li
                          className="flex items-center justify-between px-[20px] py-[10px] cursor-default border-b-2 border-secondary-gray"
                          onClick={() => {
                            setSearchType(1);
                            setFilterOpen(!filterOpen);
                            setSearchText("");
                          }}
                        >
                          Search by Mentee
                          {searchType == 1 && (
                            <CheckCircleIcon fontSize="small" />
                          )}
                        </li>
                        <li
                          className="flex items-center justify-between px-[20px] py-[10px] cursor-default border-b-2 border-secondary-gray"
                          onClick={() => {
                            setSearchType(2);
                            setFilterOpen(!filterOpen);
                            setSearchText("");
                          }}
                        >
                          Search by Mentor
                          {searchType == 2 && (
                            <CheckCircleIcon fontSize="small" />
                          )}
                        </li>
                        <li
                          className="flex items-center justify-between px-[20px] py-[10px] cursor-default"
                          onClick={() => {
                            setSearchType(3);
                            setFilterOpen(!filterOpen);
                            setSearchText("");
                          }}
                        >
                          Search by Course
                          {searchType == 3 && (
                            <CheckCircleIcon fontSize="small" />
                          )}
                        </li>
                      </ul>
                    </div>
                  </OutsideClickHandler>
                </div>
              )}
              <button
                className={`rounded-[50px] my-[7px] text-secondary-gray-4 float-right bg-[#F3F4F6]`}
                onClick={() => {
                  setMoreOpen(!moreOpen);
                  setIntroMsg("");
                }}
              >
                <MoreHorizIcon />
              </button>
              {moreOpen && (
                <OutsideClickHandler onOutsideClick={() => setMoreOpen(false)}>
                  <div className="absolute right-[0px] z-0 top-5 mt-[10px] z-10 border-2 border-secondary-gray w-[200px] rounded-lg bg-white">
                    <ul className="font-Inter font-semibold text-[12px] px-[15px]">
                      <li
                        className="py-[10px] cursor-pointer"
                        onClick={() => {
                          setMoreOpen(false);
                          setIsOpenInnovation(true);
                        }}
                      >
                        New Innovation Journal
                      </li>
                    </ul>
                  </div>
                </OutsideClickHandler>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-y-[30px] gap-x-10">
            <div>
              <h2 className="truncate text-lg font-bold font-Inter py-4">
                Ventures as Mentee
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-[30px] gap-x-10 items-center">
                {venturesAsMentee.map((item, index) => {
                  // const memberList = [item.mentee, ...item.mentors];
                  const memberList = [item.mentee];
                  const groupLength = Math.min(2, memberList.length);
                  const limitedList = memberList.slice(0, groupLength);
                  return (
                    <div
                      className={`cursor-pointer`}
                      onClick={() => handleVentureClicked(item._id)}
                      key={`myventure_link_${item._id}`}
                    >
                      <div
                        className="shadow-md h-[220px] font-Inter rounded-lg"
                        key={`venture_${index}`}
                      >
                        <div className="text-[16px] bg-[#F3F4F6] rounded-t-lg font-bold text-[#232325] px-[15px] py-[10px] ">
                          <a
                            className="block min-h-[48px] flex items-center"
                            href={`/dashboard/myventures/${item._id}`}
                          >
                            {item.isTeam
                              ? item.title + " - " + item.mentee.name
                              : item.title}
                          </a>
                          {/* <p className="text-xs text-[#707279]">{item.course.title}</p> */}
                        </div>
                        <div className="text-[12px] pt-[10px] text-black px-[15px] py-[12px] ">
                          <div className="flex -space-x-3 items-center">
                            {limitedList.map((member: any) => {
                              return (
                                // <img key={`member-${member._id}`} className="w-9 h-9 border-2 border-white rounded-full" src={member.image ?? "/user.png"} alt={member.name} />
                                // <Image width={40} height={40} key={`member-${member._id}`} className="w-9 h-9 border-2 border-white rounded-full" src={member.image ?? "/user.png"} alt={member.name} />
                                <UserAvatar
                                  key={`member-${member._id}`}
                                  user={member}
                                  size={40}
                                  classes={
                                    "w-9 h-9 border-2 border-white rounded-full"
                                  }
                                />
                              );
                            })}
                            {memberList.length > 2 && (
                              <a
                                className="flex items-center justify-center w-9 h-9 text-full font-medium text-white bg-gradient-to-r from-[#B32F1A] to-[#DF897C] border-2 border-white rounded-full"
                                href="#"
                              >
                                +{memberList.length - 2}
                              </a>
                            )}
                            <p className="text-[14px] truncate pl-6">
                              {memberList.map((member: any, index: number) => {
                                if (index < memberList.length - 1)
                                  return `${member.name}, `;
                                else return member.name;
                              })}
                            </p>
                          </div>
                          <p className="text-[#232325] pt-1 min-h-[40px]">
                            <strong>Mentors:</strong>&nbsp;
                            {item.mentors.map((mentor: any, index: number) => {
                              if (index < item.mentors.length - 1)
                                return `${mentor.name}, `;
                              else return mentor.name;
                            })}
                          </p>
                          <p className="truncate text-[#707279] pt-1 mt-3">
                            {item.course.title}
                          </p>
                          <p className="truncate text-[#707279] pt-1">
                            Last Updated {formatDate(item.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {!isLoading && venturesAsMentee.length == 0 && <>No ventures</>}
              </div>
            </div>
            <div>
              <h2 className="truncate text-lg font-bold font-Inter py-4">
                Ventures as Mentor
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-[30px] gap-x-10 items-center">
                {venturesAsMentor.map((item: Venture, index: number) => {
                  // const memberList = [item.mentee, ...item.mentors];
                  const memberList = [item.mentee];
                  const groupLength = Math.min(2, memberList.length);
                  const limitedList = memberList.slice(0, groupLength);
                  return (
                    <div
                      className={`cursor-pointer`}
                      onClick={() => handleVentureClicked(item._id)}
                      key={`mentorventure_link_${item._id}`}
                    >
                      <div
                        className="shadow-md h-[220px] font-Inter rounded-lg"
                        key={`venture_${index}`}
                      >
                        <div className="text-[16px] bg-[#F3F4F6] rounded-t-lg font-bold text-[#232325] px-[15px] py-[10px] ">
                          <a
                            className="block min-h-[48px] flex items-center"
                            href={`/dashboard/myventures/${item._id}`}
                          >
                            {item.isTeam
                              ? item.title + " - " + item.mentee.name
                              : item.title}
                          </a>
                          {/* <p className="text-xs text-[#707279]">{item.course.title}</p> */}
                        </div>
                        <div className="text-[12px] pt-[10px] text-black px-[15px] py-[12px] ">
                          <div className="flex -space-x-3 items-center">
                            {limitedList.map((member: any) => {
                              return (
                                // <img key={`member-${member._id}`} className="w-9 h-9 border-2 border-white rounded-full" src={member.image ?? "/user.png"} alt={member.name} />
                                // <Image width={40} height={40} key={`member-${member._id}`} className="w-9 h-9 border-2 border-white rounded-full" src={member.image ?? "/user.png"} alt={member.name} />
                                <UserAvatar
                                  key={`member-${member._id}`}
                                  user={member}
                                  size={40}
                                  classes={
                                    "w-9 h-9 border-2 border-white rounded-full"
                                  }
                                />
                              );
                            })}
                            {memberList.length > 2 && (
                              <a
                                className="flex items-center justify-center w-9 h-9 text-full font-medium text-white bg-gradient-to-r from-[#B32F1A] to-[#DF897C] border-2 border-white rounded-full"
                                href="#"
                              >
                                +{memberList.length - 2}
                              </a>
                            )}
                            <p className="text-[14px] truncate pl-6">
                              {memberList.map((member: any, index: number) => {
                                if (index < memberList.length - 1)
                                  return `${member.name}, `;
                                else return member.name;
                              })}
                            </p>
                          </div>
                          <p className="text-[#232325] pt-1 min-h-[40px]">
                            <strong>Mentors:</strong>&nbsp;
                            {item.mentors.map((mentor: any, index: number) => {
                              if (index < item.mentors.length - 1)
                                return `${mentor.name}, `;
                              else return mentor.name;
                            })}
                          </p>
                          <p className="truncate text-[#707279] pt-1 mt-3">
                            {item.course.title}
                          </p>
                          <p className="truncate text-[#707279] pt-1">
                            Last Updated {formatDate(item.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {!isLoading && venturesAsMentor.length == 0 && <>No ventures</>}
              </div>
            </div>
            <div>
              <h2 className="truncate text-lg font-bold font-Inter py-4">
                Team Ventures
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-[30px] gap-x-10 items-center">
                {teamVentures.map((item: Venture, index: number) => {
                  // const memberList = [item.mentee, ...item.mentors];
                  const memberList = [item.mentee];
                  const groupLength = Math.min(2, memberList.length);
                  const limitedList = memberList.slice(0, groupLength);
                  return (
                    <div
                      className={`cursor-pointer`}
                      onClick={() => handleVentureClicked(item._id)}
                      key={`teamventure_link_${item._id}_${index}`}
                    >
                      <div
                        className="shadow-md h-[220px] font-Inter rounded-lg"
                        key={`venture_${index}`}
                      >
                        <div className="text-[16px] bg-[#F3F4F6] rounded-t-lg font-bold text-[#232325] px-[15px] py-[10px] ">
                          <a
                            className="block min-h-[48px] flex items-center"
                            href={`/dashboard/myventures/${item._id}`}
                          >
                            {item.isTeam
                              ? item.title + " - " + item.mentee.name
                              : item.title}
                          </a>
                          {/* <p className="text-xs text-[#707279]">{item.course.title}</p> */}
                        </div>
                        <div className="text-[12px] pt-[10px] text-black px-[15px] py-[12px] ">
                          <div className="flex -space-x-3 items-center">
                            {limitedList.map((member: any) => {
                              return (
                                // <img key={`member-${member._id}`} className="w-9 h-9 border-2 border-white rounded-full" src={member.image ?? "/user.png"} alt={member.name} />
                                // <Image width={40} height={40} key={`member-${member._id}`} className="w-9 h-9 border-2 border-white rounded-full" src={member.image ?? "/user.png"} alt={member.name} />
                                <UserAvatar
                                  key={`member-${member._id}`}
                                  user={member}
                                  size={40}
                                  classes={
                                    "w-9 h-9 border-2 border-white rounded-full"
                                  }
                                />
                              );
                            })}
                            {memberList.length > 2 && (
                              <a
                                className="flex items-center justify-center w-9 h-9 text-full font-medium text-white bg-gradient-to-r from-[#B32F1A] to-[#DF897C] border-2 border-white rounded-full"
                                href="#"
                              >
                                +{memberList.length - 2}
                              </a>
                            )}
                            <p className="text-[14px] truncate pl-6">
                              {memberList.map((member: any, index: number) => {
                                if (index < memberList.length - 1)
                                  return `${member.name}, `;
                                else return member.name;
                              })}
                            </p>
                          </div>
                          <p className="text-[#232325] pt-1 min-h-[40px]">
                            <strong>Mentors:</strong>&nbsp;
                            {item.mentors.map((mentor: any, index: number) => {
                              if (index < item.mentors.length - 1)
                                return `${mentor.name}, `;
                              else return mentor.name;
                            })}
                          </p>
                          <p className="truncate text-[#707279] pt-1 mt-3">
                            {item.course.title}
                          </p>
                          <p className="truncate text-[#707279] pt-1">
                            Last Updated {formatDate(item.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {!isLoading && teamVentures.length == 0 && <>No ventures</>}
              </div>
            </div>
          </div>
        </>
      )}
      <>
        <Transition
          show={isOpenInnovation}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={`fixed top-0 left-0 right-0 w-full flex 
                            justify-center items-center p-4 
                            overflow-x-hidden overflow-y-auto 
                            md:inset-0 h-[calc(100%-1rem)] max-h-full z-[41]`}
          >
            <div className="relative w-full max-w-3xl max-h-full">
              <div className="relative bg-white rounded-lg shadow">
                <button
                  type="button"
                  className={`absolute top-3 right-2.5 
                                        text-gray-400 bg-transparent 
                                        hover:bg-gray-200 hover:text-gray-900 
                                        rounded-lg text-sm p-1.5 ml-auto inline-flex items-center`}
                  onClick={() => {
                    setIsOpenInnovation(false);
                  }}
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
                <div className="px-6 py-4 border-b rounded-t ">
                  <h3 className="text-base font-semibold text-gray-900 lg:text-xl">
                    Request another Personal Innovation Journal & ThinkSpace
                  </h3>
                </div>
                <div className="p-6">
                  <div>
                    <label
                      htmlFor="introMsg"
                      className={`block font-semibold text-black mt-0`}
                    >
                      Note <span className="text-secondary-red">*</span>
                    </label>
                    <textarea
                      rows={4}
                      className="block p-3 mt-[15px] w-full text-[16px] text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-primary-blue focus:ring-primary-blue placeholder:text-[16px]"
                      placeholder="Write your text here..."
                      id="introMsg"
                      onChange={(e) => {
                        setIntroMsg(e.target.value);
                        if (e.target.value != "") {
                          setIsEmptyText(false);
                        }
                      }}
                      value={introMsg}
                    ></textarea>
                    {isEmptyText && (
                      <p className="mt-2 text-sm text-red-600">
                        Enter your text
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                  <button
                    type="button"
                    className={`text-gray-500 bg-white hover:bg-gray-100 
                                            focus:ring-4 focus:outline-none focus:ring-gray-200 
                                            rounded-lg border border-gray-200 text-sm font-medium 
                                            px-5 py-2.5 hover:text-gray-900 focus:z-10`}
                    onClick={() => {
                      setIsOpenInnovation(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`text-white bg-primary-blue hover:bg-primary-blue 
                                            focus:ring-4 focus:outline-none focus:ring-primary-blue 
                                            font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                                            `}
                    onClick={onRequestInnovationSubmit}
                  >
                    {isSubmitting ? <Spinner text="Submitting..." /> : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
        <div
          className={`bg-gray-900 bg-opacity-50 fixed inset-0 z-40 ${!isOpenInnovation ? "hidden" : ""
            }`}
        ></div>
      </>
    </div>
  );
};

export default Index;
