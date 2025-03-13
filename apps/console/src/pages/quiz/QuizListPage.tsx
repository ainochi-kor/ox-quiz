import Title from "@/components/layout/Title";
import QuizListTable from "@/components/quiz/QuizListTable";
import { Quiz } from "@repo/ox-game-helper/types/types.js";
import React, { Suspense, useCallback } from "react";
import { useNavigate } from "react-router";

const QuizListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = useCallback(
    (quiz: Quiz) => {
      navigate(`/quiz/${quiz.id}`);
    },
    [navigate]
  );

  return (
    <>
      <Title title="Quiz List" description="List of all quizzes" />
      <Suspense fallback={<div>Loading...</div>}>
        <QuizListTable handleRowClick={handleNavigate} />
      </Suspense>
    </>
  );
};

export default QuizListPage;
