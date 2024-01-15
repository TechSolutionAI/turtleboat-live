import DashboardLayout from "@/components/layouts/DashboardLayout";
import TokenSettings from "@/components/main/Admintools/TokenSettings";
import { GetServerSideProps } from "next";
import { User } from "@/types/user.type";
import { getSession } from "next-auth/react";

const Index = () => {
    return (
        <DashboardLayout noHeader={true}>
            <TokenSettings />
        </DashboardLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            }
        }
    }

    const user: User = session.user ?? {};

    if (user.role != "admin") {
        return {
            redirect: {
                permanent: false,
                destination: "/dashboard/quickstart"
            }
        };
    }

    return {
        props: {
        },
    };
};

export default Index;