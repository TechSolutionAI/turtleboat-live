import LikeIcon from "/public/static/images/emoji/like.png";
import ShockedIcon from "/public/static/images/emoji/shocked.png";
import CelebrateIcon from "/public/static/images/emoji/celebrate.png";
import LoveIcon from "/public/static/images/emoji/love.png";
import InsightfulIcon from "/public/static/images/emoji/insightful.png";
import CuriousIcon from "/public/static/images/emoji/curious.png";

export const emotionList = [
    {
        text: 'Shocked',
        img: ShockedIcon,
        value: 0,
        isSelected: false
    },
    {
        text: 'Like',
        img: LikeIcon,
        value: 1,
        isSelected: false
    },
    {
        text: 'Celebrate',
        img: CelebrateIcon,
        value: 2,
        isSelected: false
    },
    {
        text: 'Love',
        img: LoveIcon,
        value: 3,
        isSelected: false
    },
    {
        text: 'Insightful',
        img: InsightfulIcon,
        value: 4,
        isSelected: false
    },
    {
        text: 'Curious',
        img: CuriousIcon,
        value: 5,
        isSelected: false
    }
];

export const collaTablist = ["Notepad", "Mentors ChitChat", "T-Reports"];

export const trains = [
    {
      id: "opening",
      label: "Opening Hook",
      value: "",
      order: 0,
    },
    {
      id: "problem",
      label: "Problem",
      value: "",
      order: 1,
    },
    {
      id: "character",
      label: "Character",
      value: "",
      order: 2,
    },
    {
      id: "setting",
      label: "Setting",
      value: "",
      order: 3,
    },
    {
      id: "solution",
      label: "Solution",
      value: "",
      order: 4,
    },
    {
      id: "closing",
      label: "Closing Hook",
      value: "",
      order: 5,
    },
  ];
