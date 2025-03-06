import { Quiz } from "@/api/quiz.api";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";

const quizListColumnHeloper = createColumnHelper<Quiz>();

const quizListColumns = [
  quizListColumnHeloper.accessor("title", {
    header: "타이틀",
    cell: ({ getValue }) => getValue(),
  }),
  quizListColumnHeloper.accessor("createdAt", {
    header: "생성일자",
    cell: ({ getValue }) => dayjs(getValue()).format("YYYY-MM-DD HH:mm:ss"),
  }),
  quizListColumnHeloper.accessor("updatedAt", {
    header: "수정일자",
    cell: ({ getValue }) => dayjs(getValue()).format("YYYY-MM-DD HH:mm:ss"),
  }),
];

export default quizListColumns;
