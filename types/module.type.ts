import { User } from '@/types/user.type';

export type Module = {
  _id: string,
  title: string,
  content: string,
  item: string,
  files: any[]
}

export type ModuleItem = {
  isLock: boolean,
  isCheck: boolean,
  isCheckedOff?: boolean,
  module: Module,
  comments?: Comment[],
  checkList?: boolean[]
}

export type Comment = {
  files: any[],
  content: string,
  user: User,
  createdAt: string,
  type: number
}