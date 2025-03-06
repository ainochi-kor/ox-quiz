import { getQuizzes, Quiz } from "@/api/quiz.api";
import quizListColumns from "@/components/quiz/table/quizlist.column";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface QuizListTableProps {
  handleRowClick: (quiz: Quiz) => void;
}

const QuizListTable: React.FC<QuizListTableProps> = ({ handleRowClick }) => {
  // 일단은 Suspense를 쓰고 싶어서 useSuspenseQuery를 썼지만
  // 페이징 처리를 위해서는 useInfiniteQuery를 써야할 것 같다.
  // 그러나, 백엔드에서 페이징 처리를 하기 전까지는 이대로 사용해도 무방할 것 같다.
  const { data } = useSuspenseQuery({
    queryKey: ["quizzes"],
    queryFn: getQuizzes,
  });

  const table = useReactTable({
    data: data ?? [],
    columns: quizListColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableHeader key={headerGroup.id}>
          <TableRow>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      ))}
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            onClick={() => handleRowClick(row.original)}
            className="cursor-pointer"
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default QuizListTable;
