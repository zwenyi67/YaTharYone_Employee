import TableHeaderCell from "@/components/table/TableHeaderCell";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import ManageColumn from "./ManageColumn";
import { GetInventoriesType } from "@/api/inventory/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const baseIndex = 'fields.inventory-management.inventory'

export const columns: ColumnDef<GetInventoriesType>[] = [
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
    accessorKey: "name",
    header: () => <TableHeaderCell>{`${baseIndex}.name`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.name}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "category",
    header: () => <TableHeaderCell>{`${baseIndex}.category`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.inventory_item_category.name}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "current_stock",
    header: () => <TableHeaderCell>{`${baseIndex}.current_stock`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.current_stock} {row.original.unit_of_measure}</div>;
    },
  },
  {
    accessorKey: "min_stock_level",
    header: () => <TableHeaderCell>{`${baseIndex}.min_stock_level`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.min_stock_level} {row.original.unit_of_measure}</div>;
    },
  },
  {
    accessorKey: "reorder_level",
    header: () => <TableHeaderCell>{`${baseIndex}.reorder_level`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.reorder_level} {row.original.unit_of_measure}</div>;
    },
  },
  {
    accessorKey: "expiry_period_inDay",
    header: () => <TableHeaderCell>{`${baseIndex}.expiry_period_inDay`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>{row.original.expiry_period_inDay}</div>;
    },
  },
  {
    accessorKey: "created_at",
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
