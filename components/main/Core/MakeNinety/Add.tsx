import React, { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Spinner from "@/components/Spinner";
import TokenItem from "@/components/layouts/TokenItem";
import Select from "react-select";

import Upload from "./Upload";

const requiredErrMsg = "This field is required!";

const videoTypeOptions = [
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
];

const Add = () => {
  const { data: session } = useSession();
  const user = session?.user as User;
  const router = useRouter();

  const { type } = router.query;
  let typeId = 1;
  if (typeof type === "string" && type !== "") {
    typeId = parseInt(type.toString());
  }

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [files, setFormFiles] = useState<FileList | null>(null);
  const [error, setError] = useState<string>("");
  const [videoType, setVideoType] = useState<any | null>(videoTypeOptions[0]);
  const [videoTypeError, setVideoTypeError] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (files && files.length > 0) {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(files[0]);
      video.addEventListener("loadedmetadata", () => {
        if (typeId != 4) {
          if (video.duration > 90) {
            setError("Your video is over 90 seconds");
          }
        } else if (typeId == 4) {
          if (video.duration > 180) {
            setError("Your video is over 3 min");
          }
        }
      });
    } else {
      setError("");
    }
  }, [files]);

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const handlePostVideo = async () => {
    if (title == "") {
      setTitleError("Title is required!");
    } else {
      setTitleError("");
    }
    if (!files || files.length == 0) {
      setError("Video file is required!");
    } else {
      setError("");
    }
    // setVideoTypeError(videoType == null);
    if (titleError == "" && error == "" && user != undefined) {
      let username = user.name;
      if (
        !user.isNewUser &&
        user.basicProfile &&
        user.basicProfile.firstName &&
        user.basicProfile.lastName
      ) {
        username =
          user.basicProfile?.firstName + " " + user.basicProfile?.lastName;
      }
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (typeof user._id === "string" && user._id !== "") {
        formData.append("uid", user._id.toString());
      }
      if (typeof username === "string" && username !== "") {
        formData.append("username", username.toString());
      }

      setIsCreating(true);

      const uploadingAlert = Swal.fire({
        title: "Uploading...",
        html: `<div class="text-center overflow-hidden"><div class="justify-center" role="status" style="display: flex; align-items: center;"><svg aria-hidden="true" class="w-12 h-12 mr-2 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path></svg></div><div class="justify-center mt-5"><span>May take ~2 min to upload if file is large</span></div></div>`,
        allowOutsideClick: false,
        showCancelButton: false,
        showConfirmButton: false,
      });
      if (files != null && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const folderName = "ninetyvideos";
          const publicId = `ycity_files/${files[i].name}`;
          const overwrite = true;
          const eagerAsync = true;
          const invalidate = true;
          // const eager = `f_auto,w_640,h_360,c_limit,ac_aac,br_96,fps_30,q_50,vc_auto`;
          const eager = `w_640,h_360,c_limit,ac_aac,br_96,fps_30,q_50`;

          const signData = await fetch("/api/cloudinaryconfig", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              folder: folderName,
              publicId: publicId,
              overwrite: overwrite,
              eagerAsync: eagerAsync,
              invalidate: invalidate,
              eager: eager,
              format: "mp4",
            }),
          });

          console.log("sign data", signData);

          if (!signData.ok) {
            setIsCreating(false);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Upload failed, Please try again!",
            })
              .then(() => {
                setIsCreating(false);
              })
              .catch((err) => console.log(err));
          } else {
            const { timestamp, signature, cloudname, apikey } =
              await signData.json();
            // Set your cloud name and unsigned upload preset here:
            var YOUR_UNSIGNED_UPLOAD_PRESET = "eixkcjei";

            var POST_URL =
              "https://api.cloudinary.com/v1_1/" + cloudname + "/auto/upload";

            var XUniqueUploadId = +new Date();

            const processFile = function () {
              var size = files[i].size;
              var sliceSize = 20000000;
              var start = 0;

              setTimeout(loop, 3);

              function loop() {
                if (files != null && files.length > 0) {
                  var end = start + sliceSize;

                  if (end > size) {
                    end = size;
                  }
                  var s = slice(files[i], start, end);
                  send(s, start, end - 1, size);
                  if (end < size) {
                    start += sliceSize;
                    setTimeout(loop, 3);
                  }
                }
              }
            };

            processFile();

            const send = function (
              piece: any,
              start: number,
              end: number,
              size: number
            ) {
              console.log("start ", start);
              console.log("end", end);

              var uploadFormData = new FormData();
              console.log(XUniqueUploadId);

              uploadFormData.append("file", piece);
              uploadFormData.append("cloud_name", cloudname);
              uploadFormData.append("api_key", apikey);
              uploadFormData.append("folder", folderName);
              uploadFormData.append(
                "upload_preset",
                YOUR_UNSIGNED_UPLOAD_PRESET
              );
              uploadFormData.append("public_id", publicId);

              var xhr = new XMLHttpRequest();
              xhr.open("POST", POST_URL, false);
              xhr.setRequestHeader(
                "X-Unique-Upload-Id",
                XUniqueUploadId.toString()
              );
              xhr.setRequestHeader(
                "Content-Range",
                "bytes " + start + "-" + end + "/" + size
              );

              xhr.onload = async function () {
                // do something to response
                const data = this.responseText;
                console.log(data);
                if (data != null) {
                  const uploadResult = JSON.parse(data);
                  console.log("upload result", uploadResult);
                  if (uploadResult.done || uploadResult.asset_id) {
                    var url = uploadResult.secure_url;
                    // if (uploadResult.format != 'mp4' && uploadResult.eager.length > 0) {
                    if (uploadResult.eager.length > 0) {
                      url = uploadResult.eager[0].url;
                    }
                    formData.append("secure_url", url);
                    formData.append("asset_id", uploadResult.asset_id);
                    formData.append(
                      "original_filename",
                      publicId + "." + uploadResult.format
                    );
                    formData.append("public_id", uploadResult.public_id);
                    formData.append("type", typeId.toString());

                    const apiUrl =
                      typeId == 4 ? "/api/nanotalks" : "/api/makeninety";

                    const response = await fetch(apiUrl, {
                      method: "POST",
                      body: formData,
                    });
                    if (!response.ok) {
                      Swal.close();
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
                      Swal.close();
                      const { success } = await response.json();
                      setIsCreating(false);
                      Swal.fire({
                        icon: "success",
                        title: "Success!",
                        allowOutsideClick: false,
                        text:
                          typeId == 4
                            ? `Thank you for uploading your 3min NanoTalk. When it has been approved for receiving Member feedback, you will receive a notification.`
                            : `Thank you for uploading your 90 second sound bite. When it has been approved for receiving Member feedback, you will receive a notification.`,
                      })
                        .then(() => {
                          router.push("/dashboard/core/makeninety");
                        })
                        .catch((err) => console.log(err));
                    }
                  } else if (uploadResult.error) {
                    Swal.close();
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "Upload failed. Please try again",
                    })
                      .then(() => {
                        setIsCreating(false);
                      })
                      .catch((err) => console.log(err));
                  }
                } else {
                  Swal.close();
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Upload failed. Please try again",
                  })
                    .then(() => {
                      setIsCreating(false);
                    })
                    .catch((err) => console.log(err));
                }
              };

              xhr.send(uploadFormData);
            };

            const slice = function (file: any, start: number, end: number) {
              var slice = file.mozSlice
                ? file.mozSlice
                : file.webkitSlice
                ? file.webkitSlice
                : file.slice
                ? file.slice
                : noop;

              return slice.bind(file)(start, end);
            };

            const noop = function () {};

            // fetch(url, {
            //     method: "POST",
            //     body: uploadFormData
            // })
            // .then((response) => {
            //     console.log("response data", response)
            //     if (response.ok) {
            //         return response.text();
            //     } else {
            //         return null;
            //     }
            // })
            // .then(async (data) => {
            //     if (data != null) {
            //         const uploadResult = JSON.parse(data);
            //         formData.append('secure_url', uploadResult.secure_url);
            //         formData.append('asset_id', uploadResult.asset_id);
            //         formData.append('original_filename', uploadResult.original_filename + '.' + uploadResult.format);
            //         formData.append('public_id', uploadResult.public_id);
            //         formData.append('type', typeId.toString());

            //         const response = await fetch("/api/makeninety", {
            //             method: "POST",
            //             body: formData,
            //         });

            //         if (!response.ok) {
            //             setIsCreating(false);
            //             const { err } = await response.json();
            //             Swal.fire({
            //                 icon: "error",
            //                 title: "Oops...",
            //                 text: err,
            //             })
            //             .then(() => {
            //                 setIsCreating(false);
            //             })
            //             .catch((err) => console.log(err));
            //         } else {
            //             const { success } = await response.json();
            //             setIsCreating(false);
            //             Swal.fire({
            //                 icon: "success",
            //                 title: "Success!",
            //                 allowOutsideClick: false,
            //                 text: `Thank you for uploading your 90 second sound bite.  When it has been approved for receiving Member feedback, you will receive a notification.`,
            //             })
            //                 .then(() => {
            //                     router.push('/dashboard/core/makeninety');
            //                 })
            //                 .catch((err) => console.log(err));
            //         }
            //     } else {
            //         Swal.fire({
            //             icon: "error",
            //             title: "Oops...",
            //             text: 'Upload failed. Please try again',
            //         })
            //         .then(() => {
            //             setIsCreating(false);
            //         })
            //         .catch((err) => console.log(err));
            //     }
            // }).catch((error) => {
            //     console.log(error);
            //     Swal.fire({
            //         icon: "error",
            //         title: "Oops...",
            //         text: 'Upload failed. Please try again',
            //     })
            //     .then(() => {
            //         setIsCreating(false);
            //     })
            //     .catch((err) => console.log(err));
            // });
          }
        }
      }
    }
  };

  const handleBackClick = () => {
    router.push("/dashboard/core/makeninety");
  };

  const handleVideoTypeChange = (selected: any) => {
    setVideoType(selected);
    setVideoTypeError(false);
  };

  return (
    <>
      <div className="flex justify-between items-center sticky top-0 bg-white z-10 pt-2 pb-4">
        <div
          className="cursor-pointer flex items-center text-[20px] font-Inter font-bold lg:flex p-2"
          onClick={handleBackClick}
        >
          <span className="flex">
            <KeyboardBackspaceIcon />
          </span>
          <span className="font-Inter font-bold ml-[15px]">Back</span>
        </div>
        <TokenItem />
      </div>
      <div className="w-full flex justify-center">
        <div className="w-3/3 lg:w-2/3 xl:w-1/2 rounded-xl px-5 py-4 font-Inter">
          <div className="py-[20px]">
            <label className="font-semibold tracking-[0.1em] text-primary-black">
              TITLE <span className="text-secondary-red">*</span>
            </label>
            <input
              type="text"
              className="w-full mt-[15px] border-secondary-gray border-[1px] rounded-[8px] h-[48px] placeholder:text-[16px] pl-[16px] focus:outline-none focus:border-primary-blue focus:ring-primary-blue"
              placeholder="Enter Text Here..."
              id="title"
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value == "") {
                  setTitleError("Title is required!");
                } else {
                  setTitleError("");
                }
              }}
              value={title}
            ></input>
            <p className="font-Inter text-sm text-secondary-red pt-2">
              {titleError}
            </p>
          </div>
          {/* <div className="py-[0px]">
                        <label htmlFor={`videoType`} className="font-semibold tracking-[0.1em] text-primary-black">Select Video Type<span className="text-secondary-red">*</span></label>
                        <Select
                            options={videoTypeOptions}
                            value={videoType}
                            className="z-50"
                            onChange={handleVideoTypeChange}
                            isSearchable={false}
                            styles={{
                                control: (provided, state) => ({
                                    ...provided,
                                    borderRadius: '5px',
                                    marginTop: '16px',
                                    padding: '3px',
                                    border: state.isFocused ? '1px solid #2E65F3' : '1px solid #2E65F3',
                                }),
                                option: (provided, state) => ({
                                    ...provided,
                                    backgroundColor: state.isSelected ? '#2E65F3' : 'transparent',
                                    color: state.isSelected ? 'white' : '#4a5568',
                                    ':hover': {
                                        backgroundColor: state.isSelected ? '#2E65F3' : '#e2e8f0',
                                        color: state.isSelected ? 'white' : '#4a5568'
                                    }
                                }),
                            }}
                        />
                        {
                            videoTypeError && (
                                <div className='p-1'>
                                    <span className="text-secondary-red text-sm">
                                        {requiredErrMsg}
                                    </span>
                                </div>
                            )
                        }
                    </div> */}
          <div className="py-[0px] relative">
            <label
              htmlFor={`description`}
              className="font-semibold tracking-[0.1em] text-primary-black"
            >
              DESCRIPTION
            </label>
            <span className="absolute right-[10px] top-[0px]">
              {description.length}/250
            </span>
            <div className="relative">
              <textarea
                rows={4}
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                maxLength={250}
                className={`block p-2.5 mt-4 w-full text-md text-gray-900 bg-white rounded-lg border border-gray-300 
                                focus:outline-none focus:border-primary-blue focus:ring-primary-blue `}
                placeholder="Enter Text Here..."
              ></textarea>
            </div>
          </div>
          <div className="py-[0px]">
            <Upload setFormFiles={setFormFiles} type={typeId} />
            <p className="font-Inter text-sm text-secondary-red pt-2">
              {error}
            </p>
          </div>
          <div className="flex items-center justify-end font-Inter font-bold py-6">
            <button
              className="text-primary-black background-transparent px-6 py-2 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={handleBackClick}
            >
              Cancel
            </button>
            <button
              className="bg-primary-blue text-white active:bg-primary-blue px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              onClick={handlePostVideo}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Add;
