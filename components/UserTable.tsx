import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import shortid from "shortid";

import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import {
  Industries,
  Hobbies,
  Professions,
} from "@/database/advancedprofilequestions";

import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useFilters,
  useSortBy,
  usePagination,
} from "react-table";
import StatusItem from "./StatusItem";
import UserAvatar1 from "./UserAvatar1";

// Define a default UI for filtering
const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: {
  preGlobalFilteredRows: any;
  globalFilter: any;
  setGlobalFilter: any;
}) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value: any) => {
    setGlobalFilter(value || undefined);
  }, 200);
  return (
    <label className="flex gap-x-2 items-baseline">
      <span className="text-gray-700">Search: </span>
      <input
        type="text"
        className={`mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </label>
  );
};

export const PageButton = ({
  children,
  className,
  onClick,
  disabled,
}: {
  children: any;
  className: any;
  onClick: Function;
  disabled: boolean;
}) => {
  return (
    <button
      type="button"
      className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${className}`}
      disabled={disabled}
      onClick={() => onClick}
    >
      {children}
    </button>
  );
};

const Tags = ({ field, data }: { field: string; data: string[] }) => {
  let list: any[] = [];

  switch (field) {
    case "industries":
      list = Industries;
      break;
    case "hobbies":
      list = Hobbies;
      break;
    case "professions":
      list = Professions;
      break;
  }

  return (
    <>
      {data.map((tag: string, index: number) => {
        const tagInfo = list.find((item) => item.value == tag);
        return (
          <div
            key={shortid()}
            className="px-1 py-1 rounded-lg cursor-pointer m-1 bg-secondary-red border-secondary-red text-white text-center"
          >
            {tagInfo.desc}
          </div>
        );
      })}
    </>
  );
};

const UserTable = ({
  columns,
  data,
  handleRoleSwitched,
  handleDailyDigestSwitched,
  handleDeleted,
}: {
  columns: any[];
  data: any[];
  handleRoleSwitched: Function;
  handleDailyDigestSwitched: Function;
  handleDeleted: Function;
}) => {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    // canPreviousPage,
    // canNextPage,
    // pageOptions,
    // pageCount,
    // gotoPage,
    // nextPage,
    // previousPage,
    // setPageSize,
    state,
    // preGlobalFilteredRows,
    // setGlobalFilter
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
    router.push(`/dashboard/admin/member/${rowData.values.action}`);
  };

  const handleProfileClick = (rowData: any) => {
    router.push(`/dashboard/admin/member/${rowData.values.action}`);
  };

  const handleRoleSwitch = (
    event: React.ChangeEvent<HTMLInputElement>,
    rowData: any
  ) => {
    const role = event.target.checked ? "admin" : "member";
    handleRoleSwitched({ id: rowData.values.action, data: { role: role } });
  };

  const handleDailyDigestSwitch = (
    event: React.ChangeEvent<HTMLInputElement>,
    rowData: any
  ) => {
    handleDailyDigestSwitched({ id: rowData.values.action, data: { dailyDigestEnabled: event.target.checked } });
  };

  const handleDelete = (rowData: any) => {
    handleDeleted({ id: rowData.values.action });
  };

  // Render the UI for your table
  return (
    <>
      {headerGroups.map((headerGroup: any) =>
        headerGroup.headers.map((column: any) =>
          column.Filter ? (
            <div key={"filter-" + column.id}>{column.render("Filter")}</div>
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
                    <tr
                      key={"headerGroup" + index}
                      {...headerGroup.getHeaderGroupProps()}
                    >
                      {headerGroup.headers.map((column: any) => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        <th
                          key={column.id}
                          data-key={column.id}
                          scope="col"
                          className={`group px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          <div
                            className={`${column.isCenter ? `block text-center` : `flex`
                              } items-center justify-between min-h-[20px]`}
                          >
                            {column.render("Header")}
                            <span>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <ArrowDropUpIcon sx={{ fontSize: "20px" }} />
                                ) : (
                                  <ArrowDropDownIcon
                                    sx={{ fontSize: "20px" }}
                                  />
                                )
                              ) : (
                                ""
                              )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="bg-white divide-y divide-gray-200"
                >
                  {rows.map((row: any, i: number) => {
                    // new
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        key={row.values.action}
                        className="hover:bg-gray-100"
                      >
                        {row.cells.map((cell: any, cellId: number) => {
                          return (
                            <td
                              key={row.values.action + "-" + cell.column.id}
                              {...cell.getCellProps()}
                              className={`px-3 py-2 ${cell.column.isCenter ? `text-center` : ``
                                }`}
                            >
                              {cell.column.id == "status" ? (
                                <StatusItem
                                  active={cell.value}
                                  label={`${cell.value ? `Completed` : `Incompleted`
                                    }  `}
                                />
                              ) : cell.column.id == "admin" ? (
                                <input
                                  type="checkbox"
                                  id={row.original.action}
                                  name={row.original.action}
                                  value={row.original.admin}
                                  checked={row.original.admin}
                                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-blue"
                                  onChange={(e) => handleRoleSwitch(e, row)}
                                />
                              ) : cell.column.id == "dailyDigestEnabled" ? (
                                <input
                                  type="checkbox"
                                  id={row.original.action}
                                  name={row.original.action}
                                  value={row.original.dailyDigestEnabled}
                                  checked={row.original.dailyDigestEnabled}
                                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-blue"
                                  onChange={(e) => handleDailyDigestSwitch(e, row)}
                                />
                              ) : cell.column.id == "action" ? (
                                <DeleteIcon
                                  className="text-secondary-red cursor-pointer"
                                  onClick={() => handleDelete(row)}
                                />
                              ) : cell.column.id == "image" ? (
                                <a
                                  onClick={() => handleProfileClick(row)}
                                  className="cursor-pointer flex items-center justify-center w-full h-16"
                                >
                                  <UserAvatar1
                                    user={row.original}
                                    size={40}
                                    classes="rounded-full cursor-pointer" 
                                  />
                                </a>
                              ) : cell.column.id == "name" ? (
                                <a
                                  onClick={() => handleRowClick(row)}
                                  className="cursor-pointer flex items-center w-full h-16"
                                >
                                  {cell.render("Cell")}
                                </a>
                              ) : cell.column.id == "professions" ||
                                cell.column.id == "industries" ||
                                cell.column.id == "hobbies" ? (
                                <Tags
                                  field={cell.column.id}
                                  data={cell.value}
                                />
                              ) : (
                                cell.render("Cell")
                              )}
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
};

export default UserTable;
