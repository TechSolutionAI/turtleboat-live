import { useState } from 'react';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ImportExportIcon from '@mui/icons-material/ImportExport';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CircleOfResourceModal from '@/components/CircleOfResourceModal';
import {
    useTable,
    useGlobalFilter,
    useAsyncDebounce,
    useFilters,
    useSortBy,
    usePagination
} from "react-table";
import { CircleOfResource } from '@/types/circleofresource.type';
import Swal from "sweetalert2"

const CircleOfResourcesTable = ({
    columns,
    tableData,
    setTableData,
    circleOfResources,
    isEditable
}: {
    columns: any[],
    tableData: any[],
    setTableData: Function,
    circleOfResources: any[],
    isEditable: boolean
}) => {
    const [isOpenCircleOfResourceModal, setIsOpenCircleOfResourceModal] = useState<boolean>(false);
    const [circleOfResource, setCircleOfResource] = useState<CircleOfResource>({
        circleDistance: 1,
        pointOfContact: "",
        typeOfAsset: "",
        descriptionOfAsset: "",
        notes: "",
    })
    const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
    const [isNew, setIsNew] = useState<boolean>(true);
    const [isAsc, setIsAsc] = useState<number>(1);

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
            data: tableData
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const handleAddNew = () => {
        if (isNew) {
            setTableData([{ ...circleOfResource, remove: 1 }, ...tableData]);
        } else {
            let temp = [...tableData]
            temp[selectedRowIndex] = { ...circleOfResource, remove: 1 };
            setTableData(temp)
        }
        setIsOpenCircleOfResourceModal(false);
    }

    const deleteUser = async (id: number) => {
        let temp = [...tableData];
        temp.splice(id, 1);
        setTableData(temp);
        return { success: true, err: "" };
    }

    const handleRemoveRow = (row: any) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const result = await deleteUser(row.id);
                if (result.success) {
                    Swal.fire(
                        'User deleted successfully!',
                        `User deleted successfully!`,
                        'success'
                    );
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: result.err,
                    })
                }
            }
        })
    }

    const handleRowClick = (row: any) => {
        if (isEditable) {
            setCircleOfResource({
                circleDistance: row.values.circleDistance,
                pointOfContact: row.values.pointOfContact,
                typeOfAsset: row.values.typeOfAsset,
                descriptionOfAsset: row.values.descriptionOfAsset,
                notes: row.values.notes,
            });
            setSelectedRowIndex(row.index);
            setIsNew(false);
            setIsOpenCircleOfResourceModal(true)
        }
    };

    const handleSortRow = () => {
        let temp = [...tableData];
        setIsAsc(-isAsc);
        isAsc > 0 ? (
            temp.sort((a, b) => b.pointOfContact.localeCompare(a.pointOfContact))
        ) : (
            temp.sort((a, b) => a.pointOfContact.localeCompare(b.pointOfContact))
        );
        setTableData(temp);
    }

    const onClickAddBtn = () => {
        setCircleOfResource({
            circleDistance: 1,
            pointOfContact: "",
            typeOfAsset: "Hard Skill",
            descriptionOfAsset: "",
            notes: "",
        });
        setIsNew(true);
        setIsOpenCircleOfResourceModal(true);
    }

    return (
        <>
            {headerGroups.map((headerGroup: any) =>
                headerGroup.headers.map((column: any) =>
                    column.Filter ? (
                        <div key={'filter-' + column.id}>{column.render("Filter")}</div>
                    ) : null
                )
            )}
            <div className="mt-10 flex flex-col">
                <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className='flex min-w-full justify-end items-center mb-5'>
                            {/* <div className='cursor-pointer' onClick={handleSortRow}>
                                <ImportExportIcon className='m-auto font-Inter mr-1' fontSize='medium' /><span>Sort</span>
                            </div> */}
                            {
                                isEditable && (
                                    <div className='cursor-pointer flex items-center' onClick={onClickAddBtn}>
                                        <AddCircleIcon className='m-auto font-Inter mr-1' fontSize='medium' /><span>Add Row</span>
                                    </div>
                                )
                            }
                        </div>
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table
                                {...getTableProps()}
                                style={{
                                    tableLayout: 'fixed'
                                }}
                                className="min-w-full divide-y divide-gray-200"
                            >
                                <thead className="bg-gray-50">
                                    {headerGroups.map((headerGroup: any, index: number) => (
                                        <tr key={"headerGroup" + index} {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map((column: any) => (
                                                <th
                                                    key={column.id}
                                                    data-key={column.id}
                                                    scope="col"
                                                    className={`group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                                    {...column.getHeaderProps(
                                                        column.getSortByToggleProps()
                                                    )}
                                                >
                                                    <div className={`${column.isCenter ? `block` : `flex`} items-center justify-between min-h-[20px]`}>
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
                                            <tr
                                                key={i}
                                                {...row.getRowProps()}
                                                className='hover:bg-gray-100 w-full cursor-pointer'
                                                onClick={() => { handleRowClick(row) }}
                                            >
                                                {row.cells.map((cell: any, cellId: number) => {
                                                    return (
                                                        <td
                                                            key={i + "-" + cell.column.id}
                                                            {...cell.getCellProps()}
                                                            style={{
                                                                width: (cell.column.id === "descriptionOfAsset" || cell.column.id == "notes") ? '25%' : "auto",
                                                                maxWidth: (cell.column.id === "descriptionOfAsset" || cell.column.id == "notes") ? '25%' : "auto",
                                                                wordBreak: (cell.column.id === "descriptionOfAsset" || cell.column.id == "notes") ? 'break-word' : "normal",
                                                                wordWrap: (cell.column.id === "descriptionOfAsset" || cell.column.id == "notes") ? 'break-word' : "normal",
                                                            }}
                                                            className={`px-6 py-4 text-left`}
                                                        >
                                                            {
                                                                cell.column.id == 'circleDistance'
                                                                    ? <button style={{ backgroundColor: circleOfResources[cell.value].color }} className="text-white px-3 py-1 rounded-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 cursor-default">{circleOfResources[cell.value].name}</button>
                                                                    : cell.column.id == 'typeOfAsset'
                                                                        ? <button className="bg-gray-400 text-white px-3 py-1 w-auto rounded-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 cursor-default">
                                                                            {cell.value}
                                                                        </button>
                                                                        : cell.column.id == 'remove'
                                                                            ? isEditable && <DeleteIcon
                                                                                className='text-secondary-red cursor-pointer'
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleRemoveRow(row);
                                                                                }} />
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
            <CircleOfResourceModal
                isNew={isNew}
                showModal={isOpenCircleOfResourceModal}
                closeFunc={() => { setIsOpenCircleOfResourceModal(false); }}
                data={circleOfResource}
                setData={setCircleOfResource}
                addCircleOfResource={handleAddNew}
            />
        </>
    );
}

export default CircleOfResourcesTable;
