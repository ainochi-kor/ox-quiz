import { Scene } from "phaser";
import { IMAGE_ASSET_KEY } from "../constants/assets";

export class FingerPointer {
  #scene: Scene;
  #finger: Phaser.GameObjects.Image;

  constructor(scene: Scene) {
    this.#scene = scene;
  }

  createFinger(x: number, y: number) {
    this.#finger = this.#scene.add
      .image(x, y, IMAGE_ASSET_KEY.FINGER_POINTER)
      .setRotation(-0.75);
  }

  animateFingerBetweenPoints() {
    // 두 지점 사이를 왕복하는 트윈을 생성합니다.
    this.#scene.tweens.add({
      targets: this.#finger,
      x: this.#finger.x + 50,
      y: this.#finger.y + 50,
      duration: 300, // 애니메이션 지속 시간 (밀리초)
      ease: "Linear",
      yoyo: true, // 왕복 애니메이션 설정
      repeat: -1, // 무한 반복
    });
  }
}
