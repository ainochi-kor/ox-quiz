import { Scene } from "phaser";
import { GAME_SCENE_KEY } from "../constants/config";
import { Socket } from "socket.io-client";
import { Player, Question } from "@repo/ox-game-helper/types/types.ts";
import { getQuizRoom } from "../api/quiz.api";
import {
  CHNAGE_IMAGE_DTO,
  JOIN_GAME_DTO,
  socket,
  SOCKET_REQUEST_KEY,
  SOCKET_RESPONSE_KEY,
} from "../utils/socket";
import userStore from "../store/user-store";
import { User, UserCredential } from "firebase/auth";
import { IMAGE_ASSET_KEY } from "../constants/assets";
import { ResultBoard } from "../components/ResultBoard";
import { Quiz } from "../components/Quiz";
import { OXButton } from "../components/OXButton";

export class GameScene extends Scene {
  #players: Record<string, Player>;
  #question: Question;
  #timeLeft: number;
  #user: User;
  #waitingIntervalId: number;
  #quiz: Quiz;

  #background: Phaser.GameObjects.Image;

  #previewUserImage: Phaser.GameObjects.Image;
  #characterImageButtons: Phaser.GameObjects.Image[];
  #characterImageDesc: Phaser.GameObjects.Text;
  #waitingHeaderText: Phaser.GameObjects.Text;

  #OXButton: OXButton;

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

    this.#waitingHeaderForGame();
    this.#registerEvents();
    this.#createCharacterSelector();

    this.#emitJoinGame();
  }

  preload() {
    this.#quiz = new Quiz(this);
    this.#OXButton = new OXButton(this, this.#emitAnswer);
  }

  create() {}

  #waitingHeaderForGame() {
    let i = 0;
    this.#waitingHeaderText = this.add
      .text(this.cameras.main.centerX, 120, "게임 대기 중", {
        fontSize: "80px",
        color: "#000",
        align: "center",
        lineSpacing: 20,
      })
      .setOrigin(0.5, 0);
    this.#waitingIntervalId = setInterval(() => {
      try {
        this.#waitingHeaderText.setText(
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

  #destroyWaitingHeader() {
    this.#waitingHeaderText.destroy();
  }

  #createCharacterSelector() {
    const characterImageIds = [
      IMAGE_ASSET_KEY.CHARACTER_1,
      IMAGE_ASSET_KEY.CHARACTER_2,
      IMAGE_ASSET_KEY.CHARACTER_3,
      IMAGE_ASSET_KEY.CHARACTER_4,
    ];

    this.#characterImageDesc = this.add
      .text(this.cameras.main.centerX, 950, "캐릭터를 선택하세요!!!", {
        fontSize: "80px",
        color: "#000",
      })
      .setOrigin(0.5);

    this.#characterImageButtons = characterImageIds.map((characterImageId) => {
      const button = this.add.image(0, 0, characterImageId);
      button.setInteractive();
      button.on(Phaser.Input.Events.POINTER_UP, () => {
        this.#emitChangeImage(characterImageId);
      });

      button.on(Phaser.Input.Events.POINTER_OVER, () => {
        button.setScale(1.1);
      });

      button.on(Phaser.Input.Events.POINTER_OUT, () => {
        button.setScale(1);
      });

      return button;
    });

    this.#characterImageButtons.forEach((button, index) => {
      button.setPosition(180 + index * 300, 1650);
    });
  }

  #destroyCharacterSelector() {
    this.#characterImageDesc.destroy();
    this.#characterImageButtons.forEach((button) => button.destroy());
    this.#characterImageButtons = [];
  }

  #setUserImage(characterImageId: string) {
    if (!this.#previewUserImage) {
      this.#previewUserImage = this.add
        .image(this.cameras.main.centerX, 1050, characterImageId)
        .setScale(2)
        .setOrigin(0.5, 0);
      return;
    }

    this.#previewUserImage.setTexture(characterImageId);
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

    this.#setUserImage(IMAGE_ASSET_KEY.CHARACTER_1);
  }

  #emitChangeImage(characterImageId: string) {
    socket.emit(SOCKET_REQUEST_KEY.CHANGE_IMAGE, {
      id: this.#user.uid,
      characterImageId,
    } as CHNAGE_IMAGE_DTO);
  }

  #registerEvents() {
    socket.on(SOCKET_RESPONSE_KEY.WAITING_FOR_GAME, (data) => {
      this.#clearWaitingHeader();
      this.#waitingHeaderText.setText(data.message);
      console.log("게임 시작 대기 중:", data);
    });

    socket.on(SOCKET_RESPONSE_KEY.UPDATE_PLAYERS, (data) => {
      console.log("현재 참가자 목록:", data);
      this.#players = data;
    });

    socket.on(SOCKET_RESPONSE_KEY.NEXT_QUESTION, (data) => {
      this.#background.setTexture(IMAGE_ASSET_KEY.BACKGROUND_INGAME);
      this.#destroyWaitingHeader();

      this.#quiz.createQuestion(data);
      this.#background.setTexture(IMAGE_ASSET_KEY.BACKGROUND_INGAME);
      this.#OXButton.createOXButton(this.#players[this.#user.uid].position);
      console.log("출제된 문제:", data);
      this.#question = data;
    });

    socket.on(SOCKET_RESPONSE_KEY.CURRENT_QUESTION, (data) => {
      this.#quiz.createQuestion(data);
      this.#OXButton.createOXButton(this.#players[this.#user.uid].position);
      // this.#timeLeft = data.timeLeft;
    });

    socket.on(SOCKET_RESPONSE_KEY.WAITING_QUIZ_RESULT, () => {
      console.log("퀴즈 결과 대기 중");
      this.#OXButton.destroy();
      this.#destroyCharacterSelector();
      this.#quiz.destroyQuestion();
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
    });

    socket.on(SOCKET_RESPONSE_KEY.MOVE_USER, (data) => {
      console.log("moveUser", data);
      Object.assign(this.#players, data);
    });

    socket.on(SOCKET_RESPONSE_KEY.CHANGE_IMAGE, (data: Player[]) => {
      console.log("changeImage", data);
      Object.assign(this.#players, data);

      this.#previewUserImage.setTexture(
        this.#players[this.#user.uid].characterImageId ??
          IMAGE_ASSET_KEY.CHARACTER_1
      );
    });
  }
}
