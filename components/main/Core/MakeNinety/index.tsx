import Videos from "./Videos"
import React, { useEffect } from "react";

const Index = () => {

    useEffect(() => {
        document.title = "Core Videos - Turtle Boat";
    }, [])
    return (
        <div>
            <div className="pb-[32px]">
                <h1 className="font-Inter font-bold text-[24px] text-[#232325]">
                    <span className={"underline underline-offset-2 decoration-3"}>C</span>ircle <span className={"underline underline-offset-2 decoration-3"}>o</span>f <span className={"underline underline-offset-2 decoration-3"}>R</span>esources <span className={"underline underline-offset-2 decoration-3"}>E</span>xchange
                </h1>
                <p className={"mt-5 font-Inter text-[14px]"}>
                    Central to the yCITIES ecosystem, Circle of Resources is a term coined by yCITIES to describe the accessibility of people/places/things that can help you during your entrepreneurial journey, espeically in the earliest stages. CORE brings access to the skills/knowledge/netowrk that you may not have, or expands upon the resources you already have. Think of this space as an asynchronous skill & knowledge swap... a variety of give-and-take so that despite our individually crazy schedules, we can come together to teach, to learn, to laugh together, and be there for each other.
                </p>
            </div>
            <Videos />
        </div>
    )
}

export default Index;