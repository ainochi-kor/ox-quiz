import Title from "@/components/layout/Title";
import QuizListTable from "@/components/quiz/QuizListTable";
import React, { Suspense } from "react";

const QuizListPage: React.FC = () => {
  return (
    <>
      <Title title="Quiz List" description="List of all quizzes" />
      <Suspense fallback={<div>Loading...</div>}>
        <QuizListTable />
      </Suspense>
    </>
  );
};

export default QuizListPage;
