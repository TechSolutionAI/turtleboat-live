import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import Image from "next/image";
import { useEffect } from "react";

const QuickStart = () => {
  useEffect(() => {
    document.title = "Features Overview - Turtle Boat";
  }, []);

  return (
    <div
      className={
        "font-Inter text-[12px] sm:text-[16px] w-[90%] md:w-[70%] m-auto"
      }
    >
      <div>
        <h1
          className={
            "font-Inter font-bold text-[30px] text-[#232325] leading-tight"
          }
        >
          Features Overview
        </h1>
        <p className={"mt-5 font-Inter text-[14px]"}>
          Turtle Boat is a platform that supports the earliest stages of
          innovation and entrepreneurship (pre-idea to pre-recurring revenue
          stage), and its *CORE Community...
        </p>
        <p className={"mt-5 font-Inter text-[14px]"}>
          <strong className={"text-black"}>
            *CORE(
            <span className={"underline underline-offset-2 decoration-2"}>
              C
            </span>
            ircle{" "}
            <span className={"underline underline-offset-2 decoration-2"}>
              o
            </span>
            f{" "}
            <span className={"underline underline-offset-2 decoration-2"}>
              R
            </span>
            esources{" "}
            <span className={"underline underline-offset-2 decoration-2"}>
              E
            </span>
            xchange)
          </strong>
        </p>
        <p className={"mt-0 ml:[20px] sm:ml-[70px]"}>
          Circle of Resources (coined by yCITIES)
        </p>
        <p className={"mt-2 ml:[20px] sm:ml-[70px] italic"}>noun</p>
        <p className={"my-0 ml:[20px] sm:ml-[70px] italic text-tertiary-red"}>
          the accessibility of people, places, and things one has in their
          entrepreneurial journey when viewed through a creative connections
          lens. These connections are multiplied via CORE
        </p>
        <p className={"mt-5 font-Inter text-[14px]"}>
          Asynchronously leverage a community full of enthusiastic
          subject-matter-experts, resources, and learning experiences. CORE
          provides a welcoming entry point for resources that have long been
          limited to a small group of people. By providing folks to test ideas
          with, facilitating learning experiences that foster entrepreneurial
          mindsets, and connecting a seemingly disparate set of connections,
          CORE provides a unique exchange of resources in all aspects of an
          entrepreneurial journey that stretches beyond a program. And just like
          in real life, the more you are present and engaged, the more peers
          will meet, trust, and work with you.
        </p>
        <p className={"mt-5 font-Inter text-[14px]"}>
          Turtle Boat provides every CORE Member their own Wonder Innovation
          Journal and Thinkspace, accessed through a dashboard. Members can vet
          out ideas, track progress, and participate in asynchronous
          give-and-take support.
          <strong className={"text-black"}>
            {" "}
            Below is a high-level introduction to Turtle Boat.
          </strong>
        </p>
        <p className={"mt-5 font-Inter text-[14px]"}>
          Every time a CORE member posts a comment, uploads a video, responds to
          an Entrepreneurial Roadside Assistance, or engages in some way within
          Turtleboat, a clickable profile picture is visible. From their profile
          page, you can directly add them to your Circle of Resources to curate
          a list of contacts whose knowledge, experience, or other assets are
          relevant to your specific project (or folks you&#39;re interested in
          following, even if you&#39;re not actively working on a venture).
        </p>
        <div className="flex lg:mt-0 mt-10">
          <Image
            width={100}
            height={100}
            alt="Member Page"
            src="/static/images/quickstart/member.png"
            className="w-1/3 object-contain"
          />
          <Image
            width={100}
            height={100}
            alt="Circle of Resource"
            src="/static/images/quickstart/circleofresource.png"
            className="w-2/3 object-contain"
          />
        </div>
      </div>
      <div className={"mt-10 grid grid-cols-1 lg:grid-cols-4 gap-x-4"}>
        <div className={"lg:col-span-3"}>
          <h2
            className={
              "font-Inter font-bold text-[24px] text-[#232325] leading-tight"
            }
          >
            My Ventures Tab
          </h2>
          <p className={"mt-1 font-Inter text-[14px]"}>
            As stated above, every CORE Member will be given their own Wonder
            Innovation Journal and a thinkspace accessed via a dashboard. CORE
            Members who participate in various yCITIES bootcamps and workshops
            will have multiple ventures to keep the work separate. Mentees will
            have a dedicated Thinkspace and Dashboard just like their Personal
            Innovation Journal, except these will have Mentors assigned. Mentors
            assigned to specific Ventures will have a view-and-comment-only
            access to the MENTEE Dashboard and Thinkspace.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <img
            alt="My Ventures"
            src="/static/images/quickstart/myventures.png"
            className="lg:mt-0 mt-10"
          />
        </div>
      </div>
      <div className={"mt-10"}>
        <h2
          className={
            "font-Inter font-bold text-[24px] text-[#232325] leading-tight"
          }
        >
          Dashboard to Access Tools and Thinkspace
        </h2>
        <p className={"mt-1 font-Inter text-[14px]"}>
          Since an entrepreneur&#39;s journey is a complex, often non-linear,
          process of non-stop data gathering and constant iteration, the
          Dashboard serves as a home base, where critical information can be
          scanned or accessed easily to re-visit often. So what&#39;s on the
          Dashboard?
        </p>
        <div
          className={
            "mt-10 ml:[20px] sm:ml-[70px] grid grid-cols-1 lg:grid-cols-4 gap-x-4"
          }
        >
          <div className={"lg:col-span-3"}>
            <h3
              className={
                "font-Inter font-bold text-[20px] text-[#232325] leading-tight"
              }
            >
              Thinkspace
            </h3>
            <p className={"mt-1 font-Inter text-[14px]"}>
              Discover, define, and refine foundational pillars to build your entrepreneurial story.  A nonlinear framework (with prompts provided by yCITIES or partner programming) supports progress of the discovery journey no matter where and how you began your journey.  Click on any (unlocked) puzzle piece for prompts or advice for figuring out your unknowns.  Jot down summary findings you enter into each pillar piece.  When you&#39;re ready, these soundbites get pulled into your Story Train tool for you to refine.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <img
              alt="Venture Dashboard"
              src="/static/images/quickstart/puzzle_panel.png"
              className="lg:mt-0 mt-10"
            />
          </div>
        </div>
        <div
          className={
            "mt-10 ml:[20px] sm:ml-[70px] grid grid-cols-1 lg:grid-cols-4 gap-x-4"
          }
        >
          <div className={"lg:col-span-2"}>
            <h3
              className={
                "font-Inter font-bold text-[20px] text-[#232325] leading-tight"
              }
            >
              Baby Steps Checklist
            </h3>
            <p className={"mt-1 font-Inter text-[14px]"}>
              Within each clickable Wonder Square (if it&#39;s unlocked), there
              is a pop-up checklist in the upper right hand corner that you
              (and/or a mentor if it&#39;s a Bootcamp) can use as a tool to get
              things done. Each baby step counts! “Clean the house” may be too
              daunting of a task, but “put books back on shelves in the
              playroom” and “wipe the kitchen counter” are tiny tasks that add
              up…and feel so good to cross off the to-do list!
            </p>
            <h3
              className={
                "mt-10 font-Inter font-bold text-[20px] text-[#232325] leading-tight"
              }
            >
              Proof of Opportunity
            </h3>
            <p className={"mt-1 font-Inter text-[14px]"}>
              Startups are inherently risky, but entrepreneurs need to gather
              proof points throughout the journey to mitigate risk, which is
              especially critical when ventures are pre-revenue. Whether
              self-checked or through mentors, the Baby Steps checklists within
              each Wonder Square are tied to the risk meters, to show where more
              iteration (talking, testing,and tweaking) is needed.
            </p>
          </div>
          <div className="flex items-center justify-center lg:col-span-2">
            <img
              alt="Checklist"
              src="/static/images/quickstart/checklist.png"
              className="lg:mt-0 mt-10 "
            />
          </div>
        </div>
        <div
          className={
            "ml:[20px] sm:ml-[70px] grid grid-cols-1 lg:grid-cols-2 gap-x-4"
          }
        >
          <div>
            <img
              alt="Proof Opportunity"
              src="/static/images/quickstart/proof.png"
              className="lg:mt-0 mt-10"
            />
          </div>
          <div className="flex items-start justify-center mt-10">
            <img
              alt="Risk Meter"
              src="/static/images/quickstart/riskmeter.png"
              className="lg:mt-0 mt-10"
            />
          </div>
        </div>
      </div>
      <div className={"mt-10 grid grid-cols-1 gap-x-4"}>
        <div>
          <h2
            className={
              "font-Inter font-bold text-[24px] text-[#232325] leading-tight"
            }
          >
            ERA (Entrepreneurial Roadside Assistance)
          </h2>
          <img
            alt="Roadside"
            src="/static/images/quickstart/roadside.png"
            className="lg:mt-0 mt-10 float-right"
          />
          <p className={"mt-1 font-Inter text-[14px]"}>
            Think about being on the road towards a particular destination. What
            happens if someone runs over a pothole and gets a flat tire, or the
            car battery dies en route? This isn&#39;t the time to shop for new
            tires or a new car. Whether someone stops with the tools to put a
            spare tire on, offers their car for a jump, or calls for help, the
            goal is to get the driver back on the road. ERA is the
            entrepreneurial equivalent -- short quick help to get someone
            unstuck. Scaffolded Help Request cards and Help Response options
            allow for consistency in managing expectations and efficiency in the
            communication.{" "}
            <span
              className={
                "underline underline-offset-4 decoration-2 text-tertiary-red"
              }
            >
              Content from your Dashboard (Elevator Pitch, Story Train, and your
              Comic Strips) are conveniently pulled into your ERA help ticket to
              provide proper context for your request.
            </span>{" "}
            You can find the ERA Button on almost every page of Turtle Boat.
          </p>
        </div>
      </div>
      <div className={"mt-10 grid grid-cols-1 gap-x-4"}>
        <div>
          <h2
            className={
              "font-Inter font-bold text-[24px] text-[#232325] leading-tight"
            }
          >
            Teamwork
          </h2>
          <p className={"mt-1 font-Inter text-[14px]"}>
            Mentors and Teammates have view/comment access to each other&#39;s
            Dashboard content, the Team Chat is where group planning can be
            kept: team project planning to assign tasks and ownership, meeting
            minutes for mentor check-ins and small group breakout discussions,
            and T-reports (what yCITIES uses as a pre-meeting status report that
            includes most recent Triumphs, Troubles, and Tasks accomplished).
          </p>
        </div>
        <div className="flex items-center justify-center mt-2">
          <img
            alt="Roadside"
            src="/static/images/quickstart/collaboration.png"
            className="lg:mt-0 mt-10"
          />
        </div>
      </div>
      <div className={"mt-10 grid grid-cols-1 lg:grid-cols-4 gap-x-4"}>
        <div className={"lg:col-span-3"}>
          <h2
            className={
              "font-Inter font-bold text-[24px] text-[#232325] leading-tight"
            }
          >
            Elevator Pitch Recorder
          </h2>
          <p className={"mt-1 font-Inter text-[14px]"}>
            Everyone needs a written and a verbal version of their quick
            soundbite, regardless of who the audience is. Actually saying it out
            loud is an important part of the process, and by recording it (with
            only 90 seconds available), there&#39;s the added opportunity of
            self-critiquing and hearing any “ummm&#39;s” and other filler words.
          </p>
          <p className={"mt-0 italic text-tertiary-red"}>
            Your latest recording can also be pulled from your Dashboard into
            your ERA request so potential helpers can get a quick sense of your
            venture.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <img
            alt="Elevator Pitch"
            src="/static/images/quickstart/elevator_pitch.png"
            className="lg:mt-0 mt-10"
          />
        </div>
      </div>
      <div className="mt-7">
        <h2
          className={
            "font-Inter font-bold text-[24px] text-[#232325] leading-tight"
          }
        >
          Tools
        </h2>
        <img
          alt="Tools"
          src="/static/images/quickstart/tools.png"
          className={"mt-5"}
        />
        <div className="flex items-start gap-x-2 ml:[20px] sm:ml-[70px]">
          <ArrowRightAltRoundedIcon className="mt-4" fontSize="large" />
          <h3 className={"mt-5 font-Inter text-[14px]"}>
            <strong className={"text-black"}>
              Circle of Resources (CoR) Mapping.
            </strong>
            , Resource-rich or resource-constrained is often just a state of mind.  Map out the people who have the skills, knowledge, venues, and equipment you need to create or test, and tap into the Circle of Resource Exchange (CORE) if they are a fellow member.   Has somebody in the CORE community posted compelling feedback to the community that you  think might be useful for you?  Curate your own CoR map specific to your needs of your current endeavors.&nbsp;
            <span className={"text-tertiary-red"}>
              Clicking on profile pictures of any CORE member will bring you to their profile page, where you can strategically add them to your Circle.
            </span>
          </h3>
        </div>
        <div className="flex items-start gap-x-2 ml:[20px] sm:ml-[70px]">
          <ArrowRightAltRoundedIcon className="mt-4" fontSize="large" />
          <h3 className={"mt-5 font-Inter text-[14px]"}>
            <strong className={"text-black"}>Comic Strip Generators.</strong>,
            Problems don&#39;t happen in a silo, and solutions don&#39;t just drop into someone&#39;s lap when needed. Comics are an easy way to visualize the problem or solution scenario, its setting, the characters involved on-site, and chronologically what happens before and after. The farther you are along the discovery journey, the more detailed the comic strip should be.&nbsp;
            <span className={"text-tertiary-red"}>
              Comic strips are viewable by CORE members when you request help from ERA (Entrepreneurial Roadside Assistance) to get a better sense of where you are in your 4-pillar story formation.
            </span>
          </h3>
        </div>
        {/* <div className="flex items-start gap-x-2 ml:[20px] sm:ml-[70px]">
          <ArrowRightAltRoundedIcon className="mt-4" fontSize="large" />
          <h3 className={"mt-5 font-Inter text-[14px]"}>
            <strong className={"text-black"}>
              Opportunity Identification.
            </strong>
            , Not every aspiring entrepreneur comes to the table knowing exactly
            what they want to start, and this brainstorming tool helps one
            reflect on the intersection of one&#39;s strengths, interests, and
            experiences for idea generation.
          </h3>
        </div> */}
        <div className="flex items-start gap-x-2 ml:[20px] sm:ml-[70px]">
          <ArrowRightAltRoundedIcon className="mt-4" fontSize="large" />
          <h3 className={"mt-5 font-Inter text-[14px]"}>
            <strong className={"text-black"}>Story Train Drafting.</strong>, Every successful entrepreneur needs to be a great storyteller.  However, the process of distilling your story into engaging and digestible sound bites is extremely challenging and is often tweaked a million times. This tool ensures all the critical parts of your story are captured, allowing you to tweak and rearrange without having to rewrite the whole pitch every time.&nbsp;
            <span className={"text-tertiary-red"}>
              Your most recent story train draft can be pulled into the ERA request so potential helpers can get a quick overview of the venture.
            </span>
          </h3>
        </div>
        <div className="flex items-start gap-x-2 ml:[20px] sm:ml-[70px]">
          <ArrowRightAltRoundedIcon className="mt-4" fontSize="large" />
          <h3 className={"mt-5 font-Inter text-[14px]"}>
            <strong className={"text-black"}>Elevator Pitch Recorder.</strong>, A
            Practicing an elevator pitch out loud is an important part of the refinement process, and by recording it (with only 90 seconds available), there&#39;s the added opportunity of self-critiquing and hearing any “ummm&#39;s” and other filler words.&nbsp;
            <span className={"text-tertiary-red"}>
              Your last recording can also be pulled from the Dashboard into the ERA request so potential helpers can get a quick overview of the venture.
            </span>
          </h3>
        </div>
        <div className="flex items-start gap-x-2 ml:[20px] sm:ml-[70px]">
          <ArrowRightAltRoundedIcon className="mt-4" fontSize="large" />
          <h3 className={"mt-5 font-Inter text-[14px]"}>
            <strong className={"text-black"}>Coffee Chat “Shop Talk”.</strong>, Perfecting an elevator pitch is very different from being able to hold a networking style conversation because you are talking with them, not at them.  How do you get your venture idea across without too much or too little detail, especially if they have varying levels of understanding of your venture?  How do you get back on track if you keep getting asked questions, or questions you&#39;d rather not answer at this time?  Alternatively, you can use this tool as a divergent brainstorming tool to take part in an asynchronous, scaffolded battle of entrepreneurial wits that challenges participants to creatively connect dots and poke holes in each other&#39;s logic.
            Up to 5 folks can be invited in this tool, and each participant has 20 comments available per session. &nbsp;
            <span className={"text-tertiary-red"}>
              This tool can be used as a response to an ERA.
            </span>
          </h3>
        </div>
      </div>
      <div className={"mt-10 grid grid-cols-1 lg:grid-cols-4 gap-x-4"}>
        <div className={"lg:col-span-3"}>
          <h2
            className={
              "font-Inter font-bold text-[24px] text-[#232325] leading-tight"
            }
          >
            Token Tracker - The CORE Experience Economy
          </h2>
          <p className={"mt-1 font-Inter text-[14px]"}>
            The CORE community works to bridge the gap of resources, enrichening
            not only the student, but the teacher and the community itself.
            Being virtually “present & engaged” in CORE is represented by Turtle
            Tokens. Earn Turtle Tokens through interacting: asking for help,
            helping others, increasing visibility and showcasing talents, ideas,
            and problem-solving skills. The greater the engagement, the greater
            the enrichment of the community. Earn tokens that are redeemable for
            perks related to fun and expertise that might be outside of your
            wheelhouse. Or, redeem to gift a bundle of tokens to another CORE
            member.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <img
            alt="Token Tracker"
            src="/static/images/quickstart/token_widget.png"
            className="lg:mt-0 mt-10"
          />
        </div>
      </div>
      <div className={"mt-10"}>
        <h2
          className={
            "font-Inter font-bold text-[24px] text-[#232325] leading-tight"
          }
        >
          CORE Tab
        </h2>
        <p className={"mt-1 font-Inter text-[14px]"}>
          This tab features space for the CORE Community to Teach, Learn, and
          Laugh Together (Asynchronously).
        </p>
        <div
          className={
            "mt-10 ml:[20px] sm:ml-[70px] grid grid-cols-1 lg:grid-cols-4 gap-x-4"
          }
        >
          <div className={"lg:col-span-3"}>
            <h3
              className={
                "font-Inter font-bold text-[20px] text-[#232325] leading-tight"
              }
            >
              Can You Make A Kid Care in 90 Seconds
            </h3>
            <p className={"mt-1 font-Inter text-[14px]"}>
              Whether preparing for a pitch meeting, a discovery interview, or
              just testing the validity of an idea, this exercise can improve
              public speaking and storytelling skills. The Challenge: can you
              make a kid (or anyone regardless of level of education or
              familiarity with your experience) in 90 seconds.
            </p>
            <p className={"mt-1 font-Inter text-[14px]"}>
              CORE Members may upload a video up to 90 seconds for feedback.
              Instead of generic advice or thumbs up/down, peers write what they
              personally interpret from what they hear. Through the aggregate of
              feedback, the owner of the video can decide where to tweak, if
              needed. Upload Take 2 (or Take 37) to see if others hear what
              you&#39;re trying to say.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <img
              alt="Video Comment"
              src="/static/images/quickstart/video_comment.png"
              className="lg:mt-0 mt-10"
            />
          </div>
        </div>
        <div className={"mt-10 ml:[20px] sm:ml-[70px]"}>
          <h2
            className={
              "font-Inter font-bold text-[20px] text-[#232325] leading-tight"
            }
          >
            90 Seconds Inside the Mind of an Investor
          </h2>
          <p className={"mt-1 font-Inter text-[14px]"}>
            A bite-size version of yCITIES&#39; Inside the Mind of an Investor
            series, investors of varying years of experiences and wallet size
            will share objective and subjective thoughts when it comes to
            investing in startups.
          </p>
        </div>
        <div className={"mt-10 ml:[20px] sm:ml-[70px]"}>
          <h2
            className={
              "font-Inter font-bold text-[20px] text-[#232325] leading-tight"
            }
          >
            And Then This Happened
          </h2>
          <p className={"mt-1 font-Inter text-[14px]"}>
            When folks take risks, or venture into unfamiliar territory,
            stumbles happen. We all have humbling moments. Using common sense,
            these 90 seconds sound bites are meant to share the human side of
            us, no matter how many trips we&#39;ve taken around the sun, or how
            many companies we&#39;ve started and successfully exited. While any
            CORE Member can upload a 90 second anecdote, being able to hear
            seasoned investors and entrepreneurs is especially appreciated.
          </p>
        </div>
        <div className={"mt-10 ml:[20px] sm:ml-[70px]"}>
          <h2
            className={
              "font-Inter font-bold text-[20px] text-[#232325] leading-tight"
            }
          >
            NanoTalks
          </h2>
          <p className={"mt-1 font-Inter text-[14px]"}>
            Everybody is a subject-matter-expert in something. Whether it&#39;s
            through work or play, CORE Members can upload short videos
            (following guidelines) introducing topics they are passionate about.
            Workshops and virtual coffee may springboard off of these NanoTalks,
            if requested by the community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickStart;
