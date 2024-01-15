import DashboardLayout from "@/components/layouts/DashboardLayout";
import MemberDetail from "@/components/main/Admintools/Members";

const Index = () => {
    return (
        <DashboardLayout noHeader={true}>
            <MemberDetail />
        </DashboardLayout>
    )
}

export default Index;