import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import shortid from "shortid";
import Swal from "sweetalert2";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import { formatDate } from "@/utils/utils";

import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useFilters,
  useSortBy,
  usePagination,
} from "react-table";

import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import Spinner from "@/components/Spinner";
import TokenItem from "@/components/layouts/TokenItem";

const Index = () => {
  const { data: session } = useSession();
  const user = session?.user as User;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [brainstorms, setBrainStorms] = useState<any[]>([]);
  const [invitedBrainstorms, setInvitedBrainStorms] = useState<any[]>([]);

  useEffect(() => {
    document.title = "ToolBox - Coffee Chat - Turtle Boat";
    getList();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        isCenter: false,
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
      {
        Header: "Status",
        accessor: "isCompleted",
        isCenter: true,
        disableSortBy: true,
      },
      {
        Header: "Actions",
        accessor: "action",
        isCenter: true,
        disableSortBy: true,
      },
    ],
    []
  );

  const addBrainstorm = () => {
    router.push(`/dashboard/toolbox/lemonade/add`);
  };
  const getList = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/lemonades`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      setIsLoading(false);
      const { err } = await response.json();
      console.log(err);
    } else {
      const { myLemonades, invitedLemonades } = await response.json();
      setBrainStorms(myLemonades);
      setInvitedBrainStorms(invitedLemonades);
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push(`/dashboard/toolbox`);
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
          <h1 className="font-bold text-[20px] py-0 ml-3">Back to Toolbox</h1>
        </div>
        <TokenItem />
      </div>
      {isLoading ? (
        <div className="grid place-items-center h-screen">
          <Spinner text="Loading ..." />
        </div>
      ) : (
        <>
          {/* <div className="flex flex-row w-full bg-white justify-between items-center p-[20px] z-20 sticky top-0 pb-4 pt-2 bg-white ">
                            <a onClick={handleCancelClicked} className="cursor-pointer flex items-center text-[20px] font-Inter font-bold lg:flex">
                                <span className="flex"><KeyboardBackspaceIcon /></span>
                                <h1 className="ml-[15px]">{ session != undefined ? ventureTitle : 'ToolBox'}</h1>
                            </a>
                            <div className='relative'>
                                {
                                    isEditable && (
                                        ventureId != '' ? 
                                        <button
                                            className="flex items-center justify-center ml-[15px] bg-tertiary-red text-white active:bg-tertiary-red px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 font-Inter truncate"
                                            type="button"
                                            onClick={() => saveStoryTrain(-1)}
                                        >
                                            { isSaving ? <Spinner text='Saving'/> : 'Save' }
                                        </button>
                                        :
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
                                            {isSaving ? <Spinner text='Saving'/> : 'Save to Venture'}
                                            <span className="flex"><KeyboardArrowDownRoundedIcon /></span>
                                        </button>
                                    )
                                }
                                {
                                    saveDropdownOpen && (
                                        <OutsideClickHandler onOutsideClick={() => setSaveDropdownOpen(false)}>
                                            <div className={`absolute left-0 z-0 top-10 mt-[10px] border-2 border-secondary-gray w-[200px] rounded-[8px] bg-white`}>
                                                <ul className='font-Inter font-semibold text-sm px-0'>
                                                    {
                                                        ventureList.map((option: any, index: number) => {
                                                            return (
                                                                <li
                                                                    key={`venture_item_${index}`}
                                                                    className='flex items-center justify-between px-[20px] py-[10px] cursor-default border-b-2 border-secondary-gray'
                                                                    onClick={() => {
                                                                        setSaveDropdownOpen(!saveDropdownOpen);
                                                                        setSelectedVentureIndex(index);
                                                                        saveStoryTrain(index);
                                                                    }}
                                                                >
                                                                    {option.label}
                                                                    {
                                                                        index == selectedVentureIndex && <CheckCircleIcon fontSize="small" />
                                                                    }
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </OutsideClickHandler>
                                    )
                                }
                            </div>
                        </div> */}
          <div className="flex justify-between items-center mt-5">
            <div className="flex items-center text-[20px] font-Inter font-bold lg:flex">
              <h1 className="font-Inter font-bold mr-1">
                Coffee Chat
              </h1>
            </div>
            <button
              className="flex items-center justify-center bg-primary-blue text-[white] w-[133px] h-[50px] text-[14px] font-Inter rounded-[50px]"
              onClick={() => addBrainstorm()}
            >
              <AddIcon />
              {" Create"}
            </button>
          </div>
          <div className="mt-4 flex flex-col justify-center font-Inter">
            <p className="font-bold italic">
              &quot;Discovery consists of seeing what everybody has seen and
              thinking what nobody has thought.&quot; Nobel-Prize winner Albert
              von Szent-Györgyi
            </p>
            <p className="mt-4 text-[14px]">
              Use Coffee Chat for a quick divergent-to-convergent thinking exercise.
              Leveraging the Anchor Pillar as the prompt, and each participant
              comments to question, add, modify, and take away pieces of the
              story in a collaborative and/or devil&#39;s advocate manner (doesn&#39;t
              have to be turn-based). After a participant has reached 20
              comments, they will be prompted to creatively connect their
              favorites from the collective input to form an elevator pitch.
              Alternatively, use Coffee Chat for a networking simulation. No matter
              how large a networking event is, usually groups of 2-5 people
              huddle together. Unable to deliver your full elevator pitch,
              sharing the essence of your venture becomes more chaotic than a
              pitch at the podium. Can you get your message across while
              fielding questions? After the 20 comments, participants will
              summarize what they feel your elevator pitch is, and you can
              decide how well you steered the conversation based off of their
              interpretation. Try with different people and combinations of
              folks because that changes the dynamics too! To initiate Coffee Chat,
              record a 30 second elevator pitch (or just an idea, depending on
              what stage you&#39;re at) to set the tone, provide brief context, and
              invite some CORE members!
            </p>
          </div>
          <div className="flex justify-between items-center mt-8">
            <h4 className="truncate text-[20px] font-bold font-Inter py-0">
              My Coffee Chats ({brainstorms.length})
            </h4>
          </div>
          {brainstorms.length > 0 ? (
            <BrainStormsTable
              columns={columns}
              data={brainstorms}
              updateData={setBrainStorms}
              isOwner={true}
            />
          ) : (
            <>No results</>
          )}
          <div className="flex justify-between items-center mt-10">
            <h4 className="truncate text-[20px] font-bold font-Inter py-0">
              Invited Coffee Chats ({invitedBrainstorms.length})
            </h4>
          </div>
          {invitedBrainstorms.length > 0 ? (
            <BrainStormsTable
              columns={columns}
              data={invitedBrainstorms}
              updateData={setInvitedBrainStorms}
              isOwner={false}
            />
          ) : (
            <>No results</>
          )}
        </>
      )}
    </>
  );
};

const StatusItem = ({ label, active }: { label: string; active?: boolean }) => {
  return (
    <div
      className={`justify-center
           flex flex-col 
           text-center
           px-[15px]
           sm:py-3 py-4
           rounded-full
           ${
             active
               ? "bg-tertiary-green text-secondary-green border-l border-tertiary-green"
               : "bg-primary-blue text-white border-l border-primary-blue"
           }`}
    >
      <span className="self-center text-sm font-medium">{label}</span>
    </div>
  );
};

const BrainStormsTable = ({
  columns,
  data,
  updateData,
  isOwner,
}: {
  columns: any[];
  data: any[];
  updateData: Function;
  isOwner: boolean;
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
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const handleRowClick = (rowData: any) => {
    router.push(`/dashboard/toolbox/lemonade/${rowData.original._id}`);
  };

  const updateTableData = (id: string, row: any) => {
    const newData = data.map((item: any) => {
      if (item._id == id) {
        return row;
      } else {
        return item;
      }
    });
    updateData(newData);
  };

  const updateDeletedItem = (index: number) => {
    let temp = [...data];
    temp.splice(index, 1);
    updateData(temp);
  };

  const markComplete = async (id: string, original: any) => {
    setSelectedId(id);
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
      setSelectedId("");
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
      setSelectedId("");
      Swal.fire({
        icon: "success",
        title: "Success!",
        allowOutsideClick: false,
        text: `Completed Successfully!`,
      })
        .then(() => {
          let temp = original;
          temp.isCompleted = true;
          updateTableData(id, temp);
        })
        .catch((err) => console.log(err));
    }
  };

  const deleteLemonade = async (id: string, index: number) => {
    setSelectedId(id);
    setIsDeleting(true);
    const response = await fetch(`/api/lemonades/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const { err } = await response.json();
      setSelectedId("");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err,
      })
        .then(() => {
          setIsDeleting(false);
          console.log("Deleting was failed");
        })
        .catch((err) => console.log(err));
    } else {
      setIsDeleting(false);
      setSelectedId("");
      Swal.fire({
        icon: "success",
        title: "Success!",
        allowOutsideClick: false,
        text: `Deleted Successfully!`,
      })
        .then(() => {
          updateDeletedItem(index);
        })
        .catch((err) => console.log(err));
    }
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
                              className={`px-6 py-4 whitespace-wrap ${
                                cell.column.isCenter ? `text-center` : ``
                              }`}
                            >
                              {cell.column.id == "updatedAt" ||
                              cell.column.id == "createdAt" ? (
                                formatDate(cell.value)
                              ) : cell.column.id == "name" ? (
                                <>
                                  <a
                                    className="cursor-pointer font-bold"
                                    onClick={() => handleRowClick(row)}
                                  >
                                    {cell.render("Cell")}
                                  </a>
                                  <br />
                                  {row.original.participants.map(
                                    (participant: any, index: number) => {
                                      return (
                                        <span key={shortid()}>
                                          {index + 1 ==
                                          row.original.participants.length
                                            ? participant.name
                                            : participant.name + ", "}
                                        </span>
                                      );
                                    }
                                  )}
                                </>
                              ) : cell.column.id == "isCompleted" ? (
                                <StatusItem
                                  active={cell.value}
                                  label={`${
                                    cell.value ? `Completed` : `Active`
                                  }  `}
                                />
                              ) : cell.column.id == "action" ? (
                                isOwner ? (
                                  <div
                                    className={`grid grid-cols-${
                                      row.original.isCompleted ? "1" : "2"
                                    }`}
                                  >
                                    {isUpdating &&
                                    selectedId == row.original._id ? (
                                      <Spinner
                                        size={"6"}
                                        text={""}
                                        classStr={"flex items-center"}
                                      />
                                    ) : (
                                      !row.original.isCompleted && (
                                        <button
                                          className="text-secondary-green"
                                          onClick={() =>
                                            markComplete(
                                              row.original._id,
                                              row.original
                                            )
                                          }
                                        >
                                          <CheckCircleIcon />
                                        </button>
                                      )
                                    )}
                                    {isDeleting &&
                                    selectedId == row.original._id ? (
                                      <Spinner
                                        size={"6"}
                                        text={""}
                                        classStr={"flex items-center"}
                                      />
                                    ) : (
                                      <button
                                        className="text-tertiary-red"
                                        onClick={() =>
                                          deleteLemonade(row.original._id, i)
                                        }
                                      >
                                        <DeleteOutlineIcon />
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <></>
                                )
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

export default Index;
