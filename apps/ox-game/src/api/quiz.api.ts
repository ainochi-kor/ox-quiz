import { QuizRoom } from "@repo/ox-game-helper/types/types.js";
import { axiosInstance } from "./axios.config";

export const getQuizRoomList = async () =>
  (await axiosInstance.get<QuizRoom[]>("/quizzes/roomlist")).data;

export const getQuizRoom = async (id: string) =>
  (await axiosInstance.get<QuizRoom>(`/quizzes/roomlist/${id}`)).data;
