import { useMemo, useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import UserTable from "@/components/UserTable";
import Swal from "sweetalert2";
import { GetServerSideProps } from "next";
import { User } from "@/types/user.type";
import { getSession } from "next-auth/react";
import Spinner from "@/components/Spinner";

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
      console.log(err);
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
        isCenter: false,
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
        Header: "Tokens Earned to Date",
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
        Header: "Profile Status",
        accessor: "status",
        isCenter: true,
        disableSortBy: true,
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
      console.log(err);
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
      console.log(err);
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
          handleDeleted={handleDeleted}
        />
      )}
    </DashboardLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const user: User = session.user ?? {};

  if (user.role != "admin") {
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
