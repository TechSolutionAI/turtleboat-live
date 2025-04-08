import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Spinner from "@/components/Spinner";
import { User } from "@/types/user.type";
import CorIcon from "/public/static/images/toolbox/circleofresource_icon.png";
import { formatDate } from "@/utils/utils";
import Link from "next/link";
import CircleOfResourceModal from "@/components/CircleOfResourceModal";
import { CircleOfResource } from "@/types/circleofresource.type";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import UserAvatar1 from "@/components/UserAvatar1";

const UserDetail = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as User;

  const { id } = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User>(user);
  const [userInfo, setUserInfo] = useState<User>();
  const [name, setName] = useState<string>("");
  const [isOpenCircleOfResourceModal, setIsOpenCircleOfResourceModal] =
    useState<boolean>(false);
  const [circleOfResource, setCircleOfResource] = useState<CircleOfResource>({
    circleDistance: 1,
    pointOfContact: "",
    typeOfAsset: "",
    descriptionOfAsset: "",
    notes: "",
  });
  const [ventures, setVentures] = useState<any[]>([]);
  const [ventureId, setVentureId] = useState<string>("");
  const [follow, setFollow] = useState<boolean>(false);

  const getVentures = async () => {
    const response = await fetch(`/api/users/${currentUser._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const { ventures, userVentures } = await response.json();
      let savingOptions: any[] = [];
      userVentures.map((userVentureItem: any) => {
        ventures.map((ventureItem: any) => {
          if (
            ventureItem._id == userVentureItem.ventureId &&
            userVentureItem.role == "mentee"
          ) {
            savingOptions.push({
              label: ventureItem.title,
              value: ventureItem._id,
            });
          }
        });
      });

      setVentures(savingOptions);
    }
  };

  const handleBackClicked = () => {
    router.back();
  };

  const getUserInfo = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/users/${id}`, {
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
      const { user } = await response.json();
      setIsLoading(false);
      setUserInfo(user);
      setName(
        user?.isNewUser
          ? user?.name
          : user?.basicProfile?.firstName + " " + user?.basicProfile?.lastName
      );
      // if (currentUser?.followers?.includes(user._id)) {
      //   setFollow(true);
      // } else {
      //   setFollow(false);
      // }
    }
  };

  useEffect(() => {
    document.title = "Turtleboat User";
    getUserInfo();
    getVentures();
  }, []);

  const chooseVenture = (ventureId: string) => {
    setVentureId(ventureId);
  };

  const onAdd = () => {
    setCircleOfResource({
      circleDistance: 1,
      pointOfContact: name,
      typeOfAsset: "Hard Skill",
      descriptionOfAsset: "",
      notes: "",
    });
    setIsOpenCircleOfResourceModal(true);
  };

  const handleAddNew = async () => {
    setIsSaving(true);
    const response = await fetch("/api/circleofresource", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vid: ventureId,
        data: circleOfResource,
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
        .then(() => {
          setIsSaving(false);
        })
        .catch((err) => console.log(err));
    } else {
      setIsSaving(false);
      setIsOpenCircleOfResourceModal(false);

      Swal.fire({
        icon: "success",
        title: "Success!",
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        html: `<div><p>Circle of Resources were saved successfully!</p><p>Do you want to see that from the Venture?</p></div>`,
      })
        .then((result) => {
          if (result.isConfirmed) {
            router.push(`/dashboard/toolbox/circleofresource/${ventureId}`);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  // const handleFollow = () => {
  //   let followers: any[] = currentUser?.followers ?? [];

  //   if (followers.includes(userInfo?._id?.toString())) {
  //     followers = followers.filter(
  //       (followerId) => followerId !== userInfo?._id?.toString()
  //     );
  //   } else {
  //     followers.push(userInfo?._id?.toString());
  //   }
  //   updateUser({ followers: followers });
  // };

  const updateUser = async (data: any) => {
    const response = await fetch(`/api/users/${currentUser._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: data,
      }),
    });

    if (response.ok) {
      const { user } = await response.json();

      setCurrentUser(user);
      if (user?.followers?.includes(userInfo?._id as string)) {
        setFollow(true);
      } else {
        setFollow(false);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="grid place-items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <>
          <CircleOfResourceModal
            isNew={true}
            showModal={isOpenCircleOfResourceModal}
            closeFunc={() => {
              setIsOpenCircleOfResourceModal(false);
            }}
            data={circleOfResource}
            ventures={ventures}
            isSaving={isSaving}
            setData={setCircleOfResource}
            addCircleOfResource={handleAddNew}
            chooseVenture={chooseVenture}
          />
          <div className="flex flex-row w-full bg-white fixed items-center p-[20px] z-20">
            <a
              onClick={handleBackClicked}
              className="cursor-pointer flex items-center text-[20px] font-Inter font-bold lg:flex"
            >
              <span className="flex">
                <KeyboardBackspaceIcon />
              </span>
              <h1 className="ml-[15px]">Back</h1>
            </a>
          </div>
          {userInfo != null && (
            <div className="mt-[60px] py-[34px] flex flex-col font-Inter">
              <div className="mx-auto">
                <UserAvatar1 
                  user={userInfo}
                  size={100}
                  classes="rounded-full cursor-pointer mx-auto"
                />
                <h2 className="mt-4 text-[25px] font-bold text-center">
                  {name}
                </h2>
                {userInfo.createdAt && (
                  <p className="mt-4">
                    CORE Member Since {`${formatDate(userInfo.createdAt)}`}
                  </p>
                )}
                {userInfo.basicProfile?.linkedinProfile &&
                  userInfo.basicProfile?.linkedinProfile !== "" && (
                    <Link
                      href={userInfo.basicProfile.linkedinProfile}
                      target="_blank"
                    >
                      <Image
                        src={"/static/images/linkedin-icon-black.png"}
                        alt="LinkedIn"
                        width={50}
                        height={50}
                        className="mx-auto mt-4"
                      />
                    </Link>
                  )}
                <div className="mt-4 flex flex-col">
                  <p className="mx-auto">
                    Tokens Earned: {userInfo.totalEarnedTokens}
                  </p>
                </div>
                <div
                  onClick={onAdd}
                  className="cursor-pointer w-[200px] shadow-md hover:shadow-lg rounded-lg flex flex-col items-center justify-center px-4 py-4 mt-4 mx-auto"
                >
                  <p className="font-Inter font-bold text-black text-lg text-center">
                    Add To Your Circle of Resources
                  </p>
                  <Image alt="Circle of Resources" src={CorIcon} />
                </div>
                {/* {currentUser._id != userInfo._id && (
                  <div
                    onClick={handleFollow}
                    className="cursor-pointer w-[200px] rounded-full bg-red-600  px-4 py-1 mt-4 mx-auto font-Inter font-semibold text-white text-center"
                  >
                    {follow ? "Unfollow" : "Follow"}
                  </div>
                )} */}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default UserDetail;
