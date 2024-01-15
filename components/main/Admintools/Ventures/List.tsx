import React, { useState, useEffect } from "react";
import OutsideClickHandler from "react-outside-click-handler";

import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Venture } from "@/types/venture.type";
import { formatDate } from "@/utils/utils";
import Swal from "sweetalert2";
import Spinner from "@/components/Spinner";

import Edit from "./Edit";

const List = ({
  setAccessModal,
  setEditModal,
  setViewModal,
  setEditableData,
  setEditableIndex,
  sortData,
  ventures,
  archiveData,
}: {
  setAccessModal: any;
  setEditableData: any;
  setEditModal: any;
  setViewModal: any;
  setEditableIndex: any;
  sortData: Function;
  ventures: Venture[];
  archiveData: any;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownIndex, setDropdownIndex] = useState(-1);
  const [archivingIndex, setArchivingIndex] = useState(-1);
  const [deletingIndex, setDeletingIndex] = useState(-1);
  const [titleSort, setTitleSort] = useState(1);
  const [createdSort, setCreatedSort] = useState(-1);
  const [updatedSort, setUpdatedSort] = useState(-1);

  useEffect(() => {
    if (dropdownIndex !== -1) {
      setDropdownOpen(true);
    }
  }, [dropdownIndex]);

  const archiveVenture = async (id: string) => {
    const response = await fetch(`/api/ventures/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const { err } = await response.json();
      console.log(err);
      return { success: false, err: err };
    } else {
      return { success: true };
    }
  };

  const deleteVenture = async (id: string) => {
    const response = await fetch(`/api/ventures/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const { err } = await response.json();
      console.log(err);
      return { success: false, err: err };
    } else {
      return { success: true };
    }
  };

  const handleArchive = (index: number) => {
    Swal.fire({
      title: "Archive Venture",
      text: `Are you sure you want to archive this venture?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, archive it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setArchivingIndex(index);
        const result = await archiveVenture(ventures[index]._id);
        if (result.success) {
          archiveData(index);
          setArchivingIndex(-1);
          Swal.fire("Venture was archived", `Venture was archived`, "success");
        } else {
          setArchivingIndex(-1);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: result.err,
          });
        }
      }
    });
  };

  const handleDelete = (index: number) => {
    Swal.fire({
      title: "Delete Venture",
      text: `Are you sure you want to delete this venture?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingIndex(index);
        const result = await deleteVenture(ventures[index]._id);
        if (result.success) {
          archiveData(index);
          setDeletingIndex(-1);
          Swal.fire("Venture was deleted", `Venture was deleted`, "success");
        } else {
          setDeletingIndex(-1);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: result.err,
          });
        }
      }
    });
  };

  const handleViewClicked = (item: Venture, index: number) => {
    // setEditableData(item);
    // setViewModal(true);
    setEditableData(item);
    setEditableIndex(index);
    setEditModal(true);
  };

  return (
    <div className={`grid grid-cols-1 pt-[75px]`}>
      <div className="w-full">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-gray-700 uppercase bg-gray-50">
            <tr className="font-Inter font-semibold tracking-[2px] text-[12px] text-black">
              <th
                scope="col"
                className="pt-[10px] pb-[10px] pl-[40px] w-[40%] truncate"
                onClick={() => {
                  setTitleSort(titleSort * -1);
                  sortData("title", titleSort);
                }}
              >
                NAME
              </th>
              <th
                scope="col"
                className="pt-[10px] pb-[10px] items-center w-[15%] truncate"
                onClick={() => {
                  setCreatedSort(createdSort * -1);
                  sortData("createdAt", createdSort);
                }}
              >
                DATE CREATED
                {createdSort == -1 ? (
                  <ArrowDropUpIcon sx={{ fontSize: "20px" }} />
                ) : (
                  <ArrowDropDownIcon sx={{ fontSize: "20px" }} />
                )}
              </th>
              <th
                scope="col"
                className="pt-[10px] pb-[10px] flex items-center w-[15%]"
              >
                LAST UPDATED
              </th>
              <th scope="col" className="pt-[10px] pb-[10px] w-[25%]">
                COURSE
              </th>
              <th scope="col" className="pt-[10px] pb-[10px] w-[5%]"></th>
            </tr>
          </thead>
          <tbody>
            {ventures.map((item, index) => {
              return archivingIndex === index ? (
                <tr className="bg-white border-b" key={"archiving_" + index}>
                  <th
                    scope="row"
                    className="pl-[10px] py-[20px] font-Inter text-[16px] text-black w-[40%] truncate"
                  >
                    <Spinner text="Archiving..." />
                  </th>
                  <td className="py-[20px] text-[#6F727A] text-[12px] w-[15%]"></td>
                  <td className="py-[20px] text-[#6F727A] text-[12px] w-[15%]"></td>
                  <td className="py-[20px] text-[#6F727A] text-[12px] w-[25%] truncate"></td>
                  <td className="relative py-[20px] text-[#6F727A] w-[5%]"></td>
                </tr>
              ) : deletingIndex === index ? (
                <tr className="bg-white border-b" key={"deleting_" + index}>
                  <th
                    scope="row"
                    className="pl-[10px] py-[20px] font-Inter text-[16px] text-black w-[40%] truncate"
                  >
                    <Spinner text="Deleting..." />
                  </th>
                  <td className="py-[20px] text-[#6F727A] text-[12px] w-[15%]"></td>
                  <td className="py-[20px] text-[#6F727A] text-[12px] w-[15%]"></td>
                  <td className="py-[20px] text-[#6F727A] text-[12px] w-[25%] truncate"></td>
                  <td className="relative py-[20px] text-[#6F727A] w-[5%]"></td>
                </tr>
              ) : (
                <tr
                  className="bg-white border-b hover:bg-gray-100"
                  key={"tr_" + index}
                >
                  <th
                    scope="row"
                    className="pl-[10px] py-[20px] font-Inter text-[16px] text-black w-[40%] truncate"
                  >
                    <a
                      className="cursor-pointer"
                      onClick={() => handleViewClicked(item, index)}
                    >
                      <TipsAndUpdatesOutlinedIcon />
                    </a>
                    <a
                      className="cursor-pointer"
                      onClick={() => handleViewClicked(item, index)}
                    >
                      <label className="pl-[18px]">
                        {item.isTeam
                          ? item.title + " - " + item.mentee.name
                          : item.title}
                      </label>
                    </a>
                  </th>
                  <td className="py-[20px] px-[5px] text-[#6F727A] text-[12px] w-[15%]">
                    <label className="font-Inter font-semibold">
                      {formatDate(item.createdAt)}
                    </label>
                  </td>
                  <td className="py-[20px] px-[5px] text-[#6F727A] text-[12px] w-[15%]">
                    <label className="font-Inter font-semibold">
                      {formatDate(item.updatedAt)}
                    </label>
                  </td>
                  <td className="py-[20px] px-[5px] text-[#6F727A] text-[12px] w-[25%] truncate">
                    <label className="font-Inter font-semibold">
                      {item.course.title}
                    </label>
                  </td>
                  <td className="relative py-[20px] px-[5px] text-[#6F727A] w-[5%]">
                    <button
                      className={`rounded-[50px] border-2 border-transparent hover:border-[#6F727A] float-right  ${
                        dropdownOpen === true &&
                        index === dropdownIndex &&
                        "bg-[#DCECFB]"
                      }`}
                      onClick={() => {
                        setDropdownOpen(!dropdownOpen);
                        setDropdownIndex(index);
                      }}
                    >
                      <MoreHorizIcon />
                    </button>

                    {dropdownOpen && dropdownIndex === index && (
                      <OutsideClickHandler
                        onOutsideClick={() => setDropdownOpen(false)}
                      >
                        <div className="absolute left-[-180px] z-0 top-0 mt-[10px] border-2 border-secondary-gray w-[200px] rounded-[8px] bg-white">
                          <ul className="font-Inter font-semibold text-[16px] px-[20px]">
                            {/* <li
                                                                    className='py-[18px] cursor-default'
                                                                    onClick={() => {
                                                                        setEditableData(item);
                                                                        setEditableIndex(index);
                                                                        setAccessModal(true);
                                                                    }}
                                                                >
                                                                    Edit Access
                                                                </li> */}
                            <li
                              className="py-[18px] cursor-default"
                              onClick={() => {
                                setEditableData(item);
                                setEditableIndex(index);
                                setEditModal(true);
                              }}
                            >
                              Edit Venture
                            </li>
                            <hr />
                            <li
                              className="py-[18px] cursor-default text-secondary-red"
                              // onClick={() => {
                              //     archiveData(index);
                              //     setDropdownOpen(false);
                              // }}
                              onClick={() => handleArchive(index)}
                            >
                              Archive Venture
                            </li>
                            <li
                              className="py-[18px] cursor-default text-secondary-red"
                              onClick={() => handleDelete(index)}
                            >
                              Delete Venture
                            </li>
                          </ul>
                        </div>
                      </OutsideClickHandler>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;
