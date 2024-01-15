import React, { useState, useEffect } from 'react';
import { categories } from '@/database/modules';

const CheckBoxList = ({
    setItem,
    setItemError,
    item,
    register,
}: {
    setItem: Function,
    setItemError: Function,
    item: string,
    register: Function
}) => {
    const selectableData: Array<string> = categories.map(item => {
        return item.value
    });

    const [isChecked, setIsChecked] = useState<number>(-1);

    useEffect(() => {
        setIsChecked(selectableData.indexOf(item));
    }, [])

    const handleOnChange = (e: any) => {
        let index = selectableData.indexOf(e.target.value);

        //
        if (item == e.target.value) {
            setIsChecked(-1);
            setItem('');
            setItemError('This field is required');
        } else {
            setIsChecked(index);
            setItem(e.target.value);
            setItemError('');
        }

        //

        // if (isChecked[index]) {
        //     let temp = new Array();
        //     selectableData.map((item, key) => {
        //         temp[key] = false;
        //     })
        //     setIsChecked(temp);
        //     setItem('');
        // }
        // else {
        //     let temp = new Array();
        //     selectableData.map((item, key) => {
        //         if (key === index) temp[key] = true;
        //         else temp[key] = false;
        //     })
        //     setIsChecked(temp);
        //     setItem(selectableData[index]);
        // }

        // if (isChecked === index) {
        //     setIsChecked(-1);
        //     setItem('');
        // }
        // else {
        //     setIsChecked(index);
        //     console.log(selectableData[isChecked])
        //     setItem(selectableData[isChecked]);
        // }
    }

    return (
        <div className="grid sm:grid-cols-3 grid-cols-2 gap-3 ml-[10px] sm:mt-[35px] mt-[10px]">
            {
                selectableData.map((item, index) => {
                    return (
                        <div className='flex items-center font-Inter font-bold text-[16px]' key={index}>
                            <input
                                type='checkbox'
                                id={item}
                                value={item}
                                checked={isChecked === index ? true : false}
                                onChange={handleOnChange}
                                className='w-[20px] h-[20px]'
                            />
                            <label htmlFor={item} className='ml-[15px]'>{item}</label>
                        </div>
                    )
                })
            }
            <input type="hidden" {...register("item")} value={item} id="item" />
        </div>
    )
}

export default CheckBoxList;