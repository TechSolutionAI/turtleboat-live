import { Question } from "@/types/question.type";

export const Professions: Array<any> = [
    {
        value: "technical",
        desc: "Technical",
    },
    {
        value: "creative",
        desc: "Creative"
    },
    {
        value: "financial",
        desc: "Financial"
    },
    {
        value: "operations",
        desc: "Operations"
    },
    {
        value: "scientific",
        desc: "Scientific"
    },
    {
        value: "sales",
        desc: "Sales"
    },
    {
        value: "product",
        desc: "Product"
    },
    {
        value: "management",
        desc: "Management"
    },
    {
        value: "investor",
        desc: "Investor"
    },
    {
        value: "founder",
        desc: "Founder"
    },
    {
        value: "student",
        desc: "Currently a student"
    },
    {
        value: "other",
        desc: "Other"
    },
];

export const Industries: Array<any> = [
    {
        value: "aerospace",
        desc: "Aerospace Industry",
    },
    {
        value: "agriculture",
        desc: "Agriculture industry"
    },
    {
        value: "computer",
        desc: "Computer Industry"
    },
    {
        value: "construction",
        desc: "Construction Industry"
    },
    {
        value: "education",
        desc: "Education Industry"
    },
    {
        value: "electronics",
        desc: "Electronics Industry"
    },
    {
        value: "energe",
        desc: "Energy Industry"
    },
    {
        value: "entertainment",
        desc: "Entertainment Industry"
    },
    {
        value: "financial",
        desc: "Financial Industry"
    },
    {
        value: "food_beverage",
        desc: "Food and/or Beverage Industry"
    },
    {
        value: "healthcare",
        desc: "Healthcare Industry"
    },
    {
        value: "hospitality",
        desc: "Hospitality Industry"
    },
    {
        value: "internet",
        desc: "Internet Industry"
    },
    {
        value: "manufacturing",
        desc: "Manufacturing Industry"
    },
    {
        value: "music",
        desc: "Music Industry"
    },
    {
        value: "news_media",
        desc: "News Media Industry"
    },
    {
        value: "pharmaceutical",
        desc: "Pharmaceutical Industry"
    },
    {
        value: "telecommunication",
        desc: "Telecommunication industry"
    },
    {
        value: "transport",
        desc: "Transport Industry"
    },
    {
        value: "student",
        desc: "Currently a student"
    },
    {
        value: "other",
        desc: "Other"
    },
];

export const Hobbies: Array<any> = [
    {
        value: "baking",
        desc: "Baking",
    },
    {
        value: "board_games",
        desc: "Board/Card games"
    },
    {
        value: "boating",
        desc: "Boating"
    },
    {
        value: "cooking",
        desc: "Cooking"
    },
    {
        value: "criket",
        desc: "Cricket"
    },
    {
        value: "cycling",
        desc: "Cycling",
    },
    {
        value: "dancing",
        desc: "Dancing"
    },
    {
        value: "debating",
        desc: "Debating"
    },
    {
        value: "decorating",
        desc: "Decorating"
    },
    {
        value: "finance",
        desc: "Finance"
    },
    {
        value: "fashion",
        desc: "Fashion",
    },
    {
        value: "fitness",
        desc: "Fitness/Nutrition"
    },
    {
        value: "gardening",
        desc: "Gardening"
    },
    {
        value: "hiking",
        desc: "Hiking"
    },
    {
        value: "history",
        desc: "History"
    },
    {
        value: "making_playing_music",
        desc: "Making/Playing Music",
    },
    {
        value: "planning",
        desc: "Organizing/Events Planning"
    },
    {
        value: "painting",
        desc: "Painting"
    },
    {
        value: "photography",
        desc: "Photography"
    },
    {
        value: "politics",
        desc: "Politics"
    },
    {
        value: "singing",
        desc: "Singing",
    },
    {
        value: "playing_sports",
        desc: "Sports (playing)"
    },
    {
        value: "watching_sports",
        desc: "Sports (watching)"
    },
    {
        value: "teaching",
        desc: "Teaching"
    },
    {
        value: "travel",
        desc: "Travel"
    },
    {
        value: "video_editing",
        desc: "Video editing"
    },
    {
        value: "videogames",
        desc: "Videogames"
    },
    {
        value: "woodworking",
        desc: "Woodworking"
    },
];

