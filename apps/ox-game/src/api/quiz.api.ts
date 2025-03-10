import {
  CreateQuizDto,
  Quiz,
  QuizRoom,
} from "@repo/ox-game-helper/types/types.js";
import { axiosInstance } from "./axios.config";

export const getQuizRoomList = async () =>
  (await axiosInstance.get<QuizRoom[]>("/quizzes/roomlist")).data;

export const getQuiz = async (id: string) =>
  (await axiosInstance.get<Quiz>(`/quizzes/${id}`)).data;

export const createQuiz = async (quiz: CreateQuizDto) =>
  (await axiosInstance.post<Quiz>("/quizzes", quiz)).data;
