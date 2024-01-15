import { useRouter } from "next/router";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import UserAvatar from "@/components/UserAvatar";

import {
  useTable,
  useGlobalFilter,
  useFilters,
  useSortBy,
  usePagination,
} from "react-table";

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

const RequestsTable = ({
  columns,
  data,
  handleApproved,
}: {
  columns: any[];
  data: any[];
  handleApproved: Function;
}) => {
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
    router.push(`/dashboard/admin/member/${rowData.values.action}`);
  };

  const handleProfileClick = (rowData: any) => {
    router.push(`/dashboard/admin/member/${rowData.original.userId}`);
  };

  const handleApprove = (rowData: any) => {
    handleApproved({
      id: rowData.original.rewardId,
      userId: rowData.original.userId,
      email: rowData.original.email,
      cid: rowData.original.action,
    });
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
                          className={`group px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          <div
                            className={`${
                              column.isCenter ? `block text-center` : `flex`
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
                              className={`px-2 py-2 ${
                                cell.column.isCenter ? `text-center` : ``
                              }`}
                            >
                              {cell.column.id == "dates" ? (
                                <>
                                  {cell.value.map(
                                    (item: string, idx: number) => {
                                      return (
                                        <div
                                          key={row.values.action + "-" + idx}
                                          className={`${
                                            idx == 0 ? "mt-0" : "mt-1"
                                          } justify-center flex flex-col text-center px-2 sm:py-2 py-1       rounded-full min-w-fit bg-tertiary-green text-secondary-green border-l-1 border-tertiary-green w-[120px]`}
                                        >
                                          <span className="self-center text-sm font-medium">
                                            {item}
                                          </span>
                                        </div>
                                      );
                                    }
                                  )}
                                </>
                              ) : cell.column.id == "action" ? (
                                <DoneAllIcon
                                  className="text-secondary-green cursor-pointer"
                                  onClick={() => handleApprove(row)}
                                />
                              ) : cell.column.id == "image" ? (
                                // <a
                                //     onClick={() => handleProfileClick(row)}
                                //     className="cursor-pointer flex items-center justify-center w-full h-16"
                                // >
                                //     <Image
                                //         alt="user"
                                //         src={row.original.image ?? "/user.png"}
                                //         width={30}
                                //         height={30}
                                //         className="rounded-full cursor-pointer"
                                //     />
                                //     <span className="w-[120px]">{row.original.user}</span>
                                // </a>
                                <UserAvatar
                                  user={row.original}
                                  size={33}
                                  classes={
                                    "cursor-pointer flex items-center justify-center w-full h-16"
                                  }
                                />
                              ) : cell.column.id == "email" ? (
                                <div className="flex items-center justify-center w-fit h-16">
                                  {cell.value}
                                </div>
                              ) : (
                                <p
                                  className={`${
                                    cell.column.id == "title" ||
                                    cell.column.id == "description" ||
                                    cell.column.id == "note"
                                      ? "max-w-[250px]"
                                      : ""
                                  }`}
                                >
                                  {cell.render("Cell")}
                                </p>
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

export default RequestsTable;
