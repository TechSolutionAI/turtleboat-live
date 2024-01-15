import shortid from "shortid";
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { Question } from '@/types/question.type';
import { Option } from "@/types/validation.type";
import styles from './RadioGroup.module.css';

const RadioGroup = ({
    field,
    value,
    register,
    classes,
    handleChange
}: {
    field: Question,
    value: string,
    classes: string | undefined
    register: UseFormRegister<FieldValues>,
    handleChange: (key: string, value: any) => void
}) => {
    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(field.name, event.target.value);
    };

    return (
        <div className={classes}>
            {
                (field.options ?? []).map((option: Option) => {
                    return (
                        <div key={shortid()} className="flex items-center">
                            {
                                <input
                                    type="radio"
                                    value={option.value}
                                    id={option.value}
                                    {...register(field.name)}
                                    onChange={handleRadioChange}
                                    className={
                                        `w-4 h-4 text-primary-blue bg-gray-100`
                                    }
                                />
                            }
                            <label
                                className="ml-2 text-sm font-medium text-gray-500"
                                htmlFor={option.value}
                            >
                                {option.desc}
                            </label>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default RadioGroup