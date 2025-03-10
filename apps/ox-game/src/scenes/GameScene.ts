import { Scene } from "phaser";
import { GAME_SCENE_KEY } from "../constants/config";
import { Socket } from "socket.io-client";
import { Player, Question } from "@repo/ox-game-helper/types/types.ts";

export class GameScene extends Scene {
  #isGameStarted: boolean = false;
  #players: Record<string, Player>;
  #question: Question;
  #timeLeft: number;

  constructor() {
    super(GAME_SCENE_KEY.GAME);
  }

  preload() {}

  create() {
    this.add.image(512, 384, "background");
    this.add.image(512, 350, "logo").setDepth(100);
    this.add
      .text(
        512,
        490,
        "Make something fun!\nand share it with us:\nsupport@phaser.io",
        {
          fontFamily: "Arial Black",
          fontSize: 38,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 8,
          align: "center",
        }
      )
      .setOrigin(0.5)
      .setDepth(100);
  }

  #registerEvents(socket: Socket) {
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
  }
}
