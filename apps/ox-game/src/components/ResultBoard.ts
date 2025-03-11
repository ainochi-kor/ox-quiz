import { Scene } from "phaser";
import { LAYOUT_SIZE } from "../constants/config";
import { IMAGE_ASSET_KEY } from "../constants/assets";

export class ResultBoard {
  #scene: Scene;
  #background: Phaser.GameObjects.Rectangle;
  #messageBox: Phaser.GameObjects.Graphics;
  #resultImage: Phaser.GameObjects.Image;
  #title: Phaser.GameObjects.Text;
  #description: Phaser.GameObjects.Text;
  #lobbyButton: Phaser.GameObjects.Image;

  #titleStyle = {
    location: [LAYOUT_SIZE.width / 2, 870] as const,
    textStyle: {
      fontSize: "120px",
      color: "#fff",
    },
  };
  #descriptionStyle = {
    location: [LAYOUT_SIZE.width / 2, 1020] as const,
    textStyle: {
      fontSize: "80px",
      color: "#fff",
    },
  };

  constructor(scene: Phaser.Scene) {
    this.#scene = scene;
  }

  #getBackground() {
    this.#background = this.#scene.add
      .rectangle(0, 0, LAYOUT_SIZE.width, LAYOUT_SIZE.height, 0x000000, 0.6)
      .setOrigin(0)
      .setInteractive()
      .setDepth(999);

    this.#messageBox = this.#scene.add.graphics();
    this.#messageBox.fillStyle(0x000000, 0.6); // White background color
    this.#messageBox.fillRoundedRect(
      200,
      LAYOUT_SIZE.height / 4 - 40,
      LAYOUT_SIZE.width - 400,
      LAYOUT_SIZE.height / 2,
      20
    );

    // 클릭 이벤트를 방지하는 빈 함수 등록
    this.#background.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      pointer.event.stopPropagation();
    });
  }

  #createButton() {
    this.#lobbyButton = this.#scene.add
      .image(LAYOUT_SIZE.width / 2, 1250, IMAGE_ASSET_KEY.BUTTON_LOBBY)
      .setDepth(1000);

    this.#lobbyButton.setInteractive();
    this.#lobbyButton.on("pointerdown", () => {
      this.hide
      this.#scene.scene.start("Lobby");
    });
  }

  createWinner() {
    this.#getBackground();
    this.#resultImage = this.#scene.add
      .image(LAYOUT_SIZE.width / 2, 430, IMAGE_ASSET_KEY.WINNER_HELPER)
      .setOrigin(0.5, 0)
      .setDepth(1000);

    this.#title = this.#scene.add
      .text(...this.#titleStyle.location, "승리", this.#titleStyle.textStyle)
      .setOrigin(0.5, 0)
      .setDepth(1000);

    this.#description = this.#scene.add
      .text(
        ...this.#descriptionStyle.location,
        "축하합니다!",
        this.#descriptionStyle.textStyle
      )
      .setOrigin(0.5, 0)
      .setDepth(1000);

    this.#createButton();
  }

  createLoser() {
    this.#getBackground();
    this.#resultImage = this.#scene.add
      .image(LAYOUT_SIZE.width / 2, 500, IMAGE_ASSET_KEY.LOSER_HELPER)
      .setOrigin(0.5, 0)
      .setDepth(1000);

    this.#title = this.#scene.add
      .text(...this.#titleStyle.location, "패배", this.#titleStyle.textStyle)
      .setOrigin(0.5, 0)
      .setDepth(1000);

    this.#description = this.#scene.add
      .text(
        ...this.#descriptionStyle.location,
        "다음 기회에...",
        this.#descriptionStyle.textStyle
      )
      .setOrigin(0.5, 0)
      .setDepth(1000);

    this.#createButton();
  }

  hide() {
    console.log("hide start");
    this.#background.destroy();
    this.#description.destroy();
    this.#title.destroy();
    this.#resultImage.destroy();
    this.#lobbyButton.destroy();

    console.log("hide complete");
  }
}
