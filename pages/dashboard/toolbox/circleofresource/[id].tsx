import DashboardLayout from "@/components/layouts/DashboardLayout";
import CircleOfResourceGenerator from "@/components/main/ToolBox/CircleOfResource/CircleOfResourceGenerator";

const Index = () => (
    <DashboardLayout noHeader={true}>
        <CircleOfResourceGenerator />
    </DashboardLayout>
)

export default Index;