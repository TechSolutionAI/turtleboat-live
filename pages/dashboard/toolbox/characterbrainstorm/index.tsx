import DashboardLayout from "@/components/layouts/DashboardLayout";
import CharacterBrainstorm from "@/components/main/ToolBox/CharacterBrainstorm/CharacterBrainstorm";

const Index = () => {
    return (
        <DashboardLayout noVerticalPadding={true} noHeader={true}>
            <CharacterBrainstorm />
        </DashboardLayout>
    )
}

export default Index;