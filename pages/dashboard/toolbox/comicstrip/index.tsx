import DashboardLayout from "@/components/layouts/DashboardLayout";
import ComicStripGenerator from "@/components/main/ToolBox/ComicStrip/ComicStripGenerator";

const Index = () => {
    return (
        <DashboardLayout noVerticalPadding={true} noHeader={true}>
            <ComicStripGenerator />
        </DashboardLayout>
    )
}

export default Index;