import { Module, ModuleItem } from "./module.type"

export type Course = {
  _id: string,
  title: string,
  modules: ModuleItem[],
  ventures: number,
  description: string,
}