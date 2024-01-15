import { useState } from "react";
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { Question } from '@/types/question.type';
import styles from './InputText.module.css'

const InputText = ({
    field,
    value,
    register,
    handleChange
}: {
    field: Question,
    value: string,
    register: UseFormRegister<FieldValues>,
    handleChange: (key: string, value: any) => void
}) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(field.name, event.target.value);
    };

    return (
        <>
            {
                <input
                    type="text"
                    placeholder={field.placeholder}
                    {...register(field.name)}
                    onChange={(e) => handleInputChange(e)}
                    id={field.name}
                    className={
                        `mt-1 px-3 py-2 bg-white border border-slate-300 placeholder-slate-400 focus:outline-none focus:border-primary-blue focus:ring-primary-blue block w-full rounded-md sm:text-sm focus:ring-1`} />
            }
        </>
    );
}

export default InputText