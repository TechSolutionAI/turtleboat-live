import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Spinner from "@/components/Spinner";
import OutsideClickHandler from "react-outside-click-handler";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ErrorIcon from "@mui/icons-material/Error";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import CircleOfResourcesTable from "./CircleOfResourcesTable";
import { Venture } from "@/types/venture.type";
import { CircleOfResource } from "@/types/circleofresource.type";

const initialData = [
  {
    circleDistance: 2,
    pointOfContact: "Mrs. Williams",
    typeOfAsset: "Hard Skill",
    descriptionOfAsset: "Historical literature",
    notes:
      "Mrs. Williams is also a really talented piano player and loves to watch soccer and baseball in addition to being a history teacher.",
    remove: 1,
  },
  {
    circleDistance: 1,
    pointOfContact: "Mom",
    typeOfAsset: "Hard Skill",
    descriptionOfAsset: "Coding",
    notes: "She knows Python and Java",
    remove: 1,
  },
  {
    circleDistance: 5,
    pointOfContact: "Gary Vee",
    typeOfAsset: "Hard Skill",
    descriptionOfAsset: "Online Business and solopreneurship",
    notes:
      "I don’t know him but I see his stuff online and he seems cool and maybe he’d respond to me",
    remove: 1,
  },
];

const CircleOfResourceGenerator = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Circle distance",
        accessor: "circleDistance",
        isCenter: false,
        disableSortBy: true,
      },
      {
        Header: "Point of contact",
        accessor: "pointOfContact",
        isCenter: false,
        disableSortBy: true,
      },
      {
        Header: "type of asset",
        accessor: "typeOfAsset",
        isCenter: false,
        disableSortBy: true,
      },
      {
        Header: "description of asset",
        accessor: "descriptionOfAsset",
        isCenter: true,
        disableSortBy: true,
      },
      {
        Header: "Notes",
        accessor: "notes",
        isCenter: true,
        disableSortBy: true,
      },
      {
        Header: "",
        accessor: "remove",
        isCenter: true,
        disableSortBy: true,
      },
    ],
    []
  );

  const CIRCLE_OF_RESOURCE_STYLES = [
    {
      width: "30%",
      right: "50%",
      top: "50%",
      height: "30%",
      borderColor: "#C63832",
    },
    {
      width: "45%",
      right: "27.5%",
      top: "50%",
      height: "45%",
      borderColor: "#E59C59",
    },
    {
      width: "56%",
      right: "22%",
      top: "50%",
      height: "56%",
      borderColor: "#EBCA62",
    },
    {
      width: "67%",
      right: "16.5%",
      top: "50%",
      height: "67%",
      borderColor: "#87CC9B",
    },
    {
      width: "78%",
      right: "11%",
      top: "50%",
      height: "78%",
      borderColor: "#76C9EE",
    },
    {
      width: "89%",
      right: "5.5%",
      top: "50%",
      height: "89%",
      borderColor: "#9058D8",
    },
  ];

  const CIRCLE_OF_RESOURCES = [
    { name: "You", color: "#C63832" },
    { name: "Best friends and family", color: "#E59C59" },
    { name: "Teachers and colleagues", color: "#EBCA62" },
    { name: "Network/Affiliation", color: "#87CC9B" },
    { name: "Friends of friends", color: "#76C9EE" },
    { name: "Strangers", color: "#9058D8" },
  ];

  const { data: session } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const { id } = router.query;
  let ventureId = "";
  if (typeof id === "string" && id !== "") {
    localStorage.setItem("selectedVentureId", id.toString());
    ventureId = id.toString();
  }

  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [ventureList, setVentureList] = useState<any[]>([]);
  const [saveDropdownOpen, setSaveDropdownOpen] = useState<boolean>(false);
  const [selectedVentureIndex, setSelectedVentureIndex] = useState<number>(-1);
  const [cirleOfResourcesTableData, setCirleOfResourcesTableData] =
    useState<any[]>(initialData);
  const [circleOfDistances, setCircleOfDistances] = useState<number[]>([]);

  const getCircleOfDistances = (data: any[]) => {
    let counts: number[] = [];
    for (var i = 1; i < CIRCLE_OF_RESOURCES.length; i++) {
      let value = 0;
      data.map((item) => {
        if (i == item.circleDistance) value++;
      });
      counts.push(value);
    }
    setCircleOfDistances(counts);
  };

  const setTableData = (data: any[]) => {
    setCirleOfResourcesTableData(data);
    getCircleOfDistances(data);
  };

  const saveCircleOfResource = async (index: number) => {
    Swal.fire({
      title: "Alert",
      text: `In order to save, you need to sign in first.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sign In",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        router.push("/auth/signin");
      }
    });
  };

  useEffect(() => {
    document.title =
      "Guest ToolBox - Circle of Resource Generation - Turtle Boat";
    setIsEditable(true);
    getCircleOfDistances(initialData);
  }, []);

  const circleOfResources: any[] = [];
  const legends: any[] = [];

  CIRCLE_OF_RESOURCES.forEach((item, index) => {
    circleOfResources.push(
      <div key={`circleofresources_${index}`}>
        <div
          className={`absolute border-4 rounded-full top-[50%] left-[50%] transform  translate-x-[-50%] translate-y-[-50%]`}
          style={{
            ...CIRCLE_OF_RESOURCE_STYLES[index],
          }}
        ></div>
        <button
          style={{
            background: item.color,
            top:
              index === 0 || index % 2 == 1
                ? CIRCLE_OF_RESOURCE_STYLES[index].top
                : "43%",
            right: CIRCLE_OF_RESOURCE_STYLES[index].right,
          }}
          className={`z-1 absolute flex justify-center items-center transform translate-x-[50%] translate-y-[-50%] p-[1%] ${
            CIRCLE_OF_RESOURCE_STYLES[index].width === "30%" ? "w-[15%]" : ""
          } text-[100%] rounded-lg text-white flex justify-around`}
        >
          <PersonIcon className="" fontSize="small" />
          <span className="leading-3">
            {CIRCLE_OF_RESOURCE_STYLES[index].width === "30%"
              ? "You"
              : circleOfDistances[index - 1]}
          </span>
        </button>
      </div>
    );

    legends.push(
      <div key={`legends_${index}`} className="px-2 py-3 flex items-center">
        <button
          style={{ backgroundColor: item.color }}
          className="rounded-full w-[30px] h-[30px] text-white mr-3"
        >
          {index + 1}
        </button>
        <span className="font-Inter font-medium">{item.name}</span>
      </div>
    );
  });

  return (
    <>
      {isLoading ? (
        <div className="grid place-items-center h-screen">
          <Spinner text={"Loading..."} />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center sticky top-0 bg-white z-10 pt-2 pb-4">
            <div className="cursor-pointer flex items-center text-[20px] font-Inter font-bold lg:flex p-2">
              <h1 className="font-Inter font-bold mr-1">
                Circle of Resources Mapping
              </h1>
            </div>
            <div className="md:flex grid grid-cols-1 gap-y-2 relative">
              {isEditable &&
                (ventureId != "" ? (
                  <button
                    className="flex items-center justify-center ml-[15px] bg-tertiary-red text-white active:bg-tertiary-red px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 font-Inter truncate"
                    type="button"
                    onClick={() => saveCircleOfResource(-1)}
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
                        saveCircleOfResource(-1);
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
                    className={`absolute right-0 z-0 top-10 mt-[10px] border-2 border-secondary-gray w-[200px] rounded-[8px] bg-white`}
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
                              saveCircleOfResource(index);
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-5 px-2">
            <div className="w-full px-15">
              <div className="max-w-[577px] shadow shadow-gray-300 w-full aspect-square rounded-full relative m-auto">
                {...circleOfResources}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="bg-tertiary-blue flex flex-col justify-center items-center p-4 rounded-lg">
                <ErrorIcon
                  className="m-auto text-primary-blue"
                  fontSize="small"
                />
                <div className="text-primary-blue font-Inter mt-2">
                  The more you can leverage your Circle of Resources to create,
                  test, and get proof points, the higher you valuation will be
                  without diluting your ownership
                </div>
              </div>
              <div className="mt-10 py-3 px-10 rounded-lg shadow shadow-gray-300">
                <div className="my-2">
                  <span className="text-lg font-bold font-Inter">Legend</span>
                  {/* <span className="ml-2">{"(Click to learn more)"}</span> */}
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 font-Inter">
                  {legends}
                </div>
              </div>
            </div>
          </div>

          <CircleOfResourcesTable
            columns={columns}
            tableData={cirleOfResourcesTableData}
            setTableData={setTableData}
            circleOfResources={CIRCLE_OF_RESOURCES}
            isEditable={isEditable}
          />
        </>
      )}
    </>
  );
};
export default CircleOfResourceGenerator;
