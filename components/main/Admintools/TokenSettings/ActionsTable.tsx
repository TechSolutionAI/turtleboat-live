import { useRouter } from 'next/router';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import {
    useTable,
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination
} from "react-table";

const ActionsTable = ({
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
            data
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination
    );
    
    const router = useRouter();

    const handleRowClick = (rowData: any) => {
        router.push(`/dashboard/admin/tokensettings/token/${rowData.original.tokenId}`);
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
                <div className="overflow-x-auto">
                    <div className="align-middle inline-block min-w-full">
                        <div className="shadow overflow-hidden border-b border-gray-200">
                            <table
                                {...getTableProps()}
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
                                                    <div className={`${column.isCenter ? `block text-center` : `flex`} items-center justify-between min-h-[20px]`}>
                                                        {column.render("Header")}
                                                        <span>
                                                            {
                                                                column.isSorted ? column.isSortedDesc
                                                                ? <ArrowDropUpIcon sx={{ fontSize: "20px" }}/>
                                                                : <ArrowDropDownIcon sx={{ fontSize: "20px" }}/> : ""
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
                                                            className={`px-6 py-4 ${cell.column.isCenter ? `text-center` : ``}`}
                                                        >
                                                            {
                                                                cell.column.id == 'name' ?
                                                                    <a
                                                                        className='cursor-pointer'
                                                                        onClick={() => handleRowClick(row)}
                                                                    >
                                                                        <p>{cell.render("Cell")}</p>
                                                                    </a>
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

export default ActionsTable;