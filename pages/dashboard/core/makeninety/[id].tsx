import DashboardLayout from "@/components/layouts/DashboardLayout";
import Details from "@/components/main/Core/MakeNinety/Details";

const Index = () => {
    return (
        <DashboardLayout noHeader={true}>
            <Details />
        </DashboardLayout>
    )
}

export default Index;