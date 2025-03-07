import { io, Socket } from "socket.io-client";

// WebSocket 서버 URL을 환경 변수에서 가져오기
const SERVER_URL = import.meta.env.VITE_API_URL;

// ✅ 싱글톤 WebSocket 인스턴스
export const socket: Socket = io(SERVER_URL, {
  transports: ["websocket"], // WebSocket만 사용 (HTTP 폴백 방지)
  reconnectionAttempts: 5, // 재연결 시도 횟수
  reconnectionDelay: 1000, // 재연결 시도 간격 (1초)
});

socket.on("connect", () => {
  console.log("WebSocket 연결 성공:", socket.id);
});
