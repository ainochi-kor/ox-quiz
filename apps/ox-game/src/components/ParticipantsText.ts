import { Scene } from "phaser";

export class ParticipantsText {
  #scene: Scene;
  #participantsText: Phaser.GameObjects.Text;

  constructor(scene: Scene) {
    this.#scene = scene;
  }

  createParticipantsText() {
    this.#participantsText = this.#scene.add
      .text(this.#scene.cameras.main.centerX, 250, "현재 참가자: -명", {
        fontSize: "60px",
        color: "#000",
      })
      .setOrigin(0.5, 0);
  }

  updateParticipantsText(participants: number) {
    this.#participantsText.setText(`현재 참가자: ${participants}명`);
  }

  deleteParticipantsText() {
    this.#participantsText?.destroy();
  }
}
