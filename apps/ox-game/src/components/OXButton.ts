import { Scene } from "phaser";
import { IMAGE_ASSET_KEY } from "../constants/assets";

export class OXButton {
  #scene: Scene;
  #emitAnswer: (answer: boolean) => void;

  #ButtonO: Phaser.GameObjects.Image;
  #ButtonX: Phaser.GameObjects.Image;

  #isCreated = false;

  constructor(scene: Scene, emitAnswer: (answer: boolean) => void) {
    this.#scene = scene;
    this.#emitAnswer = emitAnswer;
  }

  createOXButton(position: boolean) {
    if (this.#isCreated) {
      return;
    }

    this.#isCreated = true;

    this.#ButtonO = this.#scene.add
      .image(
        this.#scene.cameras.main.centerX - 320,
        1600,
        IMAGE_ASSET_KEY[position ? "BUTTON_O_ON" : "BUTTON_O_OFF"]
      )
      .setScale(0.75)
      .setOrigin(0.5, 0);
    this.#ButtonX = this.#scene.add
      .image(
        this.#scene.cameras.main.centerX + 320,
        1600,
        IMAGE_ASSET_KEY[position ? "BUTTON_X_OFF" : "BUTTON_X_ON"]
      )
      .setScale(0.75)
      .setOrigin(0.5, 0);

    this.#ButtonO.setInteractive();
    this.#ButtonX.setInteractive();

    this.#ButtonO.on(Phaser.Input.Events.POINTER_UP, () => {
      this.#ButtonO.setTexture(IMAGE_ASSET_KEY.BUTTON_O_ON);
      this.#ButtonX.setTexture(IMAGE_ASSET_KEY.BUTTON_X_OFF);
      this.#emitAnswer(true);
    });

    this.#ButtonX.on(Phaser.Input.Events.POINTER_UP, () => {
      this.#ButtonO.setTexture(IMAGE_ASSET_KEY.BUTTON_O_OFF);
      this.#ButtonX.setTexture(IMAGE_ASSET_KEY.BUTTON_X_ON);
      this.#emitAnswer(false);
    });
  }

  destroy() {
    this.#ButtonO?.destroy();
    this.#ButtonX?.destroy();

    this.#isCreated = false;
  }
}
