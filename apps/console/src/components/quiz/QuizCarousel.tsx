import { getQuiz } from "@/api/quiz.api";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useSuspenseQuery } from "@tanstack/react-query";

interface QuizCarouselProps {
  quizId: string;
}

const QuizCarousel: React.FC<QuizCarouselProps> = ({ quizId }) => {
  const { data } = useSuspenseQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => getQuiz(quizId),
  });

  return (
    <div className="w-full flex flex-col items-center justify-center mt-4">
      <h2 className="text-2xl font-semibold mb-2">
        {data?.title ?? "Quiz Title Loading..."}
      </h2>
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {data.quizzes.map((quiz) => (
            <CarouselItem key={quiz.title}>
              <div className="p-1">
                <Card>
                  <CardContent>
                    <p className="text-2xl font-semibold">{quiz.title}</p>
                  </CardContent>
                </Card>
                <p className="text-lg font-semibold mt-1">{quiz.description}</p>
                <p className="text-8xl">{quiz.answer ? "O" : "X"}</p>
                <p className="w-full">{quiz.answerDescription}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default QuizCarousel;
