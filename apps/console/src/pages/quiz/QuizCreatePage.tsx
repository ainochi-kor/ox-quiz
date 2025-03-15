import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

import Title from "@/components/layout/Title";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { createQuiz } from "@/api/quiz.api";
import { useNavigate } from "react-router";
import { CreateQuizDto } from "@repo/ox-game-helper/types/types.js";
import { examQuestions } from "@/data/quiz";

const MAX_FILE_SIZE = 1024 * 1024 * 500;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  title: z.string().nonempty({
    message: "전체 제목을 비울 수 없습니다.",
  }),
  quizzes: z.array(
    z.object({
      title: z.string().nonempty({
        message: "제목을 비울 수 없습니다.",
      }),
      description: z.string(),
      answer: z.boolean(),
      answerDescription: z.string(),
      image: z
        .instanceof(File)
        .nullable()
        .optional()
        .refine(
          (file) => {
            if (!file) return true;
            return file.size <= MAX_FILE_SIZE;
          },
          {
            message: `이미지 파일은 ${MAX_FILE_SIZE / 1024 / 1024}MB 이하여야 합니다.`,
          }
        )
        .refine(
          (file) => {
            if (!file) return true;
            return ACCEPTED_IMAGE_MIME_TYPES.includes(file.type);
          },
          {
            message: `이미지 파일은 ${ACCEPTED_IMAGE_MIME_TYPES.join(", ")} 형식이어야 합니다.`,
          }
        ),
    })
  ),
});

const QuizCreatePage: React.FC = () => {
  const naviagte = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: import.meta.env.DEV ? "Sample Quiz" : "",
      quizzes: [
        {
          title: "",
          description: "",
          answer: false,
          answerDescription: "",
          image: undefined,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "quizzes",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const quiz: CreateQuizDto = {
      title: values.title,
      quizzes: values.quizzes.map((quiz) => ({
        title: quiz.title,
        description: quiz.description,
        answer: quiz.answer,
        answerDescription: quiz.answerDescription,
        image: quiz.image?.name,
      })),
    };

    await createQuiz(quiz);

    naviagte("/quiz");
    toast("퀴즈가 성공적으로 생성되었습니다.");
  }

  const fillFieldsForTesting = () => {
    // 제목 설정
    form.setValue("title", examQuestions.title);

    examQuestions.quizzes.forEach((quiz, index) => {
      if (index >= fields.length) {
        // 필요한 경우 새로운 필드 추가
        append({
          title: quiz.title,
          description: quiz.description,
          answer: quiz.answer,
          answerDescription: quiz.answerDescription,
          image: null,
        });
      } else {
        // 기존 필드 업데이트
        form.setValue(`quizzes.${index}.title`, quiz.title);
        form.setValue(`quizzes.${index}.description`, quiz.description);
        form.setValue(`quizzes.${index}.answer`, quiz.answer);
        form.setValue(
          `quizzes.${index}.answerDescription`,
          quiz.answerDescription
        );
        form.setValue(`quizzes.${index}.image`, null);
      }
    });

    // 만약 `fields`가 `examQuestions.quizzes.length`보다 많다면 초과된 필드 제거
    if (fields.length > examQuestions.quizzes.length) {
      for (let i = fields.length - 1; i >= examQuestions.quizzes.length; i--) {
        remove(i);
      }
    }
  };

  return (
    <>
      <Title title="Quiz Create" description="Create a new quiz" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>전체 제목</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>전체 제목을 입력해주세요.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-2">
              <h4 className="text-2xl font-bold">{index + 1} 번째 퀴즈 </h4>
              <FormField
                control={form.control}
                name={`quizzes.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>퀴즈 제목</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>퀴즈 제목을 입력해주세요.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`quizzes.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>퀴즈 설명</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>퀴즈 설명을 입력해주세요.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`quizzes.${index}.answer`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>정답</FormLabel>
                    <FormControl>
                      <Input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormDescription>정답을 선택해주세요.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`quizzes.${index}.answerDescription`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>정답 설명</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>정답 설명을 입력해주세요.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`quizzes.${index}.image`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이미지</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) =>
                          field.onChange(e.target.files?.[0] || null)
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormDescription>이미지를 업로드해주세요.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" onClick={() => remove(index)}>
                퀴즈 삭제
              </Button>
            </div>
          ))}
          <div className="w-full flex justify-end space-x-2">
            <Button type="button" onClick={fillFieldsForTesting}>
              테스트용 퀴즈 추가
            </Button>
            <Button
              type="button"
              onClick={() =>
                append({
                  title: "",
                  description: "",
                  answer: false,
                  answerDescription: "",
                  image: null,
                })
              }
            >
              퀴즈 추가
            </Button>
            <Button type="submit">제출</Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default QuizCreatePage;
