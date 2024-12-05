import DashboardLayout from "@/components/layouts/DashboardLayout";
import TokenSettings from "@/components/main/Admintools/TokenSettings";
import { GetServerSideProps } from "next";
import { User } from "@/types/user.type";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const Index = () => {
    return (
        <DashboardLayout noHeader={true}>
            <TokenSettings />
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