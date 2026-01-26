import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import paths from "@/router/path";
import { Category } from "@/types/category";
import { Badge } from "@/components/badge";

// const users = [];

export default function CategoryList({ data }: { data: Category[] }) {
  return (
    <Table dense grid striped>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader className="hidden md:block">Description</TableHeader>
          <TableHeader>Active</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {data &&
          data.length > 0 &&
          data.map((item) => (
            <TableRow
              key={item._id}
              href={paths.dashboard.inventory.categories.edit(item._id!)}
            >
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="hidden md:block">
                {item.description}
              </TableCell>
              <TableCell className="text-zinc-500 ">
                <Badge color={item.isActive ? "green" : "red"}>
                  {item.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
