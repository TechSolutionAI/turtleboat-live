import DashboardLayout from "@/components/layouts/DashboardLayout";
import Lemonade from "@/components/main/ToolBox/Lemonade";

const Index = () => {
  return (
    <DashboardLayout noHeader={true}>
      <Lemonade />
    </DashboardLayout>
  );
};

export default Index;
