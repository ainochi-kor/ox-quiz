import { Scene } from "phaser";
import { IMAGE_ASSET_KEY } from "../constants/assets";
import { CHNAGE_IMAGE_DTO, socket, SOCKET_REQUEST_KEY } from "../utils/socket";

export class CharacterSelector {
  #scene: Scene;
  #uid: string;

  #characterImageButtons: Phaser.GameObjects.Image[];
  #characterImageDesc: Phaser.GameObjects.Text;
  #previewUserImage: Phaser.GameObjects.Image;

  constructor(scene: Scene, uid: string) {
    this.#scene = scene;
    this.#uid = uid;
  }

  createCharacterSelector() {
    const characterImageIds = [
      IMAGE_ASSET_KEY.CHARACTER_1,
      IMAGE_ASSET_KEY.CHARACTER_2,
      IMAGE_ASSET_KEY.CHARACTER_3,
      IMAGE_ASSET_KEY.CHARACTER_4,
    ];

    this.#characterImageDesc = this.#scene.add
      .text(this.#scene.cameras.main.centerX, 450, "캐릭터를 선택하세요!!!", {
        fontSize: "80px",
        color: "#000",
      })
      .setOrigin(0.5);

    this.#characterImageButtons = characterImageIds.map((characterImageId) => {
      const button = this.#scene.add.image(0, 0, characterImageId);
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
      button.setPosition(180 + index * 300, 1150);
    });
  }

  destroyCharacterSelector() {
    this.#characterImageDesc.destroy();
    this.#characterImageButtons.forEach((button) => button.destroy());
    this.#characterImageButtons = [];
    this.#previewUserImage?.destroy();
  }

  #emitChangeImage(characterImageId: string) {
    socket.emit(SOCKET_REQUEST_KEY.CHANGE_IMAGE, {
      id: this.#uid,
      characterImageId,
    } as CHNAGE_IMAGE_DTO);
  }

  setUserImage(characterImageId: string) {
    if (!this.#previewUserImage) {
      this.#previewUserImage = this.#scene.add
        .image(this.#scene.cameras.main.centerX, 600, characterImageId)
        .setScale(2)
        .setOrigin(0.5, 0);
      return;
    }

    this.#previewUserImage.setTexture(characterImageId);
  }
}
