import { axiosInstance } from "./axios.config";

export interface QuestionDto {
  title: string;
  description: string;
  answer: boolean;
  answerDescription: string;
  image?: string;
}

export interface CreateQuizDto {
  title: string;
  quizzes: QuestionDto[];
}

export interface Quiz extends CreateQuizDto {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export const getQuizzes = async () =>
  (await axiosInstance.get<Quiz[]>("/quizzes")).data;

export const getQuiz = async (id: string) =>
  (await axiosInstance.get<Quiz>(`/quizzes/${id}`)).data;

export const createQuiz = async (quiz: CreateQuizDto) =>
  (await axiosInstance.post<Quiz>("/quizzes", quiz)).data;
