export type User = {
  id?: string | null | undefined;
  _id?: string | null | undefined;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  role?: string | null | undefined;
  isNewUser?: boolean | null | undefined;
  ventures?: Array<any> | [] | null | undefined;
  basicProfile?: UserBasicProfile | null | undefined;
  advancedProfile?: UserAdvancedProfile | null | undefined;
  tokens?: number | 0;
  totalEarnedTokens?: number | 0;
  createdAt?: string;
  lastLogin?: string | undefined;
  followers?: any;
  isPaid?: boolean | null | undefined;
  paidNote?: string | null | undefined;
  isAccessCore?: boolean | null | undefined;
};

export type UserBasicProfile = {
  firstName?: string | "";
  middleName?: string | "";
  lastName?: string | "";
  mobileNumber?: string | "";
  emailAddress?: string | "";
  linkedinProfile?: string | "";
  twitterProfile?: string | "";
  country?: string | "";
  region?: string | "";
  residenceCity?: string | "";
  referrer?: string | "";
  mentorExperience?: string | "";
  membershipInterest?: Array<any> | [];
  meetTime?: Array<any> | [];
  [key: string]: any;
};

export type UserAdvancedProfile = {
  additionalNotes?: string | "";
  familiarIndustry?: string[] | [];
  film?: string | "";
  hobbies?: string[] | [];
  oneweekTravel?: string | "";
  permanentTravel?: string | "";
  professional?: string[] | [];
  speciality?: any | {};
  technicalSkills?: string[] | [];
  [key: string]: any;
};
