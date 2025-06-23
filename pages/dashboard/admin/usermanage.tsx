import { useMemo, useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import UserTable from "@/components/UserTable";
import Swal from "sweetalert2";
import { GetServerSideProps } from "next";
import { User } from "@/types/user.type";
import { Session, getServerSession } from "next-auth";
import Spinner from "@/components/Spinner";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const UserManage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  const getData = async () => {
    setIsLoading(true);
    let userList: any[] = [];
    const response = await fetch("/api/users", {
      method: "GET",
    });

    if (!response.ok) {
      setIsLoading(false);
      const { err } = await response.json();
    } else {
      const { users } = await response.json();
      userList = users.map((user: any, index: number) => {
        let userItem = {
          no: index + 1,
          name: user.isNewUser
            ? user.name
            : user?.basicProfile?.firstName +
            " " +
            user?.basicProfile?.lastName,
          linkedinUrl: user.isNewUser
            ? ""
            : user?.basicProfile?.linkedinProfile,
          email: user.isNewUser ? user.email : user?.basicProfile?.emailAddress,
          admin: user.role == "admin" ? true : false,
          status: !user.isNewUser,
          image: user.image,
          action: user._id,
          professions: user.isNewUser
            ? []
            : user?.advancedProfile?.professional,
          hobbies: user.isNewUser ? [] : user?.advancedProfile?.hobbiles,
          industries: user.isNewUser
            ? []
            : user?.advancedProfile?.familiarIndustry,
          totalTokens: user.totalEarnedTokens,
          dailyDigestEnabled: user.dailyDigestEnabled,
          isPaid: user.isPaid ?? false,
          paidNote: user.paidNote ?? "",
          lastLogin: user.lastLogin ?? "",
          isAccessCore: user.isAccessCore ?? false,
        };
        return userItem;
      });
    }
    setUsers(userList);
    setFilteredUsers(userList);

    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "No",
        accessor: "no",
        isCenter: true,
      },
      {
        Header: "Image",
        accessor: "image",
        isCenter: true,
        disableSortBy: true,
      },
      {
        Header: "Name",
        accessor: "name",
        isCenter: false,
      },
      {
        Header: "Email",
        accessor: "email",
        isCenter: false,
      },
      {
        Header: "Profession",
        accessor: "professions",
        isCenter: false,
      },
      {
        Header: "Industries",
        accessor: "industries",
        isCenter: false,
      },
      {
        Header: "Hobbies",
        accessor: "hobbies",
        isCenter: false,
      },
      {
        Header: "Tokens Earned",
        accessor: "totalTokens",
        isCenter: true,
      },
      {
        Header: "Admin",
        accessor: "admin",
        isCenter: true,
        disableSortBy: true,
      },
      {
        Header: "Daily Digest",
        accessor: "dailyDigestEnabled",
        isCenter: true,
        disableSortBy: true,
      },
      {
        Header: "Paid",
        accessor: "isPaid",
        isCenter: true,
        disableSortBy: false,
      },
      {
        Header: "Note",
        accessor: "paidNote",
        isCenter: true,
        disableSortBy: true,
      },
      {
        Header: "Access to CORE",
        accessor: "isAccessCore",
        isCenter: true,
        disableSortBy: false,
      },
      {
        Header: "Profile Status",
        accessor: "status",
        isCenter: true,
        disableSortBy: false,
      },
      {
        Header: "Last Activity",
        accessor: "lastLogin",
        isCenter: true,
        disableSortBy: false,
      },
      {
        Header: "Action",
        accessor: "action",
        isCenter: true,
        disableSortBy: true,
      },
    ],
    []
  );

  const updateUser = async (data: any) => {
    const response = await fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: data.id,
        data: data.data,
      }),
    });

    if (!response.ok) {
      const { err } = await response.json();
      return { success: false, err: err };
    } else {
      getData();
      return { success: true };
    }
  };

  const deleteUser = async (data: any) => {
    const response = await fetch(`/api/users/${data.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const { err } = await response.json();
      return { success: false, err: err };
    } else {
      getData();
      return { success: true };
    }
  };

  const handleRoleSwitched = (data: any) => {
    const role = data.data.role;
    Swal.fire({
      title: "Update User Role",
      text: `Are you sure you want to update this user to ${role}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update role!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const result = await updateUser(data);
        if (result.success) {
          Swal.fire(
            "User Role Updated",
            `User has been updated to ${role}`,
            "success"
          );
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: result.err,
          });
        }
      }
    });
  };

  const handleDailyDigestSwitched = (data: any) => {
    const dailyDigestEnabled = data.data.dailyDigestEnabled;
    Swal.fire({
      title: "Update User Daily Digest Setting",
      text: `Are you sure you want to toggle Daily Digest Setting?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update daily digest!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const result = await updateUser(data);
        if (result.success) {
          Swal.fire(
            "User Daily Digest Updated",
            `User has been updated to ${dailyDigestEnabled ? "On" : "Off"}`,
            "success"
          );
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: result.err,
          });
        }
      }
    });
  };


  const handlePaidSwitched = (data: any) => {
    const isPaid = data.data.isPaid;
    Swal.fire({
      title: "Update User Paid State",
      text: `Are you sure you want to make this user is ${isPaid ? "paid" : "unpaid"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update paid state!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const result = await updateUser(data);
        if (result.success) {
          Swal.fire(
            "User Paid State Updated",
            `User has been updated to ${isPaid ? "paid" : "unpaid"}`,
            "success"
          );
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: result.err,
          });
        }
      }
    });
  };

  const handleCoreAccessSwitched = (data: any) => {
    
    const isAccessCore = data.data.isAccessCore;
    Swal.fire({
      title: "Update User CORE Access",
      text: `Are you sure you want to make this user is ${isAccessCore ? "granted" : "revoked"} access to CORE?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update CORE access!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const result = await updateUser(data);
        if (result.success) {
          Swal.fire(
            "User CORE Access Updated",
            `User has been updated to ${isAccessCore ? "granted" : "revoked"} access to CORE`,
            "success"
          );
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: result.err,
          });
        }
      }
    });
  };

  const handleNoteEdited = async (data: any) => {

    const { value, isConfirmed } = await Swal.fire({
      title: "Edit Note",
      input: "textarea",
      inputLabel: "",
      inputValue: data.paidNote,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      inputAttributes: {
        "aria-label": "Type your note here"
      }
    });

    if (isConfirmed && value !== undefined) {

      const body = {
        id: data.action,
        data: {
          paidNote: value
        }
      }

      const result = await updateUser(body);
        if (result.success) {
          Swal.fire(
            "User Note Updated",
            `User has been updated.`,
            "success"
          );
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: result.err,
          });
        }
    }
 
  }




  const handleFilterUsers = (value: string) => {
    const tempUsers = users;
    const filteredList = tempUsers.filter(
      (member) => member.name.includes(value) || member.email.includes(value)
    );
    setFilteredUsers(filteredList);
  };

  const handleDeleted = (data: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: `This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const result = await deleteUser(data);
        if (result.success) {
          Swal.fire(
            "User deleted successfully!",
            `User deleted successfully!`,
            "success"
          );
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: result.err,
          });
        }
      }
    });
  };

  return (
    <DashboardLayout noHeader={true}>
      <input
        type="text"
        className="mt-[15px] border-secondary-gray border-[1px] rounded-[8px] h-[48px] placeholder:text-[16px] pl-[16px] focus:outline-none focus:border-primary-blue focus:ring-primary-blue"
        placeholder="Search members..."
        id="search"
        onChange={(e) => {
          handleFilterUsers(e.target.value);
        }}
      />

      {isLoading ? (
        <div className="grid place-items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <UserTable
          columns={columns}
          data={filteredUsers}
          handleRoleSwitched={handleRoleSwitched}
          handleDailyDigestSwitched={handleDailyDigestSwitched}
          handlePaidSwitched={handlePaidSwitched}
          handleCoreAccessSwitched={handleCoreAccessSwitched}
          handleNoteEdited={handleNoteEdited}
          handleDeleted={handleDeleted}
        />
      )}
    </DashboardLayout>
  );
};
export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session: Session | null = await getServerSession(context.req, context.res, authOptions); // Use getServerSession

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const user: User = session.user ?? {};

  if (user.role !== "admin") {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard/quickstart",
      },
    };
  }

  return {
    props: {},
  };
};

export default UserManage;
