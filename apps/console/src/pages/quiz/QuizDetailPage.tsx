import Title from "@/components/layout/Title";
import QuizCarousel from "@/components/quiz/QuizCarousel";
import { Button } from "@/components/ui/button";
import { useQuizSocket } from "@/hooks/quiz/useQuizSocket";
import { useAuthStore } from "@/hooks/store/useAuthStore";
import React, { Suspense, useCallback, useRef } from "react";
import { useParams } from "react-router";

const QuizDetailPage: React.FC = () => {
  const { userCredential } = useAuthStore();
  const { id } = useParams();
  const { gameStarted, players, question, socket, timeLeft } = useQuizSocket();
  const characterRef = useRef(0);

  // 관리자: 게임 시작
  const startGame = useCallback(() => {
    console.log("startGame", {
      quizId: id,
      providerId: userCredential?.providerId,
    });
    socket.emit("startGame", {
      quizId: id,
      providerId: userCredential?.providerId,
    });
  }, [id, socket, userCredential?.providerId]);

  const joinGame = useCallback(() => {
    if (!userCredential) {
      throw new Error("로그인 후 참여 가능합니다.");
    }

    const { email, displayName } = userCredential.user;
    console.log("joinGame", { id: email });
    socket.emit("joinGame", {
      id: email,
      nickname: displayName,
      characterImageId: characterRef.current,
    });
  }, [socket, userCredential]);

  // 참가자: 답변 제출
  const submitAnswer = useCallback(
    (answer: "O" | "X") => {
      const email = userCredential?.user.email;
      if (!email) {
        alert("게임에 참여한 후 답변을 제출하세요.");
        return;
      }
      socket.emit("submitAnswer", { id: email, position: answer });
    },
    [socket, userCredential?.user.email]
  );

  return (
    <>
      <Title title="Quiz Detail" description="Quiz detail page" />
      <Suspense fallback={<div>Loading...</div>}>
        {id && <QuizCarousel quizId={id} />}
      </Suspense>
      <div className="">
        <p>{gameStarted ? "게임 활성화" : "게임 비활성화"} </p>
        <Button onClick={startGame} disabled={gameStarted}>
          게임 시작
        </Button>
        <pre>한번 시작된 게임은 멈출 수 없습니다.</pre>
      </div>
      <hr className="my-4" />
      <div>
        <h1>OX 퀴즈 테스트</h1>

        {/* 참가자용 버튼 */}
        {!gameStarted && <Button onClick={joinGame}>게임 참여</Button>}

        {/* 남은 시간 표시 */}
        {timeLeft > 0 && <h3>남은 시간: {timeLeft}초</h3>}

        {/* 문제 표시 */}
        {question && (
          <div>
            <h2>{question.title}</h2>
            <p>{question.description}</p>
            <Button onClick={() => submitAnswer("O")}>O 선택</Button>
            <Button onClick={() => submitAnswer("X")}>X 선택</Button>
          </div>
        )}

        {/* 참가자 목록 표시 */}
        <pre>{JSON.stringify(players, null, 2)}</pre>
      </div>
    </>
  );
};

export default QuizDetailPage;
