import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { User } from "next-auth";
import Image from "next/image";
import OutsideClickHandler from "react-outside-click-handler";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Venture } from "@/types/venture.type";
import Spinner from "@/components/Spinner";
import { formatDate } from "@/utils/utils";

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
  const [orgUserVentures, setOrgUserVentures] = useState<any[]>([]);
  const [filteredVentures, setFilteredVentures] = useState<Venture[]>([]);
  const [venturesAsMentee, setVenturesAsMentee] = useState<Venture[]>([]);
  const [venturesAsMentor, setVenturesAsMentor] = useState<Venture[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<number>(0);

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
      const { ventures, userVentures } = await response.json();
      setOrgUserVentures(userVentures);
      setOrgVentures(ventures);
      setFilteredVentures(ventures);
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Guest Venture Dashboard - Turtle Boat";
    getVentures();
  }, []);

  const handleVentureClicked = (ventureId: string) => {
    router.push(`/guest/myventures/${ventureId}`);
  };

  const handleFilterVentures = (value: string) => {
    const tempVentures = orgVentures;
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
  };

  return (
    <div>
      <div className="pt-[40px] pb-[32px]">
        <h1 className="font-Inter font-bold text-[36px] text-[#232325] mt-[100px]">
          My Ventures
        </h1>
      </div>
      {isLoading ? (
        <div className="grid place-items-center h-full">
          <Spinner text={"Loading ventures..."} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-[30px] gap-x-10 items-center">
            <div className="pb-[32px] w-full relative text-[#707279]">
              <input
                className="w-full border-2 border-secondary-gray bg-white h-10 px-5 pr-8 rounded-lg text-sm focus:outline-none"
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
                className="absolute right-[10px] top-[5px]"
                onClick={() => {
                  setFilterOpen(!filterOpen);
                }}
              >
                <FilterListIcon width={20} height={20} />
              </button>
              {filterOpen && (
                <OutsideClickHandler
                  onOutsideClick={() => setFilterOpen(false)}
                >
                  <div
                    className={`absolute right-0 z-0 top-10 mt-[10px] border-2 border-secondary-gray w-[200px] rounded-[8px] bg-white`}
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
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-y-[30px] gap-x-10">
            <div>
              <h2 className="truncate text-lg font-bold font-Inter py-4">
                My Ventures
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-[30px] gap-x-10 items-center">
                {venturesAsMentee.map((item: Venture, index: number) => {
                  const memberList = [item.mentee, ...item.mentors];
                  const groupLength = Math.min(2, memberList.length);
                  const limitedList = memberList.slice(0, groupLength);
                  return (
                    <div
                      className={`cursor-pointer`}
                      onClick={() => handleVentureClicked(item._id)}
                      key={`venture_link_${item._id}`}
                    >
                      <div
                        className="shadow-md h-[195px] font-Inter rounded-lg"
                        key={`venture_${index}`}
                      >
                        <div className="text-[20px] bg-[#F3F4F6] rounded-t-lg font-bold text-[#232325] px-[40px] py-[10px] ">
                          <a
                            className="block truncate"
                            href={`/dashboard/myventures/${item._id}`}
                          >
                            {item.isTeam
                              ? item.title + " - " + item.mentee.name
                              : item.title}
                          </a>
                          <p className="text-xs text-[#707279]">
                            {item.course.title}
                          </p>
                        </div>
                        <div className="text-[12px] pt-[10px] text-black px-[40px] py-[12px] ">
                          <div className="flex -space-x-3 items-center">
                            {limitedList.map((member: any) => {
                              return (
                                <img
                                  key={`member-${member._id}`}
                                  className="w-9 h-9 border-2 border-white rounded-full"
                                  src={member.image ?? "/user.png"}
                                  alt={member.name}
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
                          <p className="truncate text-[#707279] pt-1">
                            Last Updated {formatDate(item.updatedAt)}
                          </p>
                          <p className="truncate text-[#707279] pt-1">
                            Mentee:&nbsp;{item.mentee.name}
                          </p>
                          <p className="truncate text-[#707279] pt-1">
                            Mentors:&nbsp;
                            {item.mentors.map((mentor: any, index: number) => {
                              if (index < item.mentors.length - 1)
                                return `${mentor.name}, `;
                              else return mentor.name;
                            })}
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
                  const memberList = [item.mentee, ...item.mentors];
                  const groupLength = Math.min(2, memberList.length);
                  const limitedList = memberList.slice(0, groupLength);
                  return (
                    <div
                      className={`cursor-pointer`}
                      onClick={() => handleVentureClicked(item._id)}
                      key={`venture_link_${item._id}`}
                    >
                      <div
                        className="shadow-md h-[195px] font-Inter rounded-lg"
                        key={`venture_${index}`}
                      >
                        <div className="text-[20px] bg-[#F3F4F6] rounded-t-lg font-bold text-[#232325] px-[40px] py-[10px] ">
                          <a
                            className="block truncate"
                            href={`/dashboard/myventures/${item._id}`}
                          >
                            {item.isTeam
                              ? item.title + " - " + item.mentee.name
                              : item.title}
                          </a>
                          <p className="text-xs text-[#707279]">
                            {item.course.title}
                          </p>
                        </div>
                        <div className="text-[12px] pt-[10px] text-black px-[40px] py-[12px] ">
                          <div className="flex -space-x-3 items-center">
                            {limitedList.map((member: any) => {
                              return (
                                <img
                                  key={`member-${member._id}`}
                                  className="w-9 h-9 border-2 border-white rounded-full"
                                  src={member.image ?? "/user.png"}
                                  alt={member.name}
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
                          <p className="truncate text-[#707279] pt-1">
                            Last Updated {formatDate(item.updatedAt)}
                          </p>
                          <p className="truncate text-[#707279] pt-1">
                            Mentee:&nbsp;{item.mentee.name}
                          </p>
                          <p className="truncate text-[#707279] pt-1">
                            Mentors:&nbsp;
                            {item.mentors.map((mentor: any, index: number) => {
                              if (index < item.mentors.length - 1)
                                return `${mentor.name}, `;
                              else return mentor.name;
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {!isLoading && venturesAsMentor.length == 0 && <>No ventures</>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
