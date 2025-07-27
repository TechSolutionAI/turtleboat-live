import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import shortid from "shortid";
import AddIcon from '@mui/icons-material/Add';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { formatDate } from '@/utils/utils';

import {
    useTable,
    useGlobalFilter,
    useAsyncDebounce,
    useFilters,
    useSortBy,
    usePagination
} from "react-table";

import Spinner from '@/components/Spinner';

const Index = () => {
    const { data: session } = useSession();
    const user = session?.user as User;
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [brainstorms, setBrainStorms] = useState<any[]>([])

    useEffect(() => {
        document.title = "Coffee Chat Admin - Turtle Boat"
        getList()
    }, []);

    const columns = useMemo(
        () => [
            {
                Header: "Name",
                accessor: "name",
                isCenter: false,
            },
            {
                Header: "Last Updated",
                accessor: "updatedAt",
                isCenter: true,
                disableSortBy: true
            },
            {
                Header: "Created On",
                accessor: "createdAt",
                isCenter: true,
                disableSortBy: true
            },
            {
                Header: "Status",
                accessor: "isCompleted",
                isCenter: true,
                disableSortBy: true
            },
            // {
            //     Header: "Actions",
            //     accessor: "action",
            //     isCenter: true,
            //     disableSortBy: true
            // },
        ],
        []
    );

    const addBrainstorm = () => {
        router.push(`/dashboard/toolbox/lemonade/add`);
    }
    const getList = async () => {
        setIsLoading(true);
        const response = await fetch(`/api/lemonades`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            setIsLoading(false);
            const { err } = await response.json();
            console.log(err)
        } else {
            const { lemonades } = await response.json();
            setBrainStorms(lemonades);
            setIsLoading(false);
        }
    };

    return (
        <>
            {
                isLoading ?
                    <div className="grid place-items-center h-screen">
                        <Spinner text='Loading ...' />
                    </div> :
                    <>
                        {/* <div className='flex justify-between items-center'>
                            <button
                                className="flex items-center justify-center bg-primary-blue text-[white] w-[133px] h-[50px] text-[14px] font-Inter rounded-[50px]"
                                onClick={() => addBrainstorm()}
                            >
                                <AddIcon />{' Create'}
                            </button>
                        </div> */}
                        <div className='flex justify-between items-center mt-5'>
                            <h4 className='truncate text-[20px] font-bold font-Inter py-0'>Brainstorms ({brainstorms.length})</h4>
                            <a></a>
                        </div>
                        {
                            brainstorms.length > 0 ?
                                <BrainStormsTable columns={columns} data={brainstorms} />
                                : <>No results</>
                        }
                    </>
            }
        </>
    )
}

const StatusItem = ({
    label,
    active,
}: {
    label: string,
    active?: boolean,
}) => {
    return (
        <div
            className={
                `justify-center
           flex flex-col 
           text-center
           px-[15px]
           sm:py-3 py-4
           rounded-full
           ${active ? "bg-tertiary-green text-secondary-green border-l border-tertiary-green" : "bg-primary-blue text-white border-l border-primary-blue"}`
            }
        >
            <span className="self-center text-sm font-medium">{label}</span>
        </div>
    );
}

const BrainStormsTable = ({
    columns,
    data,
}: {
    columns: any[],
    data: any[],
}) => {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
        state,
    } = useTable(
        {
            columns,
            data,
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const router = useRouter();

    const handleRowClick = (rowData: any) => {
        router.push(`/dashboard/admin/lemonade/${rowData.original._id}`);
    };

    // Render the UI for your table
    return (
        <>
            {headerGroups.map((headerGroup: any) =>
                headerGroup.headers.map((column: any) =>
                    column.Filter ? (
                        <div key={'filter-' + column.id}>{column.render("Filter")}</div>
                    ) : null
                )
            )}
            <div className="mt-2 flex flex-col">
                <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table
                                {...getTableProps()}
                                className="min-w-full divide-y divide-gray-200"
                            >
                                <thead className="bg-gray-50">
                                    {headerGroups.map((headerGroup: any, index: number) => (
                                        <tr key={"headerGroup" + index} {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map((column: any) => (
                                                // Add the sorting props to control sorting. For this example
                                                // we can add them into the header props
                                                <th
                                                    key={column.id}
                                                    data-key={column.id}
                                                    scope="col"
                                                    className={`group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                                    {...column.getHeaderProps(
                                                        column.getSortByToggleProps()
                                                    )}
                                                >
                                                    <div className={`${column.isCenter ? `block text-center` : `flex`} items-center justify-between min-h-[20px]`}>
                                                        {column.render("Header")}
                                                        <span>
                                                            {
                                                                column.isSorted ? column.isSortedDesc
                                                                    ? <ArrowDropUpIcon sx={{ fontSize: "20px" }} />
                                                                    : <ArrowDropDownIcon sx={{ fontSize: "20px" }} /> : ""
                                                            }
                                                        </span>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody
                                    {...getTableBodyProps()}
                                    className="bg-white divide-y divide-gray-200 font-Inter"
                                >
                                    {rows.map((row: any, i: number) => {
                                        // new
                                        prepareRow(row);
                                        return (
                                            <tr {...row.getRowProps()} key={i} className='hover:bg-gray-100'>
                                                {row.cells.map((cell: any, cellId: number) => {
                                                    return (
                                                        <td
                                                            key={i + "-" + cell.column.id}
                                                            {...cell.getCellProps()}
                                                            className={`px-6 py-4 whitespace-wrap ${cell.column.isCenter ? `text-center` : ``}`}
                                                        >
                                                            {
                                                                cell.column.id == 'updatedAt' || cell.column.id == 'createdAt'
                                                                    ?
                                                                    formatDate(cell.value)
                                                                    : cell.column.id == 'name' ?
                                                                        <>
                                                                            <a
                                                                                className='cursor-pointer font-bold'
                                                                                onClick={() => handleRowClick(row)}
                                                                            >
                                                                                {cell.render("Cell")}
                                                                            </a>
                                                                            <br />
                                                                            {
                                                                                row.original.participants.map((participant: any, index: number) => {
                                                                                    return (
                                                                                        <span key={shortid()}>
                                                                                            {
                                                                                                index + 1 == row.original.participants.length ?
                                                                                                    participant.name : participant.name + ", "
                                                                                            }
                                                                                        </span>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </>
                                                                        : cell.column.id == 'isCompleted' ?
                                                                            <StatusItem active={cell.value} label={`${cell.value ? `Completed` : `Active`}  `} />
                                                                            : cell.render("Cell")
                                                            }
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Index;