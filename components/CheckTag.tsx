import { useState, useRef, useEffect } from "react";
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { Question } from '@/types/question.type';
import { Option } from "@/types/validation.type";

const CheckTag = ({
  option,
  field,
  values,
  register,
  handleChecktagClicked,
}: {
  option: Option,
  field: Question,
  values: string[],
  register: UseFormRegister<FieldValues>,
  handleChecktagClicked: (key: string, value: string, selected: boolean) => void
}) => {
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (values.includes(option.value)) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [values])

  const handleClick = () => {
    handleChecktagClicked(field.name, option.value, !isSelected)
    setIsSelected(!isSelected);
  };

  return (
    <div
      className={`flex px-0 py-0 rounded-lg cursor-pointer border border-slate-300 ${isSelected ? "bg-secondary-red border-secondary-red text-white" : "bg-white border-secondary-gray text-primary-black"}`}>
      <input
        type="checkbox"
        value={option.value}
        id={option.value}
        className="hidden"
        {...register(field.name)}
      /> 
      <label 
        onClick={handleClick} 
        htmlFor={option.value}
        className={`px-[20px] py-[7px]`}
      >
        {option.desc}
      </label>
    </div>
  );
};

export default CheckTag;