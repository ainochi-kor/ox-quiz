import { Scene } from "phaser";
import { GAME_SCENE_KEY } from "../constants/config";
import { Socket } from "socket.io-client";
import { Player, Question } from "@repo/ox-game-helper/types/types.ts";
import { getQuizRoom } from "../api/quiz.api";
import { socket } from "../utils/socket";
import userStore from "../store/user-store";
import { User, UserCredential } from "firebase/auth";
import { IMAGE_ASSET_KEY } from "../constants/assets";
import { ResultBoard } from "../components/ResultBoard";
import { Quiz } from "../components/Quiz";

export class GameScene extends Scene {
  #players: Record<string, Player>;
  #question: Question;
  #timeLeft: number;
  #user: User;
  #waitingIntervalId: number;
  #quiz: Quiz;

  #userImage: Phaser.GameObjects.Image;
  #characterImageButtons: Phaser.GameObjects.Image[];
  #characterImageDesc: Phaser.GameObjects.Text;
  #waitingHeaderText: Phaser.GameObjects.Text;

  constructor() {
    super(GAME_SCENE_KEY.GAME);
  }

  async init() {
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
    if (!this.#userImage) {
      this.#userImage = this.add
        .image(this.cameras.main.centerX, 1050, characterImageId)
        .setScale(2)
        .setOrigin(0.5, 0);
      return;
    }

    this.#userImage.setTexture(characterImageId);
  }

  #emitJoinGame() {
    const joinGameDto: {
      id: string;
      nickname: string;
      characterImageId: string;
    } = {
      id: this.#user?.uid ?? "anonymous",
      nickname: this.#user?.displayName ?? "익명",
      characterImageId: IMAGE_ASSET_KEY.CHARACTER_1,
    };
    socket.emit("joinGame", joinGameDto);

    this.#setUserImage(joinGameDto.characterImageId);
  }

  #emitAnswer(answer: boolean) {}

  #emitChangeImage(characterImageId: string) {
    const changeImageDto = {
      id: this.#user.uid,
      characterImageId,
    };

    socket.emit("changeImage", changeImageDto);
  }

  #registerEvents() {
    socket.on("waitingForGame", (data) => {
      this.#clearWaitingHeader();
      this.#waitingHeaderText.setText(data.message);
      console.log("게임 시작 대기 중:", data);
    });

    socket.on("updatePlayers", (data) => {
      console.log("현재 참가자 목록:", data);
      this.#players = data;
    });

    socket.on("nextQuestion", (data) => {
      this.#destroyWaitingHeader();
      this.#destroyCharacterSelector();
      this.#quiz.destroyQuestion();

      this.#quiz.createQuestion(data);
      console.log("출제된 문제:", data);
      this.#question = data;
    });

    socket.on("currentQuestion", (data) => {
      this.#quiz.createQuestion(data);
      // this.#timeLeft = data.timeLeft;
    });

    socket.on("gameOver", (data) => {
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

    socket.on("error", (data) => {
      console.error("오류 발생:", data.message);
      alert(data.message);
      socket.disconnect();
    });

    socket.on("moveUser", (data) => {
      console.log("moveUser", data);
      Object.assign(this.#players, data);
    });

    socket.on("changeImage", (data: Player[]) => {
      console.log("changeImage", data);
      Object.assign(this.#players, data);

      this.#userImage.setTexture(
        this.#players[this.#user.uid].characterImageId ??
          IMAGE_ASSET_KEY.CHARACTER_1
      );
    });
  }
}
