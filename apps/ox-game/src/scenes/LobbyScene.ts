import { Scene } from "phaser";
import { GAME_SCENE_KEY } from "../constants/config";
import { IMAGE_ASSET_KEY } from "../constants/assets";
import userStore from "../store/user-store";
import { QuizRoom } from "@repo/ox-game-helper/types/types.js";

export class LobbyScene extends Scene {
  quizRoomList: QuizRoom[] = [];
  isCreated = false;

  constructor() {
    super(GAME_SCENE_KEY.LOBBY);
  }

  init() {
    console.log(userStore.getState());
    this.add.image(0, 0, IMAGE_ASSET_KEY.BACKGROUND).setOrigin(0);
  }

  async preload() {
    this.#createJoinButton();
  }

  create() {
    this.add
      .text(this.cameras.main.centerX, 520, "OX Game", {
        fontSize: 120,
        color: "#000",
      })
      .setOrigin(0.5, 0);

    this.add
      .text(
        this.cameras.main.centerX,
        680,
        "[참가하기]를 누르고\n게임에 참가해요!",
        {
          fontSize: 80,
          color: "#000",
          align: "center",
          lineSpacing: 20,
        }
      )
      .setOrigin(0.5, 0);
  }

  #createJoinButton() {
    const joinButton = this.add
      .image(this.cameras.main.centerX, 1050, IMAGE_ASSET_KEY.BUTTON_JOIN)
      .setOrigin(0.5);
    joinButton.setInteractive();

    joinButton.on("pointerdown", () => {
      this.scene.start(GAME_SCENE_KEY.GAME);
      joinButton.disableInteractive();
    });

    joinButton.on("pointerover", () => {
      joinButton.setScale(1.05);
    });

    joinButton.on("pointerout", () => {
      joinButton.setScale(1.0);
    });
  }
}
