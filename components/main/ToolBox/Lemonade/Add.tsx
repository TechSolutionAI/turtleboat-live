import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { User } from "next-auth";
import Swal from "sweetalert2";
import Spinner from "@/components/Spinner";
import UserSelect from "@/components/UserSelect";
import LemonadePitch from "@/components/LemonadePitch";
import { v4 as uuid } from "uuid";
import Select from "react-select";

interface Option {
  value: string;
  label: string;
  image: string;
  email: string;
}

const purposesOptions = [
  { label: `Brainstorm in a Sandbox`, value: 0 },
  {
    label: `Messy Conversations`,
    value: 1,
  },
];

const pillarOptions = [
  { label: "Problem Pillar", value: 0 },
  {
    label: "Character Pillar",
    value: 1,
  },
  { label: "Setting Pillar", value: 2 },
  {
    label: "Solution Pillar",
    value: 3,
  },
];

const Add = ({}: {}) => {
  const { data: session } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const [purpose, setPurpose] = useState<any | null>(purposesOptions[0]);
  const [purposeError, setPurposeError] = useState<string>("");
  const [pillar, setPillar] = useState<any | null>(null);
  const [description, setDescription] = useState<string>("");
  const [participantError, setParticipantError] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [pitchUploading, setIsPitchUploading] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [pitch, setPitch] = useState<string>("");
  const [disableList, setDisableList] = useState<Option[]>([
    {
      email: user.email ?? "",
      label: user.isNewUser
        ? user.name ?? ""
        : user?.basicProfile?.firstName + " " + user?.basicProfile?.lastName,
      image: user.image ?? "",
      value: user._id ?? "",
    },
  ]);

  const handleCreateClick = () => {
    if (participants.length > 0) {
      setParticipantError("");
    } else {
      setParticipantError("Please selecte at least one Participant!");
    }
    if (purpose != "") {
      setPurposeError("");
    } else {
      setPurposeError("Purpose is required!");
    }
    if (purpose != null && participants.length > 0) {
      const participantList = participants.map((participant) => {
        return {
          _id: participant.value,
          name: participant.label,
          image: participant.image,
          email: participant.email,
        };
      });
      saveLemonade({
        name: purpose.label,
        pillar: pillar != null ? pillar.label : "",
        description: description,
        participants: participantList,
        user: {
          email: user.email,
          name: user.isNewUser
            ? user.name
            : user?.basicProfile?.firstName +
              " " +
              user?.basicProfile?.lastName,
          image: user.image,
          _id: user._id,
        },
        pitch: pitch,
      });
    }
    return false;
  };

  const saveAudio = (audioData: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(audioData);
    reader.onloadend = async () => {
      if (reader.result != null && typeof reader.result === "string") {
        const base64data = reader.result?.split(",")[1];
        if (!base64data) {
          console.error("Failed to convert audio to base64");
          return;
        }
        setIsPitchUploading(true);
        // Now you can send the base64 encoded data to the server using fetch or any other library.
        const response = await fetch("/api/audio", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: base64data, id: uuid() }),
        });

        if (!response.ok) {
          setIsPitchUploading(false);
          const { err } = await response.json();
          console.log(err);
        } else {
          setIsPitchUploading(false);
          const { url } = await response.json();
          setPitch(url);
        }
      }
    };
  };

  const handleParticipantsSelected = (participantList: any[]) => {
    setParticipants(participantList);
  };

  const saveLemonade = async (data: any) => {
    setIsCreating(true);
    const response = await fetch("/api/lemonades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: data,
      }),
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
          console.log("Creating failed");
        })
        .catch((err) => console.log(err));
    } else {
      setIsCreating(false);
      const { success, lemonadeId } = await response.json();
      Swal.fire({
        icon: "success",
        title: "Success!",
        allowOutsideClick: false,
        text: `Coffee Chat was created successfully!`,
      })
        .then(() => {
          if (success) {
            router.push(`/dashboard/toolbox/lemonade/${lemonadeId}`);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    document.title = "Create Coffee Chat - Turtle Boat";
  }, []);

  return (
    <div
      className={`justify-center items-center flex overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none`}
    >
      <div className="relative w-11/12 sm:w-11/12 my-0">
        <h1 className="font-Inter font-bold text-[20px] mb-4">
          Coffee Chat
        </h1>

        <div className="border-0 rounded-lg relative flex flex-col w-full sm:px-[20px]">
          <div className="relative mt-6 flex-auto">
            <label className="font-Inter font-semibold tracking-widest text-primary-black">
              PURPOSE <span className="text-secondary-red">*</span>
            </label>
            <Select
              options={purposesOptions}
              defaultValue={purposesOptions[0]}
              value={purpose}
              placeholder={`Select type of purpose`}
              isSearchable={false}
              onChange={(type: any) => {
                setPurpose(type);
              }}
              className="mt-3"
              styles={{
                control: (provided: any, state: any) => ({
                  ...provided,
                  borderRadius: "5px",
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
            {purposeError != "" && (
              <div className="p-1">
                <span className="text-secondary-red text-sm">
                  {purposeError}
                </span>
              </div>
            )}
          </div>
          <div className="relative mt-6 flex-auto">
            <label className="font-Inter font-semibold tracking-widest text-primary-black">
              Bottleneck Pillar{" "}
              <span className="font-normal tracking-normal">
                {`(select your buggest issue)`}
              </span>
            </label>
            <Select
              options={pillarOptions}
              value={pillar}
              placeholder={`Select type of pillar`}
              isClearable={true}
              isSearchable={false}
              onChange={(type: any) => {
                setPillar(type);
              }}
              className="mt-3"
              styles={{
                control: (provided: any, state: any) => ({
                  ...provided,
                  borderRadius: "5px",
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
            {purposeError != "" && (
              <div className="p-1">
                <span className="text-secondary-red text-sm">
                  {purposeError}
                </span>
              </div>
            )}
          </div>
          <div className="relative mt-6 flex-auto">
            <label className="font-Inter font-semibold tracking-widest text-primary-black">
              PARTICIPANT(S) <span className="text-secondary-red">*</span>
            </label>
          </div>
          <div className="relative mt-3">
            <UserSelect
              setData={handleParticipantsSelected}
              multiple={true}
              disabled={false}
              type={"mentee"}
              selectedList={[]}
              disabledList={disableList}
              limit={-1}
            />
            {participantError != "" && (
              <div className="p-1">
                <span className="text-secondary-red text-sm">
                  {participantError}
                </span>
              </div>
            )}
          </div>
          <div className="mt-6 flex-auto">
            <p>
            Coffee Chat is a way to interact with multiple folks who are not necessarily your assigned mentor(s), allowing up to 5 participants total. Each participant is limited to 20 responses, and the conversation is lightly scaffolded. There are 2 ways to use this tool:
            </p>

            <p className="mt-4 ml-4">
            1. <span className="ml-4"></span> Sandbox: this is a lightweight, virtual brainstorming tool to build on ideas, challenge assumptions, and explore pivots. It&#39;s not about solving everything—it&#39;s about sparking insight, shifting perspectives, and springboarding ideas in a time-bound, purposeful way.

            </p>
            <p className="mt-2 ml-4">
            2. <span className="ml-4"></span>Messy conversations: In real-world networking, no one hands you a mic and says “begin your deck.” Instead, you get 30 seconds to introduce what you&#39;re building—usually to folks distracted, skeptical, or curious in unpredictable ways. Practice how to respond, open to the unexpected, while staying grounded.
            </p>
          
            <p className="mt-8">
            Choose your option in the dropdown to let your invitees know how to best participate. Don&#39;t forget to record your soundbite!
            </p>

          </div>
          <div className="relative mt-6 flex-auto">
            <label className="font-Inter font-semibold tracking-widest text-primary-black">
              CONTEXT
            </label>
            <textarea
              rows={4}
              className="block p-3 mt-3 w-full text-[16px] text-gray-900 bg-white rounded-lg border border-gray-300 min-h-[200px] focus:outline-none focus:border-primary-blue focus:ring-primary-blue placeholder:text-[16px]"
              placeholder="Type here..."
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            ></textarea>
          </div>

          <div className="relative mt-6 flex-auto">
            <label className="font-Inter font-semibold tracking-widest text-primary-black">
              SOUND BITE
            </label>
            <LemonadePitch
              isRecordable={true}
              audioData={null}
              saveAudio={saveAudio}
              isAudioLoading={false}
            />
            {pitchUploading && (
              <div className="font-Inter text-center">Uploading pitch ...</div>
            )}
            {pitch != "" && (
              <div className="font-Inter text-center">
                Pitch was uploaded successfully.
              </div>
            )}
          </div>

          <div className="flex items-center justify-end font-Inter font-bold ">
            <button
              className="text-primary-black background-transparent px-6 py-2 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => {
                router.push(`/dashboard/toolbox/lemonade`);
              }}
              disabled={isCreating ? true : false}
            >
              Cancel
            </button>
            <button
              className="bg-primary-blue text-white active:bg-primary-blue px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              onClick={handleCreateClick}
              disabled={pitchUploading}
            >
              {isCreating ? <Spinner text={`Creating...`} /> : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
