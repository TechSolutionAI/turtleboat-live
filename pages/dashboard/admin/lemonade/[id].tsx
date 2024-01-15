import DashboardLayout from "@/components/layouts/DashboardLayout";
import LemonadeDetailAdmin from "@/components/main/Admintools/Lemonade/Detail";

const Index = () => (
    <DashboardLayout noHeader={true}>
        <LemonadeDetailAdmin />
    </DashboardLayout>
)

export default Index;