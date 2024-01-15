import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Course } from '@/types/course.type';
import Spinner from './Spinner';

interface Option {
    value: string;
    label: string;
}

const CourseSelect = ({ setCourse, courseValue }: any) => {
    const [selectedCourse, setSelectedCourse] = useState<Option | null>(courseValue != undefined ? courseValue : null);
    const [courses, setCourses] = useState<Option[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getCourses = async () => {
        let courseList: Option[] = [];
        setIsLoading(true);
        const response = await fetch('/api/courses', {
            method: 'GET'
        });

        if (!response.ok) {
            setIsLoading(false);
            const { err } = await response.json();
            console.log(err)
        } else {
            setIsLoading(false);
            const { courses } = await response.json();
            courseList = courses.map((course: Course, index: number) => {
                let courseItem = {
                    value: course._id,
                    label: course.title
                }
                return courseItem;
            })
        }
        setCourses(courseList)
    };

    useEffect(() => {
        getCourses();
    }, []);

    return (
        isLoading ?
            <Spinner />
            :
            <Select
                options={courses}
                value={selectedCourse}
                placeholder={`Select Course ...`}
                isSearchable={true}
                onChange={(course) => {
                    setSelectedCourse(course)
                    setCourse(course?.value)
                }}
                onInputChange={(text) => setSearchText(text)}
                filterOption={(course, inputValue) => {
                    const label = course.label.toLowerCase();
                    const value = course.value.toLowerCase();
                    const search = inputValue.toLowerCase();
                    return label.includes(search) || value.includes(search);
                }}
                styles={{
                    control: (provided, state) => ({
                        ...provided,
                        borderRadius: '5px',
                        padding: '3px',
                        border: state.isFocused ? '1px solid #2E65F3' : '1px solid #2E65F3',
                    }),
                    option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected ? '#2E65F3' : 'transparent',
                        color: state.isSelected ? 'white' : '#4a5568',
                        ':hover': {
                            backgroundColor: state.isSelected ? '#2E65F3' : '#e2e8f0',
                            color: state.isSelected ? 'white' : '#4a5568'
                        }
                    })
                }}
            />
    );
};

export default CourseSelect;
