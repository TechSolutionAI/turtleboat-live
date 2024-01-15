import DashboardLayout from "@/components/layouts/DashboardLayout";
import UserDetail from "@/components/main/Users";

const Index = () => {
  return (
    <DashboardLayout noHeader={true}>
      <UserDetail />
    </DashboardLayout>
  );
};

export default Index;
