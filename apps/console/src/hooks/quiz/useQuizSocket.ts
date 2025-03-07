import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";

export const useQuizSocket = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState({});
  const [question, setQuestion] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    socket.on("waitingForPlayers", (data) => {
      console.log(`참가자를 모집 중... 남은 시간: ${data.timeLeft}초`);
      setGameStarted(true);
    });

    socket.on("updatePlayers", (data) => {
      console.log("현재 참가자 목록:", data);
      setPlayers(data);
    });

    socket.on("nextQuestion", (data) => {
      console.log("출제된 문제:", data);
      setQuestion(data);
    });

    socket.on("countdown", (data) => {
      console.log(`남은 시간: ${data.timeLeft}초`);
      setTimeLeft(data.timeLeft);
    });

    socket.on("gameOver", (data) => {
      console.log("게임 종료:", data.message);
      alert(data.message);
      socket.disconnect();
    });

    socket.on("error", (data) => {
      console.error("오류 발생:", data.message);
      alert(data.message);
      socket.disconnect();
    });

    socket.on("moveUser", (data) => {
      console.log("moveUser", data);
      setPlayers(data);
    });

    return () => {
      socket.off("waitingForPlayers");
      socket.off("updatePlayers");
      socket.off("nextQuestion");
      socket.off("countdown");
      socket.off("gameOver");
      socket.off("error");
      socket.off("moveUser");
    };
  }, []);

  return { players, question, timeLeft, socket, gameStarted };
};
