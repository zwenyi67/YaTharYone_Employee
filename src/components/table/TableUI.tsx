import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  TableOptions,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Row } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useState } from "react";
import TableLoadingBar from "./TableLoadingBar";
import TableToolbar from "./TableToolbar";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ColumnVisibilityType = {
  [key: string]: boolean;
};

interface TableUIProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  loading: boolean;
  header?: string;
  headerDescription?: string;
  children?: React.ReactNode;
  columnVisibility: ColumnVisibilityType;
  data: TData[] | undefined;
  sort?: boolean;
  search?: boolean;
  filterColumns?: string[] | [];
  columnFilterValue?: string;
  newCreate?: string;
  filterColumnsState?: boolean;
  globalFilterEnabled?: boolean;
  sortColumn?: string;
  noToolbar?: boolean;
  sortSelectNewLine?: boolean;
  toolbarClassNames?: string;
  tableHeaderClass?: string;
  tableRowClass?: string;
  tableCellClass?: string;
  selectOptions?: { label: string; value: string }[];
  sectionBelowToolbar?: React.ReactNode | undefined;
  opt?: Partial<TableOptions<TData>>;
}

export function TableUI<TData, TValue>({
  toolbarClassNames = "",
  tableHeaderClass = "",
  tableRowClass = "",
  tableCellClass = "",
  columns,
  loading,
  children,
  header,
  headerDescription,
  newCreate,
  data,
  globalFilterEnabled = true,
  columnVisibility,
  sort = true,
  search = true,
  noToolbar = false,
  filterColumns = [],
  columnFilterValue = "",
  filterColumnsState = false,
  sortColumn,
  sortSelectNewLine,
  selectOptions,
  sectionBelowToolbar = undefined,
  opt,
}: TableUIProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedOpt, setSelectedOpt] = useState<"Oldest" | "Newest">("Newest");
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    if (columnFilterValue) {
      setGlobalFilter(columnFilterValue);
    }
  }, [columnFilterValue]);

  useEffect(() => {
    if (selectedOpt) {
      setSorting([
        {
          id: sortColumn ?? "",
          desc: selectedOpt === "Newest",
        },
      ]);
    }
  }, [selectedOpt]);

  useEffect(() => {
    if (filterColumnsState) {
      setGlobalFilter("");
    }
    table.resetColumnFilters();
  }, [filterColumns]);

  //global filter custom function
  const customGlobalFilterFn = <TData,>(
    row: Row<TData>,
    columnId: string,
    filterValue: string
  ) => {
    const column = row
      .getVisibleCells()
      .find((cell) => cell.column.id === columnId);

    if (column?.column.columnDef.enableGlobalFilter === false) {
      return true;
    }

    const value = row.getValue(columnId);
    return rankItem(value?.toString() || "", filterValue).passed;
  };

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const clickPrevPage = () => {
    () => table.previousPage()
    setPageIndex(pageIndex - 1);
  }

  const clickNextPage = () => {
    () => table.nextPage();
    setPageIndex(pageIndex + 1);
  }

  const clickCustomPage = (pageIndex: number) => {
    () => table.setPageIndex(pageIndex);
    setPageIndex(pageIndex);
  }

  const clickPageSize = (e: any) => {
    const newPageSize = Number(e.target.value);
    table.setPageSize(newPageSize); // Update page size
    setPageSize(e.target.value)

  }
  const table = useReactTable<TData>({
    data: data || [],
    columns,
    globalFilterFn: customGlobalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Enable pagination
    onColumnFiltersChange: search && filterColumnsState ? setColumnFilters : undefined,
    getSortedRowModel: sort ? getSortedRowModel() : undefined,
    getFilteredRowModel: search ? getFilteredRowModel() : undefined,
    state: {
      sorting: sort ? sorting : undefined,
      columnVisibility,
      globalFilter: search && globalFilterEnabled ? globalFilter : undefined,
      columnFilters: search && filterColumnsState ? columnFilters : undefined,
      pagination: {
        pageIndex: pageIndex,
        pageSize: pageSize,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    ...opt,
  });

  return (
    <div>
      {!noToolbar && (
        <TableToolbar
          filterColumns={filterColumns}
          setColumnFilters={setColumnFilters}
          classNames={toolbarClassNames}
          headerDescription={headerDescription}
          search={search}
          sort={sort}
          setSelectedOpt={setSelectedOpt}
          header={header}
          newCreate={newCreate}
          selectedOpt={selectedOpt}
          setGlobalFilter={setGlobalFilter}
          globalFilter={globalFilter}
          sortSelectNewLine={sortSelectNewLine}
          selectOptions={selectOptions}
        >
          {children}
        </TableToolbar>
      )}
      {sectionBelowToolbar}
      <Table>
        {/* Table Header */}
        <TableHeader className={tableHeaderClass}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <TableHead
                  key={header.id}
                  className={`${index === 0 && tableHeaderClass ? "rounded-tl-2xl" : ""
                    } ${index === columns.length - 2 && tableHeaderClass
                      ? "rounded-tr-2xl"
                      : ""
                    }`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} className="p-0 align-top">
                <TableLoadingBar />
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className={tableRowClass}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={tableCellClass}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {table.getRowModel().rows?.length > 0 &&
        <div className="flex justify-between items-center mt-5">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <div className="flex justify-end items-center gap-2">
            {/* Page Size Dropdown */}
            <div>
              <select
                id="page-size"
                className="px-3 py-1 bg-gray-200 rounded"
                value={table.getState().pagination.pageSize}
                onChange={(e) => clickPageSize(e)}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <button
              onClick={clickPrevPage}
              disabled={!table.getCanPreviousPage()}
              className="p-1 bg-gray-200 rounded disabled:opacity-50"
            >
              <ChevronLeft />
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2">
              {Array.from({ length: table.getPageCount() }).map((_, pageIndex) => (
                <button
                  key={pageIndex}
                  onClick={() => clickCustomPage(pageIndex)}
                  className={`px-3 py-1 rounded ${pageIndex === table.getState().pagination.pageIndex
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                    }`}
                >
                  {pageIndex + 1}
                </button>
              ))}
            </div>

            <button
              onClick={clickNextPage}
              disabled={!table.getCanNextPage()}
              className="p-1 bg-gray-200 rounded disabled:opacity-50"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      }
    </div>
  );
}

export default TableUI;
