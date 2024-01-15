import DashboardLayout from "@/components/layouts/DashboardLayout";
import Collaboration from '@/components/main/Collaboration'
const Index = () => {
    return (
        <DashboardLayout noHeader={true}>
            <Collaboration />
        </DashboardLayout>
    )
}

export default Index;