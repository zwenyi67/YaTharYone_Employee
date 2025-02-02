import TableHeaderCell from "@/components/table/TableHeaderCell";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import ManageColumn from "./ManageColumn";
import { GetTablesType } from "@/api/table/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const baseIndex = 'fields.table-management'

export const columns: ColumnDef<GetTablesType>[] = [
  {
    accessorKey: "number",
    header: () => <TableHeaderCell>{`${baseIndex}.number`}</TableHeaderCell>,
    cell: ({ table, row }) => {
      const sortedIndex =
        table.getSortedRowModel().rows.findIndex((r) => r.id === row.id) + 1;

      return <div>{sortedIndex}</div>;
    },
  },
  {
    accessorKey: "tableNo",
    header: () => <TableHeaderCell>{`${baseIndex}.tableNo`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.table_no}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "capacity",
    header: () => <TableHeaderCell className="text-center">{`${baseIndex}.capacity`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div className="text-center">{row.original.capacity}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <TableHeaderCell>{`${baseIndex}.created_at`}</TableHeaderCell>,
    cell: ({ row }) => {
      return (
        <div>
          {formatDate(row.original.created_at.toString(), "dd/MM/yyyy HH:mm")}
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: () => (
      <TableHeaderCell className="text-center">{`fields.actions`}</TableHeaderCell>
    ),
    cell: (data) => {
      return <ManageColumn data={data.row.original} />;
    },
  },
];
