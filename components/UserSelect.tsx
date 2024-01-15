import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { components, } from 'react-select';
import Image from "next/image";
import Spinner from './Spinner';

interface Option {
    value: string;
    label: string;
    image: string;
    email: string;
}

const OptionComponent = (props: any) => {
    return (
        <components.Option {...props}>
            <div className='flex items-center'>
                <Image
                    alt="user"
                    src={props.data.image ?? "/user.png"}
                    width={25}
                    height={25}
                    className="rounded-full cursor-pointer flex"
                />
                <span className='px-2'>
                    {props.children}
                </span>
            </div>
        </components.Option>
    );
};

const SelectedOptionComponent = ({ data, removeProps }: any) => (
    <components.MultiValueLabel {...removeProps}>
        <div className='flex items-center p-1'>
            <Image
                alt="user"
                src={data.image ?? "/user.png"}
                width={25}
                height={25}
                className="rounded-full cursor-pointer flex"
            />
            <span className='px-2 text-sm'>
                {data.label}
            </span>
        </div>
    </components.MultiValueLabel>
);

const SelectedSingleOptionComponent = (props: any) => (
    <components.SingleValue {...props}>
        <div className='flex items-center p-1'>
            <Image
                alt="user"
                src={props.data.image ?? "/user.png"}
                width={25}
                height={25}
                className="rounded-full cursor-pointer flex"
            />
            <span className='px-2 text-sm'>
                {props.data.label}
            </span>
        </div>
    </components.SingleValue>
);

const UserSelect = ({
    setData,
    multiple,
    disabled,
    selectedList,
    disabledList,
    limit,
    type
}: {
    setData: any,
    multiple: boolean,
    disabled: boolean,
    selectedList: Option[],
    disabledList: Option[],
    limit: number,
    type: String
}) => {
    const [selectedUser, setSelectedUser] = useState<Option[] | null>(selectedList);
    const [users, setUsers] = useState<Option[]>([]);
    const [options, setOptions] = useState<Option[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isMultiple, setIsMultiple] = useState<boolean>(multiple);
    const [error, setError] = useState("");

    const handleSelectedOptionsChange = (selected: any) => {
        if (limit == -1 || selected.length <= limit) {
            setSelectedUser(selected);
            setData(selected);
            setError('');
        } else {
            setError(`You can't select more than ${limit} user${limit > 1 ? 's' : ''}.`)
        }
    };

    const getUsers = async () => {
        let userList: any[] = [];
        const response = await fetch('/api/users', {
            method: 'GET'
        });

        if (!response.ok) {
            const { err } = await response.json();
            console.log(err)
        } else {
            const { users } = await response.json();
            userList = users.map((user: any, index: number) => {
                let userItem = {
                    email: user.email,
                    label: user.name,
                    image: user.image,
                    value: user._id
                }
                return userItem;
            })
            setUsers(userList)
            // setOptions(userList)
            setOptions(userList.filter(userItem =>
                !disabledList.some(selectedItem => userItem.value === selectedItem.value && userItem.label === selectedItem.label)
            ));
        }
    };

    useEffect(() => {
        getUsers();
        setSelectedUser(selectedList);
    }, []);

    useEffect(() => {
        setOptions(users.filter(userItem =>
            !disabledList.some(selectedItem => userItem.value === selectedItem.value && userItem.label === selectedItem.label)
        ));
        if (disabledList.length == 0 && type == "mentor") {
            setSelectedUser([])
        }
    }, [disabledList]);

    return (
        isLoading ?
            <Spinner />
            :
            <>
                <Select
                    options={options}
                    closeMenuOnSelect={!isMultiple}
                    components={{
                        Option: OptionComponent,
                        MultiValueLabel: SelectedOptionComponent,
                        SingleValue: SelectedSingleOptionComponent
                    }}
                    value={selectedUser}
                    isMulti={isMultiple}
                    isDisabled={disabled}
                    onChange={handleSelectedOptionsChange}
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
                        }),
                        multiValueRemove: (base) => ({
                            ...base,
                            ':hover': {
                                backgroundColor: 'transparent',
                                color: '#F32D2D'
                            }
                        }),
                    }}
                />
                <div className='p-1'>
                    <span className="text-secondary-red text-sm">
                        {error}
                    </span>
                </div>
            </>
    );
};

export default UserSelect;
