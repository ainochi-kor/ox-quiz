import { io, Socket } from "socket.io-client";

// WebSocket 서버 URL을 환경 변수에서 가져오기
const SERVER_URL = import.meta.env.VITE_API_URL;
export const SOCKET_RESPONSE_KEY = Object.freeze({
  WAITING_FOR_GAME: "waitingForGame",
  UPDATE_PLAYERS: "updatePlayers",
  NEXT_QUESTION: "nextQuestion",
  CURRENT_QUESTION: "currentQuestion",
  WAITING_QUIZ_RESULT: "waitingQuizResult",
  WAITING_QUIZ_NEXT: "waitingQuizNext",
  COUNTDOWN: "countdown",
  GAME_OVER: "gameOver",
  ERROR: "error",
  MOVE_USER: "moveUser",
  CHANGE_IMAGE: "changeImage",
});

export const SOCKET_REQUEST_KEY = Object.freeze({
  JOIN_GAME: "joinGame",
  LEAVE_ROOM: "leaveRoom",
  ANSWER: "answer",
  READY: "ready",
  START_GAME: "startGame",
  CHANGE_IMAGE: "changeImage",
  SUBMIT_ANSWER: "submitAnswer",
});

// ✅ 싱글톤 WebSocket 인스턴스
export const socket: Socket = io(SERVER_URL, {
  transports: ["websocket"], // WebSocket만 사용 (HTTP 폴백 방지)
  reconnectionAttempts: 5, // 재연결 시도 횟수
  reconnectionDelay: 1000, // 재연결 시도 간격 (1초)
});

socket.on("connect", () => {
  console.log("WebSocket 연결 성공:", socket.id);
});

export const deleteSocketEvents = () =>
  Object.values(SOCKET_REQUEST_KEY).forEach((key) => {
    socket.off(key);
  });

export type JOIN_GAME_DTO = {
  id: string;
  nickname: string;
  characterImageId: string;
};

export type CHNAGE_IMAGE_DTO = {
  id: string;
  characterImageId: string;
};
