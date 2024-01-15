import { Course } from "./course.type";
import { ComicStrip } from "./comicstrip.type";

export type Venture = {
  _id: string,
  title: string,
  course: Course,
  updatedAt: any,
  createdAt: any,
  description: string,
  mentee: any,
  mentors: any[],
  problemComicStrip?: ComicStrip | null | undefined,
  solutionComicStrip?: ComicStrip | null | undefined,
  storyTrain: any[] | null | undefined,
  stakeholderScenario: StakeholderScenario | null | undefined,
  circleOfResource: any[] | null | undefined
  era?: EntreRoadsideAssistance,
  audio?: any,
  isTeam?: boolean,
  isArchive: boolean,
  collabId: string
}

export type StakeholderScenario = {
  problem: string
  characters: any[]
}

export type EntreRoadsideAssistance = {
  request: any
  response?: any[]
}