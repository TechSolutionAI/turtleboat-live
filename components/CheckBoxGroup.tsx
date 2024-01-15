import { useState } from "react";
import { FieldValues, UseFormRegister } from 'react-hook-form';
import shortid from "shortid";
import { Question } from '@/types/question.type';
import { Option } from "@/types/validation.type";

import styles from './CheckBoxGroup.module.css'

const CheckBoxGroup = ({
    field,
    value,
    classes,
    register,
    handleChange
}: {
    field: Question,
    value: string[],
    classes: string | undefined,
    register: UseFormRegister<FieldValues>,
    handleChange: (key: string, value: any) => void
}) => {
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;

        let temp = value;

        if (checked) {
            if (!value.includes(event.target.value)) {
                value = [...temp, event.target.value];
            }
        } else {
            const valueToRemove = event.target.value;
            value = temp.filter((item) => item !== valueToRemove);
        }

        handleChange(field.name, value)
    };


    return (
        <>
            {
                (field.options ?? []).map((option: Option, index: number) => {
                    return (
                        <div key={shortid()} className="flex items-start mb-3 ml-3">
                            <div className="flex items-center h-5">
                                <input
                                    type="checkbox"
                                    value={option.value}
                                    id={field.name + option.value}
                                    {...register(field.name + "[]")}
                                    onChange={(e) => handleCheckboxChange(e)}
                                    className={classes}
                                />
                            </div>
                            <label htmlFor={field.name + option.value} key={option.value} className="ml-2 text-sm font-medium text-gray-500">
                                {option.desc}
                            </label>
                        </div>
                    );
                })
            }
        </>
    );
}

export default CheckBoxGroup