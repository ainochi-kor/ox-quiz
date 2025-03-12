import { Scene } from "phaser";

export class GameHeader {
  #scene: Scene;
  #headerText: Phaser.GameObjects.Text;

  constructor(scene: Scene) {
    this.#scene = scene;
  }

  createGameHeaderText(message: string) {
    this.deleteGameHeaderText();
    this.#headerText = this.#scene.add
      .text(this.#scene.cameras.main.centerX, 120, message, {
        fontSize: "80px",
        color: "#000",
        align: "center",
        lineSpacing: 20,
        backgroundColor: "#fff",
      })
      .setOrigin(0.5, 0);
  }

  updateGameHeaderText(message: string) {
    this.#headerText.setText(message);
  }

  deleteGameHeaderText() {
    this.#headerText?.destroy();
  }
}
