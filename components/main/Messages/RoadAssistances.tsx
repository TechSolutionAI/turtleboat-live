import NotificationTabs from '@/components/main/NotificationTabs';
import RoadAssistancesComponent from '@/components/RoadAssistancesComponent';

const RoadAssistances = () => {
    return (
        <>
            <NotificationTabs selectedTab={1} />
            <RoadAssistancesComponent />
        </>
    );
};

export default RoadAssistances;