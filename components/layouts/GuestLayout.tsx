import { ReactNode, useEffect, useState } from "react";
import LeftSidebarForNonMembers from "../LeftSidebarForNonMembers";

const GuestLayout = ({ noSelNav, children, noVerticalPadding }: { noSelNav?: boolean, children: ReactNode, noVerticalPadding?: boolean }) => {
    useEffect(() => {
        document.title = "Turtle Boat";
    }, []);
    return (
        <>
            <LeftSidebarForNonMembers noSelNav={noSelNav} />
            <main className={`sm:ml-28 md:px-12 sm:px-6 px-4 ${noVerticalPadding ? 'pt-[40px]' : 'py-[40px]'}`}>{children}</main>
        </>
    );
};

export default GuestLayout;
