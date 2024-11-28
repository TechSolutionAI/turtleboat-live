import shortid from "shortid";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { yupResolver } from '@hookform/resolvers/yup';
import { useBasicProfileValidationSchema } from "@/lib/useValidations";
import useBasicProfileStore from "@/stores/useBasicProfileStore";
import { Question } from "@/types/question.type";
import { DynamicObject } from '@/utils/dynamicObject';
import RadioGroup from "../RaidoGroup";
import InputText from "../InputText";
import CheckBoxGroup from "../CheckBoxGroup";
// import 'react-phone-input-2/lib/bootstrap.css';

const ProfileBasic = ({
  questions,
  nextClicked,
  profileUpdated,
}: {
  questions: Array<Array<Question>>,
  nextClicked: Function,
  profileUpdated: Function,
}) => {
  const { schema, defaultValues } = useBasicProfileValidationSchema(questions);
  const formOptions = { resolver: yupResolver(schema), defaultValues: { ...(defaultValues as any) } };
  const { register, handleSubmit } = useForm(formOptions);
  const { setBasicProfile, setRegion, setCountry } = useBasicProfileStore();
  const [region, setFormRegion] = useState(defaultValues.region);
  const [country, setFormCountry] = useState(defaultValues.country);
  const [regionError, setRegionError] = useState('');
  const [countryError, setCountryError] = useState('');
  const [expError, setExpError] = useState('');
  const [errors, setErrors] = useState<any>();
  const [fieldValues, setFieldValues] = useState(defaultValues);

  function onSubmit(data: any) {
    if (country != "" && region != "" && fieldValues["mentorExperience"] != '' && fieldValues["mentorExperience"] != undefined) {
      // setBasicProfile(fieldValues ?? {});
      // profileUpdated(fieldValues ?? {});
      saveBasicProfile(fieldValues ?? {})
      nextClicked();
      return false;
    }
  }

  const saveBasicProfile = async (profile: DynamicObject) => {
    setBasicProfile(profile);
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        basicProfile: profile,
        email: profile.email
      })
    });

    if (!response.ok) {
      const { err } = await response.json();
      console.log(err)
    } else {
      profileUpdated(profile);
    }
  };

  const handleErrors = (errors: any) => {
    country == '' ? setCountryError('Country is required') : setCountryError('');
    region == '' ? setRegionError('Region is required') : setRegionError('');
    fieldValues["mentorExperience"] == '' || fieldValues["mentorExperience"] == undefined ? setExpError('This field is required') : setExpError('');
    setErrors(errors);
  };

  const handleChange = (key: string, value: any) => {
    let temp = fieldValues;
    temp[key] = value;
    setFieldValues(temp);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, handleErrors)}>
      {
        questions.map((bunch: Array<Question>, idx: number) => {
          return (
            <div
              key={shortid()}
              className={
                bunch.length == 3
                  ? "form-group grid md:grid-cols-3 gap-6 mb-6"
                  : bunch.length == 2
                    ? "form-group grid md:grid-cols-2 gap-6 mb-6"
                    : "form-group grid md:grid-cols-1 gap-6 mb-6"}>
              {
                bunch.map((question: Question) => {
                  return (
                    <div key={shortid()}>
                      <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor={question.name}>
                        {question.question} {question.required && <span className="text-secondary-red">*</span>} 
                        {
                          question.name == 'linkedinProfile' && (
                            <span className="text-secondary-red">(It is highly recommended that you put your profile link here, as it allows CORE members to click on your profile picture in Turtle Boat and go to your  LinkedIn page, which is especially helpful for 1st time Founders.)</span>
                          )
                        }
                      </label>
                      {
                        question.type == "checkbox"
                          ?
                          <CheckBoxGroup classes="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 
                          focus:ring-primary-blue" field={question} register={register} value={fieldValues[question.name]} handleChange={handleChange} />
                          : question.type == "radio"
                            ? <RadioGroup classes="flex justify-start items-center space-x-60" field={question} register={register} value={fieldValues[question.name]} handleChange={handleChange} />
                            : question.type == ""
                              ?
                              <></>
                              : question.name == "country"
                                ?
                                <CountryDropdown
                                  value={country}
                                  onChange={(val: string) => {
                                    val == '' ? setCountryError(`${question.fieldName} is required`) : setCountryError('');
                                    handleChange(question.name, val);
                                    setFormCountry(val);
                                    setCountry(val);
                                    setRegionError("Region is required");
                                    setRegion('');
                                    setFormRegion('');
                                  }}
                                  classes={`mt-1 px-3 py-2 bg-white border border-slate-300 placeholder-slate-400 focus:outline-none focus:border-primary-blue focus:ring-primary-blue block w-full rounded-md sm:text-sm focus:ring-1`} />
                                : question.name == "region"
                                  ?
                                  <RegionDropdown
                                    value={region}
                                    country={country}
                                    onChange={(val: string) => {
                                      val == '' ? setRegionError(`${question.fieldName} is required`) : setRegionError('');
                                      handleChange(question.name, val);
                                      setFormRegion(val);
                                      setRegion(val);
                                    }}
                                    classes={`mt-1 px-3 py-2 bg-white border border-slate-300 placeholder-slate-400 focus:outline-none focus:border-primary-blue focus:ring-primary-blue block w-full rounded-md sm:text-sm focus:ring-1`} />
                                  :
                                  <InputText field={question} register={register} value={fieldValues[question.name]} handleChange={handleChange} />
                      }
                      {
                        errors && errors[question.name] && (
                          <span className="text-secondary-red text-sm">
                            {
                              errors[question.name]?.message
                            }
                          </span>
                        )
                      }
                      {
                        question.name == "country" && countryError != "" && (
                          <span className="text-secondary-red text-sm">{countryError}</span>
                        )
                      }
                      {
                        question.name == "region" && regionError != "" && (
                          <span className="text-secondary-red text-sm">{regionError}</span>
                        )
                      }
                      {
                        question.name == "mentorExperience" && expError != "" && (
                          <span className="text-secondary-red text-sm">{expError}</span>
                        )
                      }
                    </div>
                  );
                })
              }
            </div>
          )
        })
      }
      <div className="">
        <button
          type="submit"
          className={
            `text-white float-right bg-primary-blue hover:bg-primary-blue 
                focus:ring-4 focus:outline-none focus:ring-primary-blue font-medium 
                rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center`}
        >
          Next
        </button>
      </div>
    </form>
    // </FormProvider>
  );
};

export default ProfileBasic;