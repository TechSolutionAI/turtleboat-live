import DashboardLayout from "@/components/layouts/DashboardLayout";
import TokenEdit from "@/components/main/Admintools/TokenSettings/TokenEdit";
import { GetServerSideProps } from "next";
import { User } from "@/types/user.type";
import { getSession } from "next-auth/react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession, Session } from "next-auth";

const Index = () => {
    return (
        <DashboardLayout noHeader={true}>
            <TokenEdit />
        </DashboardLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const session: Session | null = await getServerSession(
        context.req,
        context.res,
        authOptions
    ); // Use getServerSession

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

export default Index;