export const advancedprofilequestions: Array<Question> = [
  {
    question: `In your professional world, you are (check all that apply). If you are a student, check areas you're interested in + student box.`,
    name: "professional",
    fieldName: "Professional field",
    type: "checktag",
    required: true,
    value: "",
    options: Professions
  },
  {
    question: "Industries you are familiar with (if student, check areas that interest you + student box):",
    name: "familiarIndustry",
    fieldName: "Industry field",
    type: "checktag",
    required: true,
    value: "",
    options: Industries,
    validations: [
        {
            type: "required",
            message: "Field is required"
        }
    ]
  },
  {
    question: "Who Am I?",
    name: "speciality",
    fieldName: "This field",
    type: "checktable",
    subquestions: [
        {
            desc: "tinkering type of creator (from cardboard boxes to sensors & circuits to silversmithing...or anything in between)",
            value: "tinkering",
            tagList: [6, 7]
        },
        {
            desc: "sketching type of creator (from flow charts to fine art, on napkins, paper, wireframes, CAD...or anything in between)",
            value: "sketching",
            tagList: [2, 5]
        },
        {
            desc: "love figuring out how to ask the right questions, creating connections where there doesn't seem to be any, sticky note enthusiast",
            value: "figuring",
            tagList: [1, 2, 3, 4]
        },
        {
            desc: "I know what to do with data after it's collected",
            value: "knowing",
            tagList: [1, 2, 4]
        },
        {
            desc: "detail-oriented (from tasks to logistics to organizer, keeping everyone in line and on track brings joy)",
            value: "detailOriented",
            tagList: [1, 2, 4]
        },
        {
            desc: "coder, whether professional s/w developer or love to hack/mod",
            value: "coder",
            tagList: [5, 6, 7]
        },
        {
            desc: "app developer, mobile tech enthusiast",
            value: "appDev",
            tagList: [5, 6, 7]
        },
        {
            desc: "geek out to unit economics and business models",
            value: "geek",
            tagList: [1, 2, 4]
        },
        {
            desc: "social media savvy",
            value: "socailSavvy",
            tagList: [1, 4]
        },
        {
            desc: "networker/connector, bringing friends & acquaintances together is a happy place even if it's virtual",
            value: "networker",
            tagList: [2, 8]
        },
        {
            desc: "storyteller, writer, content creator",
            value: "storyteller",
            tagList: [2, 4]
        },
    ],
    value: "",
    options: [
        {
            value: "1",
            desc: "Very Me!!!",
        },
        {
            value: "2",
            desc: "Sort of Me"
        },
        {
            value: "3",
            desc: "Not Very Me(but would like exporsure to this)"
        },
        {
            value: "4",
            desc: "Not Me"
        },
    ],
    required: true,
  },
  {
    question: "If you had to go to a deserted island for *1 weekend*, what 3 things would you bring?",
    name: "oneweekTravel",
    fieldName: "Field",
    type: "textarea",
    required: true,
    value: "",
  },
  {
    question: "If you had to go to a deserted island *indefinitely*, what 3 things would you bring?",
    name: "permanentTravel",
    fieldName: "Field",
    type: "textarea",
    required: true,
    value: "",
  },
  {
    question: "If you're involved in a film/play, would you choose to be (pick only 1):",
    type: "radio",
    name: 'film',
    fieldName: "This field",
    required: true,
    value: "",
    options: [
        {
            value: "producer",
            desc: "Producer",
        },
        {
            value: "director",
            desc: "Director"
        },
        {
            value: "actor",
            desc: "Actor"
        },
        {
            value: "screenwriter",
            desc: "Screenwriter"
        },
        {
            value: "designer",
            desc: "Set Designer"
        },
    ],
    inline: false,
  },
  {
    question: "Hobbies / Interests (check all that apply)",
    type: "checktag",
    name: 'hobbiles',
    fieldName: "Hobbies / Interests",
    value: "",
    options: Hobbies,
    required: true,
    column: 2
  },
  {
    question: "Technical skills (for guidance or troubleshooting)",
    type: "checktag",
    name: "technicalSkills",
    fieldName: "Techincal Skills",
    required: true,
    
    value: "",
    options: [
        {
            value: "frontend",
            desc: "front-end development",
        },
        {
            value: "backend",
            desc: "back-end development"
        },
        {
            value: "web",
            desc: "web development"
        },
        {
            value: "mobile",
            desc: "mobile app development"
        },
        {
            value: "3dprinting",
            desc: "3D printing"
        },
        {
            value: "rendering",
            desc: "Rendering",
        },
        {
            value: "eprototyping",
            desc: "Electronic prototyping"
        },
        {
            value: "not technical",
            desc: "Not technical"
        },
    ],
  },
  {
    question: "Is there any other information that you would like to share with us?",
    type: "textarea",
    name: 'additionalNotes',
    fieldName: "Additional info",
  }
]