export interface Player {
  id: string;
  position: boolean;
  nickname?: string;
  characterImageId?: string;
}

export interface Question {
  title: string;
  description: string;
  image?: string;
}

export interface QuestionWithIndex extends Question {
  questionIndex: number;
}

export interface QuizRoom {
  title: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  isStarted: boolean;
}

export interface QuestionDto extends Question {
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
