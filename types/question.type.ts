import { Validation, Option } from "./validation.type";

export type Question = {
  question: string,
  fieldName?: string,
  subquestions?: Option[],
  name: string,
  type: string,
  required?: boolean,
  options?: Option[],
  column?: number,
  inline?: boolean,
  placeholder?: string,
  setValue?: Function,
  getValue?: Function,
  value?: string,
  validations?: Validation[]
};