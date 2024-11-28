import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Select from "react-select";
import Swal from "sweetalert2";
import Spinner from "@/components/Spinner";
import VideoStatusItem from "@/components/VideoStatusItem";

import { NinetyVideo } from "@/types/ninetyvideo.type";

import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VideoWithUser from "../../VideoWithUser";

const statusOptions = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Public",
    value: "public",
  },
  {
    label: "Private",
    value: "private",
  },
  {
    label: "Reject",
    value: "reject",
  },
];

const typeOptions = [
  {
    label: "All",
    value: 0,
  },
  {
    label: "Can You Make a Kid Care in 90 Seconds",
    value: 1,
  },
  {
    label: "90 Seconds Inside the Mind of an Investor",
    value: 2,
  },
  {
    label: "And Then This Happened...",
    value: 3,
  },
  {
    label: "NanoTalks",
    value: 4,
  },
];

const Videos = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [videos, setVideos] = useState<NinetyVideo[]>([]);
  const [orgVideos, setOrgVideos] = useState<NinetyVideo[]>([]);
  const [status, setStatus] = useState<any | null>(statusOptions[0]);
  const [type, setType] = useState<any | null>(typeOptions[0]);

  const getVideos = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/makeninety`, {
      method: "PUT",
    });

    if (!response.ok) {
      setIsLoading(false);
      const { err } = await response.json();
      console.log(err);
    } else {
      const { result } = await response.json();
      setVideos(result);
      setOrgVideos(result);
      setIsLoading(false);
    }
  };

  const updateVideoStatus = async (index: number, newStatus: string) => {
    const apiUrl =
      videos[index].type == 4
        ? `/api/nanotalks/${videos[index]._id}`
        : `/api/makeninety/${videos[index]._id}`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
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
        .then(() => console.log("update failed"))
        .catch((err) => console.log(err));
    } else {
      const { success } = await response.json();
      setSelectedId("");
      if (success) {
        if (newStatus == "public") {
          setIsApproving(false);
        } else {
          setIsRejecting(false);
        }
        var tempVideos = videos;
        tempVideos[index].status = newStatus;
        const tempOrgVideos = orgVideos.map((videoItem: NinetyVideo) => {
          if (videoItem._id == tempVideos[index]._id) {
            return {
              ...videoItem,
              status: newStatus,
            };
          } else {
            return videoItem;
          }
        });
        setOrgVideos(tempOrgVideos);
        Swal.fire({
          icon: "success",
          title: "Success!",
          allowOutsideClick: false,
          text:
            newStatus == "public"
              ? `Video was approved successfully!`
              : `Video was rejected!`,
        })
          .then(() => {
            setStatus(statusOptions[0]);
          })
          .catch((err) => console.log(err));
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        })
          .then(() => console.log("update failed"))
          .catch((err) => console.log(err));
      }
    }
  };

  useEffect(() => {
    document.title = "Core Videos - Turtle Boat Admin";
    getVideos();
  }, []);

  const handleStatusChange = (selected: any) => {
    setStatus(selected);
    filterVideos(type.value, selected.value);
  };

  const handleTypeChange = (selected: any) => {
    setType(selected);
    filterVideos(selected.value, status.value);
  };

  const filterVideos = (selectedType: number, selectedStatus: string) => {
    if (selectedType == 0 && selectedStatus == "all") {
      setVideos(orgVideos);
    } else {
      if (selectedType != 0 && selectedStatus != "all") {
        const tempVideos = orgVideos;
        const filteredVideos = tempVideos.filter(
          (video) =>
            video.type == selectedType && video.status == selectedStatus
        );
        setVideos(filteredVideos);
      } else if (selectedType == 0) {
        const tempVideos = orgVideos;
        const filteredVideos = tempVideos.filter(
          (video) => video.status == selectedStatus
        );
        setVideos(filteredVideos);
      } else {
        const tempVideos = orgVideos;
        const filteredVideos = tempVideos.filter(
          (video) => video.type == selectedType
        );
        setVideos(filteredVideos);
      }
    }
  };

  const handleApprove = (index: number) => {
    setSelectedId(videos[index]._id);
    setIsApproving(true);
    updateVideoStatus(index, "public");
  };

  const handleReject = (index: number) => {
    setSelectedId(videos[index]._id);
    setIsRejecting(true);
    updateVideoStatus(index, "reject");
  };

  const handleDelete = (id: string, typeId: number) => {
    if (!isDeleting) {
      Swal.fire({
        title: typeId == 4 ? "Delete 3min Video" : "Delete 90s Video",
        text: `Are you sure you want to delete this video?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete it!",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setIsDeleting(true);
          setSelectedId(id);
          const result = await deleteVideo(id, typeId);
          if (result.success) {
            setIsDeleting(false);
            setSelectedId("");
            Swal.fire(
              "Video Deleted",
              `${typeId == 4 ? "3min" : "90s"} video has been deleted`,
              "success"
            );
            const temp = orgVideos.filter(
              (video: NinetyVideo) => video._id !== id
            );
            setOrgVideos(temp);
            if (type.value == 0 && status.value == "all") {
              setVideos(temp);
            } else {
              if (type.value != 0 && status.value != "all") {
                const filteredVideos = temp.filter(
                  (video) =>
                    video.type == type.value && video.status == status.value
                );
                setVideos(filteredVideos);
              } else if (type.value == 0) {
                const filteredVideos = temp.filter(
                  (video) => video.status == status.value
                );
                setVideos(filteredVideos);
              } else {
                const filteredVideos = temp.filter(
                  (video) => video.type == type.value
                );
                setVideos(filteredVideos);
              }
            }
          } else {
            setIsDeleting(false);
            setSelectedId("");
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: result.err,
            });
          }
        }
      });
    }
  };

  const deleteVideo = async (id: string, typeId: number) => {
    const apiUrl =
      typeId == 4 ? `/api/nanotalks/${id}` : `/api/makeninety/${id}`;
    const response = await fetch(apiUrl, {
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

  return (
    <div>
      <div className="block sm:flex justify-between items-center sticky top-0 bg-white z-10 pt-2 pb-4">
        <div className="cursor-pointer flex items-center text-[20px] font-Inter font-bold lg:flex p-2">
          <h1 className="font-Inter font-bold mr-1">Core Videos</h1>
        </div>
        <div className="sm:flex grid grid-cols-1 gap-x-3 gap-y-2 relative items-center">
          <Select
            options={typeOptions}
            placeholder={"Select Video Type ..."}
            className="min-w-[250px]"
            value={type}
            onChange={handleTypeChange}
            isSearchable={false}
            styles={{
              control: (provided: any, state: any) => ({
                ...provided,
                borderRadius: "5px",
                marginTop: "0px",
                padding: "3px",
                border: state.isFocused
                  ? "1px solid #2E65F3"
                  : "1px solid #2E65F3",
              }),
              option: (provided: any, state: any) => ({
                ...provided,
                backgroundColor: state.isSelected ? "#2E65F3" : "transparent",
                color: state.isSelected ? "white" : "#4a5568",
                ":hover": {
                  backgroundColor: state.isSelected ? "#2E65F3" : "#e2e8f0",
                  color: state.isSelected ? "white" : "#4a5568",
                },
              }),
            }}
          />
          <Select
            options={statusOptions}
            placeholder={"Select Status ..."}
            value={status}
            onChange={handleStatusChange}
            isSearchable={false}
            styles={{
              control: (provided: any, state: any) => ({
                ...provided,
                borderRadius: "5px",
                marginTop: "0px",
                padding: "3px",
                border: state.isFocused
                  ? "1px solid #2E65F3"
                  : "1px solid #2E65F3",
              }),
              option: (provided: any, state: any) => ({
                ...provided,
                backgroundColor: state.isSelected ? "#2E65F3" : "transparent",
                color: state.isSelected ? "white" : "#4a5568",
                ":hover": {
                  backgroundColor: state.isSelected ? "#2E65F3" : "#e2e8f0",
                  color: state.isSelected ? "white" : "#4a5568",
                },
              }),
            }}
          />
        </div>
      </div>
      {/* <div>
                <button className="px-5 py-5 bg-slate-600" onClick={() => { window.location.href = '/dashboard/core/makeninety/add' }}>Add</button>
            </div> */}
      {isLoading ? (
        <div className="grid place-items-center h-full">
          <Spinner text="Loading Videos ..." />
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((item: NinetyVideo, index: number) => {
              return (
                <div key={`video_${index}`}>
                  <VideoWithUser item={item} isAdmin={true} />
                  <div className="flex gap-x-1 items-center mt-0 pl-[43px] pr-[10px] justify-between">
                    <VideoStatusItem value={item.status} />
                    {item.status == "private" && (
                      <>
                        <button
                          className="text-white bg-primary-blue hover:bg-primary-blue 
                                                            focus:ring-4 focus:outline-none focus:ring-primary-blue 
                                                            font-medium rounded-lg text-sm px-4 sm:py-2 py-1 text-center"
                          type="button"
                          disabled={isRejecting}
                          onClick={() => handleApprove(index)}
                        >
                          {isApproving && selectedId == item._id ? (
                            <Spinner text="Approving" size="4" isFlex={true} />
                          ) : (
                            "Approve"
                          )}
                        </button>
                        <button
                          className="text-white bg-tertiary-red hover:bg-tertiary-red 
                                                            focus:ring-4 focus:outline-none focus:ring-tertiary-red 
                                                            font-medium rounded-lg text-sm px-4 sm:py-2 py-1 text-center"
                          type="button"
                          disabled={isApproving}
                          onClick={() => handleReject(index)}
                        >
                          {isRejecting && selectedId == item._id ? (
                            <Spinner text="Rejecting" size="4" isFlex={true} />
                          ) : (
                            "Reject"
                          )}
                        </button>
                      </>
                    )}
                    {isDeleting && selectedId == item._id ? (
                      <Spinner text="" size="4" isFlex={true} />
                    ) : (
                      <DeleteIcon
                        className="text-secondary-red cursor-pointer"
                        onClick={() => handleDelete(item._id, item.type)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {videos.length == 0 && <div className="text-center">No Videos</div>}
        </>
      )}
    </div>
  );
};

export default Videos;
