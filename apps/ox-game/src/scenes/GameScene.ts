import { Scene } from "phaser";
import { GAME_SCENE_KEY } from "../constants/config";
import { Player, Question } from "@repo/ox-game-helper/types/types.ts";
import {
  JOIN_GAME_DTO,
  socket,
  SOCKET_REQUEST_KEY,
  SOCKET_RESPONSE_KEY,
} from "../utils/socket";
import userStore from "../store/user-store";
import { User } from "firebase/auth";
import { IMAGE_ASSET_KEY } from "../constants/assets";
import { ResultBoard } from "../components/ResultBoard";
import { Quiz } from "../components/Quiz";
import { OXButton } from "../components/OXButton";
import { CharacterSelector } from "../components/CharacterSelector";
import { ParticipantsText } from "../components/ParticipantsText";
import { GameHeader } from "../components/GameHeader";
import { PlayersInGame } from "../components/PlayersInGame";

export class GameScene extends Scene {
  #players: Record<string, Player>;
  #question: Question;
  #timeLeft: number;
  #user: User;
  #waitingIntervalId: number;

  #background: Phaser.GameObjects.Image;

  #quiz: Quiz;
  #oxButton: OXButton;
  #characterSelector: CharacterSelector;
  #participantsText: ParticipantsText;
  #gameHeader: GameHeader;
  #playersInGame: PlayersInGame;

  constructor() {
    super(GAME_SCENE_KEY.GAME);
  }

  async init() {
    this.#background = this.add
      .image(0, 0, IMAGE_ASSET_KEY.BACKGROUND)
      .setOrigin(0);
    const userCredential = userStore.getState();

    if (!userCredential) {
      alert("로그인이 필요합니다.");
      this.scene.start(GAME_SCENE_KEY.LOGIN);
      return;
    }

    this.#user = userCredential.user;
  }

  preload() {
    this.#quiz = new Quiz(this);
    this.#oxButton = new OXButton(this, this.#emitAnswer);
    this.#characterSelector = new CharacterSelector(this, this.#user.uid);
    this.#participantsText = new ParticipantsText(this);
    this.#gameHeader = new GameHeader(this);
    this.#playersInGame = new PlayersInGame(this);
  }

  create() {
    this.#waitingHeaderForGame();
    this.#registerEvents();
    this.#emitJoinGame();
    this.#participantsText.createParticipantsText();
    this.#characterSelector.createCharacterSelector();
  }

  #waitingHeaderForGame() {
    let i = 0;
    this.#gameHeader.createGameHeaderText("게임 대기 중");

    this.#waitingIntervalId = setInterval(() => {
      try {
        this.#gameHeader.updateGameHeaderText(
          `게임 대기 중${Array(i % 4)
            .fill(".")
            .join("")}`
        );
        i++;
      } catch (e) {
        console.error(e);
        this.#clearWaitingHeader();
      }
    }, 400);
  }

  #clearWaitingHeader() {
    clearInterval(this.#waitingIntervalId);
  }

  #emitAnswer(answer: boolean) {
    socket.emit(SOCKET_REQUEST_KEY.SUBMIT_ANSWER, {
      id: userStore.getState()?.user.uid,
      position: answer,
    });
  }

  #emitJoinGame() {
    socket.emit(SOCKET_REQUEST_KEY.JOIN_GAME, {
      id: this.#user?.uid ?? "anonymous",
      nickname: this.#user?.displayName ?? "익명",
      characterImageId: IMAGE_ASSET_KEY.CHARACTER_1,
    } satisfies JOIN_GAME_DTO);

    this.#characterSelector.setUserImage(IMAGE_ASSET_KEY.CHARACTER_1);
  }

  #registerEvents() {
    socket.on(SOCKET_RESPONSE_KEY.WAITING_FOR_GAME, (data) => {
      this.#clearWaitingHeader();
      this.#gameHeader.createGameHeaderText(data.message);
      this.#participantsText.deleteParticipantsText();
    });

    socket.on(
      SOCKET_RESPONSE_KEY.UPDATE_PLAYERS,
      (data: Record<string, Player>) => {
        console.log("현재 참가자 목록:", data);
        this.#players = data;
        this.#participantsText.updateParticipantsText(Object.keys(data).length);
      }
    );

    socket.on(SOCKET_RESPONSE_KEY.NEXT_QUESTION, (data) => {
      this.#background.setTexture(IMAGE_ASSET_KEY.BACKGROUND_INGAME);
      this.#characterSelector.destroyCharacterSelector();
      this.#gameHeader.deleteGameHeaderText();
      this.#participantsText.deleteParticipantsText();
      this.#playersInGame.deletePlayersInGame();
      this.#playersInGame.createPlayersInGame(this.#players);

      this.#quiz.createQuestion(data);
      this.#background.setTexture(IMAGE_ASSET_KEY.BACKGROUND_INGAME);
      this.#oxButton.createOXButton(this.#players[this.#user.uid].position);
      console.log("출제된 문제:", data);
      this.#question = data;
    });

    socket.on(SOCKET_RESPONSE_KEY.CURRENT_QUESTION, (data) => {
      this.#quiz.createQuestion(data);
      this.#participantsText.deleteParticipantsText();
      this.#oxButton.createOXButton(this.#players[this.#user.uid].position);
      // this.#timeLeft = data.timeLeft;
    });

    socket.on(SOCKET_RESPONSE_KEY.WAITING_QUIZ_RESULT, () => {
      console.log("퀴즈 결과 대기 중");
      this.#oxButton.destroyOXButton();
      this.#participantsText.deleteParticipantsText();
      this.#quiz.destroyQuestion();
    });

    socket.on(SOCKET_RESPONSE_KEY.WAITING_QUIZ_NEXT, () => {
      this.#gameHeader.createGameHeaderText("다음 문제 대기 중");
      this.#playersInGame.deletePlayersInGame();
    });

    socket.on(SOCKET_RESPONSE_KEY.GAME_OVER, (data) => {
      console.log("게임 종료:", data.message);
      const resultBoard = new ResultBoard(this);
      if (data.state === "lose") {
        resultBoard.createLoser();
      }

      if (data.state === "win") {
        resultBoard.createWinner();
      }

      socket.disconnect();
    });

    socket.on(SOCKET_RESPONSE_KEY.ERROR, (data) => {
      console.error("오류 발생:", data.message);
      alert(data.message);
      socket.disconnect();
      this.scene.start(GAME_SCENE_KEY.LOBBY);
    });

    socket.on(SOCKET_RESPONSE_KEY.MOVE_USER, (data: Record<string, Player>) => {
      console.log("moveUser", data);
      this.#players = Object.assign({}, this.#players, data);
      this.#playersInGame.movePlayer(Object.values(data)[0]);
    });

    socket.on(SOCKET_RESPONSE_KEY.CHANGE_IMAGE, (data) => {
      console.log("changeImage", data);
      Object.assign(this.#players, data);

      this.#characterSelector.setUserImage(
        this.#players[this.#user.uid].characterImageId ??
          IMAGE_ASSET_KEY.CHARACTER_1
      );
    });
  }
}
