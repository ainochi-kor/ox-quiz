import Title from "@/components/layout/Title";
import QuizCarousel from "@/components/quiz/QuizCarousel";
import React, { Suspense } from "react";
import { useParams } from "react-router";

const QuizDetailPage: React.FC = () => {
  const { id } = useParams();

  return (
    <>
      <Title title="Quiz Detail" description="Quiz detail page" />
      <Suspense fallback={<div>Loading...</div>}>
        {id && <QuizCarousel quizId={id} />}
      </Suspense>
    </>
  );
};

export default QuizDetailPage;
