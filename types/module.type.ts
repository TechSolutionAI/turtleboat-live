import { User } from '@/types/user.type';

export type Module = {
  _id: string,
  title: string,
  content: string,
  summarize?: string,
  item: string,
  files: any[]
}

export type ModuleItem = {
  isLock: boolean,
  isCheck: boolean,
  isCheckedOff?: boolean,
  module: Module,
  comments?: Comment[],
  checkList?: boolean[],
  evaluations?: MentorEvaluation[]
}

export type Comment = {
  files: any[],
  content: string,
  user: User,
  createdAt: string,
  type: number
}

export type MentorEvaluation = {
  _id: string,
  value: number,
  lastUpdated: string
}

export type VentureAssessment = {
  _id: string,
  value: number[],
  articulates: [],
  lastUpdated: string
}
