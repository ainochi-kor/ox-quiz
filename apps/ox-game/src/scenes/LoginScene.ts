import { Scene } from "phaser";
import { GAME_SCENE_KEY } from "../constants/config";
import { IMAGE_ASSET_KEY } from "../constants/assets";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebase";
import userStore from "../store/user-store";
import { FingerPointer } from "../components/FingerPointer";

export class LoginScene extends Scene {
  constructor() {
    super(GAME_SCENE_KEY.LOGIN);
  }

  init() {
    this.add.image(0, 0, IMAGE_ASSET_KEY.BACKGROUND).setOrigin(0);
  }

  create() {
    const googleButton = this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      IMAGE_ASSET_KEY.BUTTON_GOOGLE
    );

    googleButton.setInteractive();
    googleButton.on(Phaser.Input.Events.POINTER_UP, () => {
      const provider = new GoogleAuthProvider();

      signInWithPopup(auth, provider)
        .then((data) => {
          userStore.setState(data);
          this.scene.start(GAME_SCENE_KEY.LOBBY);
        })
        .catch((err) => {
          console.error(err);
          alert(err);
        });
    });

    googleButton.on(Phaser.Input.Events.POINTER_OVER, () => {
      googleButton.setScale(1.1);
    });

    googleButton.on(Phaser.Input.Events.POINTER_OUT, () => {
      googleButton.setScale(1);
    });

    const fingerPointer = new FingerPointer(this);
    fingerPointer.createFinger(
      this.cameras.main.centerX + 200,
      this.cameras.main.centerY + 200
    );
    fingerPointer.animateFingerBetweenPoints();
  }
}
