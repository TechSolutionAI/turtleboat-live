import shortid from "shortid";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { yupResolver } from '@hookform/resolvers/yup';
import { Question } from "@/types/question.type";
import { Option } from "@/types/validation.type";
import useAdvancedProfileStore from "@/stores/useAdvancedProfileStore";
import useBasicProfileStore from "@/stores/useBasicProfileStore";
import { DynamicObject } from '@/utils/dynamicObject';
import { useProfessionalProfileValidationSchema } from "@/lib/useValidations";
import CheckTag from "../CheckTag";
import RadioGroup from "../RaidoGroup";
import InputText from "../InputText";
import Swal from 'sweetalert2';

const ProfileAdvanced = ({
  questions,
  prevClicked,
  profileUpdated
}: {
  questions: Array<Question>,
  prevClicked: Function,
  profileUpdated: Function
}) => {
  const { data: session } = useSession();
  const user = session?.user as User;
  let { schema, defaultValues } = useProfessionalProfileValidationSchema(questions);
  const formOptions = { resolver: yupResolver(schema), defaultValues: { ...(defaultValues as any) } };
  const { register, handleSubmit } = useForm(formOptions);
  const { setAdvancedProfile, getAdvancedProfile } = useAdvancedProfileStore();
  const { getBasicProfile } = useBasicProfileStore();
  const router = useRouter();
  const [errors, setErrors] = useState<any>();
  const [fieldValues, setFieldValues] = useState(defaultValues);
  const [orgTagList, setOrgTagList] = useState<number[]>([]);
  const [filmError, setFilmError] = useState('');

  const getSelectedTagList = (data: any) => {
    let tempTagList: number[] = [];
    const specialityQuestion = questions.find((question) => question.type == "checktable");
    if (specialityQuestion?.subquestions != undefined) {
      specialityQuestion?.subquestions.map((subquestion: any) => {
        let count = 0;
        data.speciality[subquestion.value].map((checkTag: string) => {
          if (checkTag.includes("-selected")) {
            count++;
          }
        })
        if (count > 0) {
          subquestion.tagList.map((tagNumber: number) => {
            const matchedNo = tempTagList.find((number) => number === tagNumber);
            if (matchedNo == undefined) {
              tempTagList.push(tagNumber);
            }
          })
        }
      })
    }
    return tempTagList;
  }

  const saveProfile = async (profile: DynamicObject, isNewUser: boolean = true) => {
    setAdvancedProfile(profile);
    const newTagList = getSelectedTagList(profile)
    const tagsForRemove = orgTagList.filter((item) => !newTagList.includes(item));
    const tagsForAdd = newTagList.filter((item) => !orgTagList.includes(item));

    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        basicProfile: getBasicProfile(),
        advancedProfile: getAdvancedProfile(),
        isNewUser: !user?.isNewUser ? false : isNewUser,
        tagsForRemove: tagsForRemove,
        tagsForAdd: tagsForAdd,
        uid: user._id
      })
    });

    if (!response.ok) {
      const { err } = await response.json();
      console.log(err)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err,
      })
        .then(() => console.log("update failed"))
        .catch(err => console.log(err));
    } else {
      profileUpdated(profile);
    }
  };

  function onSubmit(data: any) {
    console.log(fieldValues['film']);
    if (fieldValues["film"] != '' && fieldValues["film"] != undefined) { 
      setFilmError('');
      saveProfile(fieldValues ?? {}, false);
      Swal.fire({
        icon: 'success',
        title: 'Congritulations!',
        allowOutsideClick: false,
        text: `Your profile was updated successfully!`,
      })
        .then(() => { router.push('/dashboard/core/makeninety') })
        .catch(err => console.log(err));
      return false;
    } else {
      setFilmError('This field is required')
    }
  }

  const handleErrors = (errors: any) => {
    console.log(errors);
    fieldValues["film"] == '' || fieldValues["film"] == undefined ? setFilmError('This field is required') : setFilmError('');
    setErrors(errors);
  };

  const handlePrevClicked = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    e.preventDefault();
    // setAdvancedProfile();
    saveProfile(fieldValues ?? {});
    prevClicked();
  };

  const handleChange = (key: string, value: any) => {
    let temp = fieldValues;
    temp[key] = value;
    setFieldValues(temp);
  }

  const handleChecktagClicked = (key: string, value: string, selected: boolean) => {
    let temp = fieldValues;
    let tempChecktags = temp[key]
    if (selected) {
      if (!temp[key].includes(value)) {
        temp[key] = [...tempChecktags, value];
      }
    } else {
      const valueToRemove = value;
      temp[key] = tempChecktags.filter((item: string) => item !== valueToRemove);
    }
    setFieldValues(temp);
  }

  const handleCheckTableItemClicked = (event: React.ChangeEvent<HTMLInputElement>, key: string, subkey: string) => {
    const index = parseInt((event.target as HTMLInputElement).getAttribute('data-index') || '-1');
    if (index != -1) {
      let temp = fieldValues;
      temp[key][subkey][index] = event.target.checked ? `${(index + 1)}-selected` : `${(index + 1)}`;
      setFieldValues(temp);
    }
  }

  const handleTextChanged = (event: React.ChangeEvent<HTMLTextAreaElement>, key: string) => {
    let temp = fieldValues;
    temp[key] = event.target.value;
    setFieldValues(temp);
  };

  useEffect(() => {
    setOrgTagList(getSelectedTagList(defaultValues));
  }, []);
  

  return (
    <form onSubmit={handleSubmit(onSubmit, handleErrors)}>
      {
        questions.map((question: Question) => {
          return (
            <div key={shortid()} className={`grid gap-6 mb-6 md:grid-cols-1 overflow-x-auto`}>
              <div key={shortid()}>
                <label className="block mb-2 text-base font-medium text-gray-900" htmlFor={question.name}>
                  {question.question} {question.required && <span className="text-secondary-red">*</span>}
                </label>
                {
                  question.type == "checktable"
                    ?
                    <div className="relative shadow-md sm:rounded-lg">
                      <table className="w-full text-md text-center">
                        <thead className="text-xs text-gray-700 bg-gray-50">
                          <tr>
                            <th>This section helps us identify how CORE members can best support each other, as well as gain more exposure/experience on areas of interest.</th>
                            {
                              (question.options ?? []).map((option) => {
                                return (
                                  <th key={shortid()} className="px-6 py-3">
                                    {option.desc}
                                  </th>
                                );
                              })
                            }
                          </tr>
                        </thead>
                        <tbody className="">
                          {
                            (question.subquestions ?? []).map((subquestion) => {
                              return (
                                <tr
                                  key={shortid()}
                                  className={
                                    `bg-white border-b`}>
                                  <td className="px-6 w-30 text-left">{subquestion.desc}</td>
                                  {
                                    (question.options ?? []).map((option: Option, index: number) => {
                                      return (
                                        <td key={shortid()} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                          {
                                            <input type="checkbox"
                                              data-index={index}
                                              value={fieldValues[question.name][subquestion.value][index].includes("-selected") ? fieldValues[question.name][subquestion.value][index] + "" : fieldValues[question.name][subquestion.value][index] + "-selected"}
                                              {...register(question.name + "[" + subquestion.value + "][]", { onChange: (e) => handleCheckTableItemClicked(e, question.name, subquestion.value) })}
                                              className={`w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 
                                                focus:ring-blue-300`} />
                                          }

                                        </td>
                                      );
                                    })
                                  }
                                </tr>
                              );
                            })
                          }
                        </tbody>
                      </table>
                    </div>
                    // <></>
                    : question.type == "checktag"
                      ? <div className={`flex flex-wrap gap-4`}>
                        {
                          (question.options ?? []).map((option: Option) => {
                            // return (
                            //   <div key={shortid()} className="flex items-center">
                            //     <input
                            //       type="checkbox"
                            //       value=""
                            //       className={
                            //         `w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 
                            //         focus:ring-blue-300`}
                            //       required
                            //     />
                            //     <label className="ml-2 text-sm font-medium text-gray-900">
                            //       {option.desc}
                            //     </label>
                            //   </div>
                            // );
                            return (
                              <CheckTag key={shortid()} register={register} field={question} option={option} values={fieldValues[question.name]} handleChecktagClicked={handleChecktagClicked} />
                            );
                          })
                        }
                      </div>
                      : question.type == "radio"
                        ?
                        <RadioGroup classes={`flex ml-3 ${!question.inline ? "flex-col space-y-3" : "space-x-60 items-center"} justify-start`} field={question} register={register} value={fieldValues[question.name]} handleChange={handleChange} />
                        : question.type == "textarea"
                          ? <textarea
                            id={question.name}
                            {...register(question.name)}
                            onChange={(e) => handleTextChanged(e, question.name)}
                            rows={4}
                            className={
                              `block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 
                              focus:outline-none focus:border-primary-blue focus:ring-primary-blue `}
                            placeholder="Write your thoughts here...">
                          </textarea>
                          :
                          <InputText field={question} register={register} value={fieldValues[question.name]} handleChange={handleChange} />
                }
              </div>
              {
                errors && errors[question.name] && (
                  <span className="text-secondary-red text-sm">{errors[question.name]?.message}</span>
                )
              }
              
              {
                question.name == "film" && filmError != "" && (
                  <span className="text-secondary-red text-sm">{filmError}</span>
                )
              }
            </div>
          )
        })
      }
      <div className="">
        <input
          type="button"
          className={
            `text-white float-left bg-blue-700 hover:bg-blue-800 
                focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium 
                rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center`}
          onClick={(e) => handlePrevClicked(e)}
          value="Prev"
        />
        <button
          type="submit"
          className={
            `text-white float-right bg-primary-blue hover:bg-primary-blue 
                  focus:ring-4 focus:outline-none focus:ring-primary-blue font-medium 
                  rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center`}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default ProfileAdvanced;