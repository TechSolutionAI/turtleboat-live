import * as Yup from 'yup';
import { Question } from "@/types/question.type";
import { createDynamicObject } from '@/utils/dynamicObject';
import { useSession } from "next-auth/react";
import { User } from "next-auth"

export const useBasicProfileValidationSchema = (fields: Array<Array<Question>>) => {
    const { data: session } = useSession();
    const user = session?.user as User;
    const userBasicProfile = user?.basicProfile
    let validationArray: any[] = [];
    let initArray: any[] = [];
    fields.map((bunch: Array<Question>, idx: number) => {
        bunch.map((question: Question) => {
            let validationValue;
            let defaultValue: any = "";
            if (question.name != "country" && question.name != "region" && question.name != "mentorExperience") {
                if (question.type == "email") {
                    validationValue = question.required ? Yup.string().required(`${question.fieldName} is required`).email('Invalid email address') : Yup.string().email('Invalid email address').nullable().default('');
                } else if (question.type == "phone") {
                    validationValue = question.required ? Yup.string()
                        .matches(/^[0-9]{10,11}$/, `${question.fieldName} must be 10 or 11 digits`)
                        .required(`${question.fieldName} is required`) : Yup.string()
                            .matches(/^[0-9]{10,11}$/, `${question.fieldName} must be 10 or 11 digits`)
                            .nullable();
                } else if (question.type == "checkbox") {
                    validationValue = question.required ? Yup.array().min(1, 'Please select at least one option') : Yup.array().nullable().default([]);
                    defaultValue = [];
                } else if (question.type == "url") {
                    validationValue = question.required ? Yup.string().url(`Please input valid url`)
                        .required(`${question.fieldName} is required`) : Yup.string()
                            .url(`Please input valid url`)
                            .nullable().default('');
                } else {
                    validationValue = question.required ? Yup.string().required(`${question.fieldName} is required`) : Yup.string().nullable().default('');
                }
            }
            // else {
            //     validationValue = question.required ? Yup.string().required(`${question.fieldName} is required`) : Yup.string().nullable();
            // }
            validationArray.push([question.name, validationValue]);
            if (userBasicProfile?.[question.name] != undefined) {
                initArray.push([question.name, userBasicProfile[question.name]])
            } else {
                const names: string[] = user?.name?.split(" ") ?? [];
                switch (question.name) {
                    case "firstName":
                        defaultValue = (names?.length ?? 0) > 1 ? names[0] : '';
                        break;
                    case "lastName":
                        defaultValue = (names?.length ?? 0) > 1 ? names[1] : '';
                        break;
                    case "emailAddress":
                        defaultValue = user?.email;
                        break;
                }
                initArray.push([question.name, defaultValue])
            }
        })
    })
    const schema = Yup.object().shape(createDynamicObject(validationArray));
    const defaultValues = createDynamicObject(initArray);
    return { schema: schema, defaultValues: defaultValues };
};

export const useProfessionalProfileValidationSchema = (fields: Array<Question>) => {
    let validationArray: any[] = [];
    let initArray: any[] = [];
    const { data: session } = useSession();
    const user = session?.user as User;
    const userAdvancedProfile = user?.advancedProfile;
    fields.map((question: Question) => {
        let validationValue;
        let defaultValue: any = "";
        if (question.name != "film") {
            if (question.type == "email") {
                validationValue = question.required ? Yup.string().required(`${question.fieldName} is required`).email('Invalid email address') : Yup.string().email('Invalid email address').nullable().default('');
            } else if (question.type == "phone") {
                validationValue = question.required ? Yup.string()
                    .matches(/^[0-9]{10,11}$/, `${question.fieldName} must be 10 or 11 digits`)
                    .required(`${question.fieldName} is required`) : Yup.string()
                        .matches(/^[0-9]{10,11}$/, `${question.fieldName} must be 10 or 11 digits`)
                        .nullable();
            } else if (question.type == "checkbox") {
                validationValue = question.required ? Yup.array().min(1, 'Please select at least one option') : Yup.array().nullable().default([]);
                // defaultValue = [];
            } else if (question.type == "checktag") {
                validationValue = question.required ? Yup.array().min(1, 'Please select at least one option') : Yup.array().nullable().default([]);
                if (userAdvancedProfile?.[question.name] != undefined) {
                    defaultValue = userAdvancedProfile[question.name]
                } else {
                    defaultValue = []
                }
            } else if (question.type == "checktable") {
                // validationValue = question.required ? Yup.array().min(1, 'Please select at least one option') : Yup.array().nullable();
                validationValue = question.required ? Yup.object().test(
                    'obj-values-test',
                    'Please select at least one option',
                    obj => {
                        let selectedCount = 0;
                        Object.values(obj).map((item: any) => {
                            item.map((val: string) => {
                                if (val.includes('-selected')) {
                                    selectedCount++;
                                }
                            })
                        });
                        return selectedCount > 0 ? true : false;
                    }
                ) : Yup.object().nullable();
                if (question.subquestions) {
                    let subquestionValues: any[] = [];
                    // let validationValues: any[] = [];
                    question.subquestions.map((subquestion) => {
                        let options: any[] = [];
                        question.options && question.options.map((option) => {
                            // options.push(subquestion.value + option.value);
                            options.push(option.value);
                            // options.push('');
                        })
                        subquestionValues.push([subquestion.value, options]);
                    });
                    defaultValue = createDynamicObject(subquestionValues);
                } else {
                    defaultValue = [];
                }
            } else {
                validationValue = question.required ? Yup.string().required(`${question.fieldName} is required`) : Yup.string().nullable();
            }
        }
        if (userAdvancedProfile?.[question.name] != undefined) {
            initArray.push([question.name, userAdvancedProfile[question.name]])
        } else {
            initArray.push([question.name, defaultValue])
        }
        validationArray.push([question.name, validationValue]);
        // initArray.push([question.name, defaultValue])
    })
    const schema = Yup.object().shape(createDynamicObject(validationArray));
    const defaultValues = createDynamicObject(initArray);
    return { schema: schema, defaultValues: defaultValues };
};