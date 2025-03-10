import { Scene } from "phaser";
import { GAME_SCENE_KEY } from "../constants/config";
import { Socket } from "socket.io-client";
import { Player, Question } from "@repo/ox-game-helper/types/types.ts";
import { getQuizRoom } from "../api/quiz.api";
import { socket } from "../utils/socket";
import userStore from "../store/user-store";
import { User, UserCredential } from "firebase/auth";
import { IMAGE_ASSET_KEY } from "../constants/assets";

export class GameScene extends Scene {
  #isGameStarted: boolean = false;
  #players: Record<string, Player>;
  #question: Question;
  #timeLeft: number;
  #user: User;
  #userImage: Phaser.GameObjects.Image;

  constructor() {
    super(GAME_SCENE_KEY.GAME);
  }

  async init({ id }: { id: string }) {
    const userCredential = userStore.getState();
    const quizRoom = await getQuizRoom(id);

    if (!userCredential) {
      alert("로그인이 필요합니다.");
      this.scene.start(GAME_SCENE_KEY.LOGIN);
      return;
    }

    this.#user = userCredential.user;

    this.add
      .text(this.cameras.main.centerX, 100, quizRoom.title, {
        fontSize: "80px",
        color: "#000",
      })
      .setOrigin(0.5, 0);

    this.#registerEvents();
    this.#createCharacterImageButtons();

    this.#emitJoinGame();
  }

  preload() {}

  create() {}

  #createCharacterImageButtons() {
    const characterImageIds = [
      IMAGE_ASSET_KEY.CHARACTER_1,
      IMAGE_ASSET_KEY.CHARACTER_2,
      IMAGE_ASSET_KEY.CHARACTER_3,
      IMAGE_ASSET_KEY.CHARACTER_4,
    ];
    const buttons = characterImageIds.map((characterImageId) => {
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

    buttons.forEach((button, index) => {
      button.setPosition(180 + index * 300, 1650);
    });
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
      id: this.#user.uid,
      nickname: this.#user.displayName ?? "익명",
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
    socket.on("waitingForPlayers", (data) => {
      console.log(`참가자를 모집 중... 남은 시간: ${data.timeLeft}초`);
      this.#isGameStarted = true;
    });

    socket.on("updatePlayers", (data) => {
      console.log("현재 참가자 목록:", data);
      this.#players = data;
    });

    socket.on("nextQuestion", (data) => {
      console.log("출제된 문제:", data);
      this.#question = data;
    });

    socket.on("countdown", (data) => {
      console.log(`남은 시간: ${data.timeLeft}초`);
      this.#timeLeft = data.timeLeft;
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
