const QuizStartPage: React.FC = () => {
  // const { gameStarted, players, question, socket, timeLeft } = useQuizSocket();

  // // 참가자: 게임 참여
  // const joinGame = () => {
  //   const userId = userCredential?.user.displayName ?? "익명";
  //   localStorage.setItem("userId", userId);
  //   socket.emit("joinGame", { userId });
  // };

  // // 참가자: 답변 제출
  // const submitAnswer = (answer: "O" | "X") => {
  //   const userId = localStorage.getItem("userId");
  //   if (!userId) {
  //     alert("게임에 참여한 후 답변을 제출하세요.");
  //     return;
  //   }
  //   socket.emit("submitAnswer", { userId, position: answer });
  // };

  return (
    <div>
      <h1>OX 퀴즈 테스트</h1>
      참가자용 버튼
    </div>
  );
};

export default QuizStartPage;
