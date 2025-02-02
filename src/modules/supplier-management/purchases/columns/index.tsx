import TableHeaderCell from "@/components/table/TableHeaderCell";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import ManageColumn from "./ManageColumn";
import { GetPurchaseType } from "@/api/purchase-item/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const baseIndex = 'fields.supplier-management.purchases'

export const columns: ColumnDef<GetPurchaseType>[] = [
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
    accessorKey: "profile",
    header: () => <TableHeaderCell>{`${baseIndex}.supplier`}</TableHeaderCell>,
    cell: ({ row }) => {
      const profileUrl = `http://127.0.0.1:8000${row.original.supplier.profile}`;
      return (
        <div className="flex justify-center flex-col">
          <img className=""
            src={profileUrl} 
            alt="profile"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
          <div className="mt-2">{row.original.supplier.name}</div>
        </div>
      );
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "total_amount",
    header: () => <TableHeaderCell>{`${baseIndex}.total_amount`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div>${row.original.total_amount}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "purchase_note",
    header: () => <TableHeaderCell className="text-center">{`${baseIndex}.purchase_note`}</TableHeaderCell>,
    cell: ({ row }) => {
      return <div className="text-center">{row.original.purchase_note}</div>;
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
