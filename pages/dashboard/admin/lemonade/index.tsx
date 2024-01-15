import DashboardLayout from "@/components/layouts/DashboardLayout";
import LemonadeAdmin from "@/components/main/Admintools/Lemonade";

const Index = () => {
    return (
        <DashboardLayout noHeader={true}>
            <LemonadeAdmin  />
        </DashboardLayout>
    )
}

export default Index;