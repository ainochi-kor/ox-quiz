import { Scene } from "phaser";
import { LAYOUT_SIZE } from "../constants/config";

interface QuizData {
  questionIndex: number;
  question: string;
  description: string;
  image: string | undefined;
  timeLeft: number;
}

export class Quiz {
  #scene: Scene;

  #titleText: Phaser.GameObjects.Text;
  #descriptionText: Phaser.GameObjects.Text;
  #image: Phaser.GameObjects.Image;
  #timeLeftText: Phaser.GameObjects.Text;

  #isCreated = false;

  constructor(scene: Scene) {
    this.#scene = scene;
  }

  createQuestion(data: QuizData) {
    if (this.#isCreated) {
      this.#updateTimeLeft(data.timeLeft);
      return;
    }

    this.#timeLeftText = this.#scene.add
      .text(this.#scene.cameras.main.centerX, 100, `${data?.timeLeft ?? "-"}`, {
        fontSize: "120px",
        color: "#000",
        backgroundColor: "#fff",
      })
      .setOrigin(0.5, 0);

    this.#titleText = this.#scene.add
      .text(this.#scene.cameras.main.centerX, 250, `${data.question}`, {
        fontSize: "80px",
        color: "#000",
        fixedWidth: LAYOUT_SIZE.width,
        align: "center",
        backgroundColor: "#fff",
      })
      .setOrigin(0.5, 0);

    const titleBounds = this.#titleText.getBounds();

    this.#descriptionText = this.#scene.add
      .text(
        this.#scene.cameras.main.centerX,
        titleBounds.y + titleBounds.height + 100,
        data.description,
        {
          fontSize: "60px",
          color: "#000",
          backgroundColor: "#fff",
        }
      )
      .setOrigin(0.5, 0);

    this.#isCreated = true;
  }

  #updateTimeLeft(timeLeft: number) {
    this.#timeLeftText.setText(`${timeLeft ?? "-"}`);
  }

  destroyQuestion() {
    this.#isCreated = false;

    this.#titleText?.destroy();
    this.#descriptionText?.destroy();
    this.#image?.destroy();
    this.#timeLeftText?.destroy();
  }
}
