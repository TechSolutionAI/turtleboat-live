import useBasicProfileStore from "@/stores/useBasicProfileStore";
import { Question } from "@/types/question.type";

export const basicprofilequestions: Array<Array<Question>> = [
  [
    {
      question: "First name",
      fieldName: "First Name",
      name: "firstName",
      type: "text",
      placeholder: "Vicky",
      required: true,
      value: "",
    },
    {
      question: "Middle name",
      name: "middleName",
      fieldName: "Middle name",
      placeholder: "Wu",
      type: "text",
      required: false,
      value: "",
    },
    {
      question: "Last name",
      name: "lastName",
      fieldName: "Last name",
      placeholder: "Davis",
      type: "text",
      required: true,
      value: "",
      validations: [
        {
          type: "required",
          message: "Last name is required"
        },
      ],
    }
  ],
  [
    {
      question: "Mobile number",
      name: "mobileNumber",
      fieldName: "Mobile number",
      type: "phone",
      required: true
    },
    {
      question: "Email address",
      name: "emailAddress",
      fieldName: "Email address",
      placeholder: "vickyswu@gmail.com",
      type: "email",
      required: true,
      value: "",
    }
  ],
  [
    {
      question: "Linkedin Profile",
      name: "linkedinProfile",
      fieldName: "Linkedin Profile",
      placeholder: "https://linkedin.com/vicky***",
      type: "url",
    }
  ],
  [
    {
      question: "Twitter Profile",
      name: "twitterProfile",
      fieldName: "Twitter Profile",
      placeholder: "https://twitter.com/***",
      type: "url",
    }
  ],
  [
    {
      question: "Country",
      name: "country",
      fieldName: "Country",
      type: "text",
      required: true,
      value: "",
    },
    {
      question: "State / Province",
      name: "region",
      fieldName: "Region",
      type: "text",
      required: true,
      value: "",
    },
    {
      question: "City",
      name: "residenceCity",
      fieldName: "City",
      type: "text",
      required: true,
      value: "",
    },
  ],
  [
    {
      question: "Who referred you to yCITIES/Turtle Boat(must have a referral)?",
      name: "referrer",
      fieldName: "This field",
      placeholder: "Vicky Wu Davis",
      type: "text",
      required: true,
      value: "",
    },
    // {
    //   question: "",
    //   type: "",
    // }
  ],
  [
    {
      question: "Have Prior Mentoring Experience?",
      name: "mentorExperience",
      fieldName: "This field",
      type: "radio",
      required: true,
      value: "",
      options: [
          {
              value: "yes",
              desc: "Yes",
          },
          {
              value: "no",
              desc: "No"
          }
      ],
    }
  ],
  // [
  //   {
  //     question: `As a CORE Member, you are by default an Ad Hoc Subject-Matter-Expert for "Entrepreneurial Roadside Assistance" (receiving and/or giving one-off help...the entrepreneurial equivalent of helping someone change a flat w/a temporary tire so the driver can reach their next destination) unless you opt-out by checking the box below. In addition to ERA, please indicate your potential interest for community engagement (checking a box indicates that you'd like more info, it is not a commitment; can check more than 1 box):`,
  //     name: "membershipInterest",
  //     fieldName: "This field",
  //     type: "checkbox",
  //     required: true,
  //     value: "",
  //     options: [
  //         {
  //             value: "1",
  //             desc: "Entrepreneurial Roadside Assistance (ERA) is offered to all CORE Members. Capitalizing on your areas of expertise (if/when the occasion arises), these 1-off requests for help can take the form of an asynchronous virtual brainstorm, an ask for a warm email intro, a 15min brainstorming Zoom, or a 30min prototyping support Zoom). If you choose to opt out of ERA, please select -- from the below options -- at least 1 additional way you'd like to interact with the CORE Community",
  //         },
  //         {
  //             value: "2",
  //             desc: "Mentoring (as a generalist, helping mentees maximize their entrepreneurial education/journey)"
  //         },
  //         {
  //             value: "3",
  //             desc: "Being Mentored in RATlabs (for a startups between idea stage to pre-accelerator stage)"
  //         },
  //         {
  //             value: "4",
  //             desc: "Pitch Deck modding to help a founder refine (mostly asynchronous work)"
  //         },
  //         {
  //             value: "5",
  //             desc: "Participating as a mock investor Mangrove Mock Angels Group (for student ventures that are not legal entities)"
  //         },
  //         {
  //             value: "6",
  //             desc: "Giving (virtual) NanoTalks about something you are very passionate about (10 min Talk + 10 min Q&A)"
  //         },
  //         {
  //             value: "7",
  //             desc: "Follow the progress of particular venture(s) as a spectator (timing & ventures may vary from cycle to cycle)"
  //         },
  //         {
  //             value: "8",
  //             desc: "participate in 15min Monthly Virtual Coffees with other members of the CORE Community (3 person min, 5 person max, 1st come basis)"
  //         },
  //     ],
  //   }
  // ],
  // [
  //   {
  //     question: "If Zoom meetings are needed, which options generally work best for you?",
  //     name: "meetTime",
  //     fieldName: "Meet Time",
  //     type: "checkbox",
  //     required: false,
  //     value: "",
  //     options: [
  //         {
  //             value: "1",
  //             desc: "Mondays between 5pm to 7pm ET",
  //         },
  //         {
  //             value: "2",
  //             desc: "Tuesdays between 5pm to 7pm"
  //         },
  //         {
  //             value: "3",
  //             desc: "Thursdays between 5pm to 7pm"
  //         },
  //         {
  //             value: "4",
  //             desc: "Fridays at noon ET"
  //         },
  //         {
  //             value: "5",
  //             desc: "Fridays at 1pm ET"
  //         }
  //     ],
  //   }
  // ]
]