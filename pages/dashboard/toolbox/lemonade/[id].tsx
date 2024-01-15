import DashboardLayout from "@/components/layouts/DashboardLayout";
import LemonadeDetail from "@/components/main/ToolBox/Lemonade/Detail";

const Index = () => (
    <DashboardLayout noHeader={true}>
        <LemonadeDetail />
    </DashboardLayout>
)

export default Index;