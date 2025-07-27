import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import { formatDate } from "@/utils/utils";

import Spinner from "@/components/Spinner";
import { User } from "@/types/user.type";

import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useFilters,
  useSortBy,
  usePagination,
} from "react-table";
import StatusItem from "@/components/StatusItem";
import UserAvatar1 from "@/components/UserAvatar1";

const MemberDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<User>();

  const handleBackClicked = () => {
    router.push(`/dashboard/admin/usermanage`);
  };

  const [ventures, setVentures] = useState<any[]>([]);

  const getVentures = async () => {
    setIsLoading(true);
    let ventureList: any[] = [];
    const response = await fetch(`/api/users/${id}`, {
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
      const { ventures, userVentures, userInfo } = await response.json();
      setUserInfo(userInfo);
      ventureList = ventures.map((venture: any, index: number) => {
        let role = "";
        userVentures.map((userVenture: any) => {
          if (userVenture.ventureId == venture._id) {
            role = userVenture.role;
          }
        });
        let ventureItem = {
          name: venture.title,
          role: role == "mentee" ? "Mentee" : "Mentor",
          course: venture.course.title,
          updatedAt: venture.updatedAt,
          createdAt: venture.createdAt,
          ventureId: venture._id,
        };

        return ventureItem;
      });
      setVentures(ventureList);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Members - Turtle Boat Admin";
    getVentures();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        isCenter: false,
      },
      {
        Header: "Role",
        accessor: "role",
        isCenter: false,
        disableSortBy: true,
      },
      {
        Header: "Course",
        accessor: "course",
        isCenter: false,
        disableSortBy: true,
      },
      {
        Header: "Last Updated",
        accessor: "updatedAt",
        isCenter: true,
        disableSortBy: true,
      },
      {
        Header: "Created On",
        accessor: "createdAt",
        isCenter: true,
        disableSortBy: true,
      },
    ],
    []
  );

  return (
    <>
      {isLoading ? (
        <div className="grid place-items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex flex-row w-full bg-white fixed items-center mt-[-40px] p-[20px] z-20">
            <a
              onClick={handleBackClicked}
              className="cursor-pointer flex items-center text-[20px] font-Inter font-bold lg:flex"
            >
              <span className="flex">
                <KeyboardBackspaceIcon />
              </span>
              <h1 className="ml-[15px]">Members</h1>
            </a>
          </div>
          {userInfo != null && (
            <div className="mt-[40px] py-[34px] flex flex-col justify-center font-Inter">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-0">
                <div className="flex justify-center px-8 py-4 lg:border-r-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-2">
                    <div className="flex justify-center">
                      <UserAvatar1 
                        user={userInfo}
                        size={100}
                        classes="rounded-full cursor-pointer justify-center"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h1 className="justify-center text-[25px] font-Inter font-bold text-center lg:text-left">
                        {userInfo.isNewUser
                          ? userInfo.name
                          : userInfo?.basicProfile?.firstName +
                            " " +
                            userInfo?.basicProfile?.lastName}
                      </h1>
                      <div className="justify-center font-Inter">
                        {userInfo.email}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center px-8 py-4">
                  <div className="flex lg:justify-start justify-center py-2">
                    Admin:&nbsp;
                    <span>{`${userInfo.role == "admin" ? `Yes` : `No`}`}</span>
                  </div>
                  <div className="flex flex-row items-center justify-center lg:justify-start gap-x-3 py-2">
                    <span>Profile Status </span>{" "}
                    <StatusItem
                      active={!userInfo.isNewUser}
                      label={`${
                        !userInfo.isNewUser ? `Completed` : `Incompleted`
                      }  `}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-[40px] font-Inter">
            <div className="flex text-[30px] font-Inter font-bold items-center">
              <TipsAndUpdatesOutlinedIcon />
              <h1 className="ml-[15px]">Ventures</h1>
            </div>
          </div>
          <div className="mt-[40px]">
            <UserVentureTable columns={columns} data={ventures} />
          </div>
        </>
      )}
    </>
  );
};

const UserVentureTable = ({
  columns,
  data,
}: {
  columns: any[];
  data: any[];
}) => {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    state,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const router = useRouter();

  const handleRowClick = (rowData: any) => {
    // router.push(`/dashboard/ventures/${rowData.original.ventureId}`);
  };

  // Render the UI for your table
  return (
    <>
      {headerGroups.map((headerGroup: any) =>
        headerGroup.headers.map((column: any) =>
          column.Filter ? (
            <div key={"filter-" + column.id}>{column.render("Filter")}</div>
          ) : null
        )
      )}
      <div className="mt-2 flex flex-col">
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table
                {...getTableProps()}
                className="min-w-full divide-y divide-gray-200"
              >
                <thead className="bg-gray-50">
                  {headerGroups.map((headerGroup: any, index: number) => (
                    <tr
                      key={"headerGroup" + index}
                      {...headerGroup.getHeaderGroupProps()}
                    >
                      {headerGroup.headers.map((column: any) => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        <th
                          key={column.id}
                          data-key={column.id}
                          scope="col"
                          className={`group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          <div
                            className={`${
                              column.isCenter ? `block text-center` : `flex`
                            } items-center justify-between min-h-[20px]`}
                          >
                            {column.render("Header")}
                            <span>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <ArrowDropUpIcon sx={{ fontSize: "20px" }} />
                                ) : (
                                  <ArrowDropDownIcon
                                    sx={{ fontSize: "20px" }}
                                  />
                                )
                              ) : (
                                ""
                              )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="bg-white divide-y divide-gray-200 font-Inter"
                >
                  {rows.map((row: any, i: number) => {
                    // new
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        key={i}
                        className="hover:bg-gray-100"
                      >
                        {row.cells.map((cell: any, cellId: number) => {
                          return (
                            <td
                              key={i + "-" + cell.column.id}
                              {...cell.getCellProps()}
                              className={`px-6 py-4 whitespace-nowrap ${
                                cell.column.isCenter ? `text-center` : ``
                              }`}
                            >
                              {cell.column.id == "updatedAt" ||
                              cell.column.id == "createdAt" ? (
                                formatDate(cell.value)
                              ) : cell.column.id == "name" ? (
                                <a
                                  className="cursor-pointer"
                                  onClick={() => handleRowClick(row)}
                                >
                                  <TipsAndUpdatesOutlinedIcon />
                                  <span className="ml-[10px]">
                                    {cell.render("Cell")}
                                  </span>
                                </a>
                              ) : (
                                cell.render("Cell")
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberDetail;
