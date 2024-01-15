import DashboardLayout from "@/components/layouts/DashboardLayout";
import Gameboard from "@/components/main/MyVentures/GameBoard/Gameboard";

const Index = () => {
    return (
        <DashboardLayout noHeader={true}>
            <Gameboard  />
        </DashboardLayout>
    )
}

export default Index;