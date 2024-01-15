import React from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Add from '@/components/main/Core/MakeNinety/Add';

const Index = () => {
    return (
        <DashboardLayout noHeader={true}>
            <Add />
        </DashboardLayout>
    )
}

export default Index;