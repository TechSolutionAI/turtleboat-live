import NotificationTabs from '@/components/main/NotificationTabs';
import LemonadesComponent from '@/components/LemonadesComponent';

const Lemonades = () => {
    return (
        <>
            <NotificationTabs selectedTab={2} />
            <LemonadesComponent />
        </>
    );
};

export default Lemonades;