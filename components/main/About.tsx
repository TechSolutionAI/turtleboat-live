import { useEffect } from 'react';
import Image from "next/image";

const About = () => {
    useEffect(() => {
        document.title = "About - Turtle Boat"
    }, []);

    return (
        <div className={"font-Inter text-[12px] sm:text-[16px] w-[90%] md:w-[70%] m-auto"}>
            <div>
                <h1 className={"font-Inter font-bold text-[20px] sm:text-[24px] text-[#232325] leading-tight"}>
                    Turtle Boat:  To support, and be supported, in the entrepreneurial journey.
                </h1>
                <p className={"mt-5 font-Inter text-[14px]"}>
                    In any entrepreneurial journey, resources and expertise are critical, especially in the earliest stages of understanding a problem, identifying an opportunity, and creating a sustainable solution.
                    While some people are already connected to the innovation ecosystem through their friends and family, there are disparities that mean that some don&#39;t even get entry access to these resources. 
                </p>
                <p className={"mt-5 font-Inter text-[14px]"}>
                    Turtle Boat is a platform powered by members of yCITIES&#39; <strong className={"text-tertiary-red"}><span className={"underline underline-offset-2 decoration-2"}>C</span>ircle <span className={"underline underline-offset-2 decoration-2"}>o</span>f <span className={"underline underline-offset-2 decoration-2"}>R</span>esources <span className={"underline underline-offset-2 decoration-2"}>E</span>xchange (CORE)</strong>, a diverse community full of enthusiastic subject-matter-experts, resources, and learning experiences that have long been limited to just a small group of people.  Turtle Boat facilitates a soundingboard/skills/knowledge swap where the line between professional and student, expert and newbie is blurred.  Love it, hate it, or have lived it…everyone is a subject-matter-expert in something regardless of age, education, or upbringing...and no one should ever believe they know enough to stop learning. On any given day, we may be a teacher because of the value of our lived-through experiences, and a student if we realize we haven&#39;t been in everyone&#39;s shoes before.
                </p>
                <img alt="About yCITIES" src="/static/images/introduction.png" className={"mt-10 ml-auto mr-auto w-[80%]"} />
                <p className={"my-5 text-[12px] italic font-bold"}>
                Mangroves make up one of the most productive and biologically diverse ecosystems on the planet.  Inspired by nature, yCITIES cultivates the flow between budding/seasoned entrepreneurs  and current/ future investors...where folks have different starting points, different journeys, and different stories but find value in feeding off one another&#39;s experiences, perspectives, and skills during problem identification and solution creation processes.
                </p>
                <p className={"mt-5 font-Inter text-[14px]"}>
                    Whether Turtleboat is creating access to the skills/knowledge/network that you may not have, or expanding upon the resources you already have, it is a risk-free setting to help de-risk ventures and diversify networks.  And diversity fosters innovation.
                </p>
                <p className={"mt-5 font-Inter text-[14px]"}>
                    Through the TurtleBoat platform, curriculum, scaffolded mentoring, tools, and actively engaged social network support, we are pushing the boundaries of where innovation can flourish, the perception of what ingenuity looks like, and who has a seat at the entrepreneurial table.
                </p>
            </div>
            <div className={"mt-10"}>
                <h2 className={"font-Inter font-bold text-[20px] sm:text-[24px] text-[#232325] mt-10 leading-tight"}>
                    Becoming a CORE Member
                </h2>
                <p className={"mt-5 font-Inter text-[14px]"}>
                    The tools in the Turtle Boat Toolbox are ones used in yCITIES Bootcamps and workshops.  Those tools can be used by anyone, as often as you want, even if you are not a member (just screenshot your work, as your data will not be saved).  Because of the inter-generational population we serve, CORE membership is by referral/invite or by application.  All yCITIES alum (from any cohort) will automatically be approved for membership. 
                </p>
            </div>
            <div className={"mt-10"}>
                <h2 className={"font-Inter font-bold text-[20px] sm:text-[24px] text-[#232325] mt-10 leading-tight"}>
                    Turtle Boat History and Special Thanks
                </h2>
                <p className={"mt-5 font-Inter text-[14px]"}>
                    yCITIES was founded by Vicky Wu Davis in 2008, inspired by the birth of her first child.  In 2013, Vicky suffered 2 strokes.  Concerned friend, volunteer, and subsequent Board member Chris Wolfel wanted to “clone” Vicky…and he felt the best way to do that was through software.  He hosted a brainstorming session and provided the pizza, and the concept of Turtle Boat was born.  Students and mentors may remember Turtle Boat 1.0 from years ago, as it was used for several years to support Bootcamp classes.  Although there were some occasional upgrades, eventually Turtle Boat 2.0 was retired.  Over the years, various students were still intrigued by Turtle Boat, hoping for updated versions and additional tools.  Justin Yu was one such person.  Involved in yCITIES since he was in 7th grade, Justin and Vicky brainstormed about tools that would leverage our robust network of mentors and peers for ad-hoc on-call support.  Together, they attempted to create such a tool, but it never came to fruition.
                </p>
                <p className={"mt-5 font-Inter text-[14px]"}>
                    Fast forward to the pandemic, and  it became evident that Turtle Boat needed to be resurrected because the tools on the market were falling short.  Andrew Holmes (yCITIES student when he was in 10th grade, now a Senior Product Designer) and Vicky began long brainstorming sessions and sketching designs of a Turtle Boat that could capture the essence of yCITIES in-person Bootcamps, but do so virtually so that social distance (regardless if you are one house away, one zip code away, or one ocean away) doesn&#39;t matter.  Spending long hours, Andrew created iteration upon iteration of mockups, flows, and design documents.  Justin Yu spent nights coding a functional prototype while finishing his senior year at MIT (while also working full-time at a startup).  Turtleboat 3.0  is now in beta, and will continually evolve…but without Andrew&#39;s tireless devotion, Turtle Boat 3.0  would not be possible.
                </p>
                <p className={"mt-5 font-Inter text-[14px]"}>
                    This Turtleboat of today may be very different from what it was years ago, but the heart and soul of Turtle Boat 1.0 is still at the core (pun intended).  Thanks to everyone who played a part, past and present.
                </p>
            </div>
        </div>
    );
};

export default About;