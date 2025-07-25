import React, { useState } from "react";
import dynamic from "next/dynamic";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import Upload from "./Upload";
import CheckBoxList from "./CheckBoxList";
import Spinner from "@/components/Spinner";
const Editor = dynamic(() => import("./Editor"), { ssr: false });

const schema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  files: Yup.array(),
});

const defaultValues = {
  title: "",
  content: "",
  item: "",
  files: [],
};

const defaultErrors = {
  title: "",
  content: "",
  item: "",
  files: "",
};

const Add = ({ setAddOpen, addData }: any) => {
  const formOptions = {
    resolver: yupResolver(schema),
    defaultValues: { ...(defaultValues as any) },
  };
  const { register, handleSubmit } = useForm(formOptions);
  const [errors, setErrors] = useState<any>(defaultErrors);
  const [title, setTitle] = useState<string>("");
  const [files, setFormFiles] = useState<FileList | null>(null);
  const [content, setContent] = useState<string>("");
  const [item, setItem] = useState<string>("");
  const [contentError, setContentError] = useState<string>("");
  const [itemError, setItemError] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);

  function onSubmit(data: any) {
    setErrors(defaultErrors);
    if (title != "" && content != "" && item != "") {
      saveModule();
      return false;
    } else {
      setItemError("This field is required");
      setContentError("Content is required");
    }
  }

  const saveModule = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("item", item);
    if (files != null) {
      for (let i = 0; i < files.length; i++) {
        formData.append(`file${i}`, files[i]);
      }
    }

    setIsCreating(true);
    const response = await fetch("/api/modules", {
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
      Swal.fire({
        icon: "success",
        title: "Success!",
        allowOutsideClick: false,
        text: `Module was created successfully!`,
      })
        .then(() => {
          addData(result);
          setAddOpen(false);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleErrors = (errors: any) => {
    setErrors(errors);

    if (item == "") {
      setItemError("This field is required");
    }

    if (content == "") {
      setContentError("Content is required");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, handleErrors)}>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none">
        <div className="relative sm:w-11/12 w-11/12 my-6 mx-3 max-w-3xl">
          <div className="border-0 rounded-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="relative p-6 flex-auto">
              <div>
                <label className="font-Inter font-semibold tracking-[0.1em] text-[#232325]">
                  TITLE <span className="text-secondary-red">*</span>
                </label>
                <input
                  type="text"
                  className="w-full mt-[15px] border-secondary-gray border-[1px] rounded-[8px] h-[48px] placeholder:text-[16px] pl-[16px] focus:outline-none focus:border-primary-blue focus:ring-primary-blue"
                  placeholder="Enter Text Here..."
                  id="title"
                  {...register("title")}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  value={title}
                ></input>
                {errors.title && errors.title.message != "" && (
                  <div className="p-1">
                    <span className="text-secondary-red text-sm">
                      {errors.title.message}
                    </span>
                  </div>
                )}
              </div>
              <Upload setFormFiles={setFormFiles} />
              <div className="sm:mt-[35px] mt-[10px]">
                <label className="font-Inter font-semibold tracking-[0.1em] text-[#232325]">
                  DESCRIPTION <span className="text-secondary-red">*</span>
                </label>
              </div>
              <Editor
                value={content}
                onChange={(data: string) => {
                  if (data == "") {
                    setContentError("Content is required");
                  }
                  setContent(data);
                }}
                register={register}
              />
              {content == "" && contentError != "" && (
                <div className="p-1">
                  <span className="text-secondary-red text-sm">
                    {contentError}
                  </span>
                </div>
              )}
              <div className="sm:mt-[35px] mt-[10px]">
                <label className="font-Inter font-semibold tracking-[0.1em] text-[#232325]">
                  VENTURE PILLARS <span className="text-secondary-red">*</span>
                </label>
              </div>
              <CheckBoxList
                item={""}
                setItemError={setItemError}
                setItem={setItem}
                register={register}
              />
              {item == "" && itemError != "" && (
                <div className="p-1">
                  <span className="text-secondary-red text-sm">
                    {itemError}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end font-Inter font-bold p-6">
              <button
                className="text-[#232325] background-transparent px-6 py-2 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => {
                  setAddOpen(false);
                }}
                disabled={isCreating ? true : false}
              >
                Cancel
              </button>
              <button
                className="bg-primary-blue text-white active:bg-primary-blue px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="submit"
              >
                {isCreating ? <Spinner text="Creating..." /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Add;
