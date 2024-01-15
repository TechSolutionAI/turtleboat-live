import DashboardLayout from "@/components/layouts/DashboardLayout";
import NanoTalkDetails from "@/components/main/Core/MakeNinety/NanoTalkDetails";

const Index = () => {
    return (
        <DashboardLayout noHeader={true}>
            <NanoTalkDetails />
        </DashboardLayout>
    )
}

export default Index;