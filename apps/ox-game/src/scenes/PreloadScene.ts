import { Scene } from "phaser";
import { GAME_SCENE_KEY } from "../constants/config";
import { IMAGE_ASSET_KEY, SPLASH_ASSET_KEY } from "../constants/assets";

export class PreloadScene extends Scene {
  #loadingHelperAnimation: Phaser.Tweens.Tween;

  constructor() {
    super(GAME_SCENE_KEY.PRELOAD);
  }

  init() {
    this.add.image(0, 0, SPLASH_ASSET_KEY.SPLASH).setOrigin(0);
    const loadingHelper = this.add
      .image(1280, 120, IMAGE_ASSET_KEY.LOADING_HELPER)
      .setOrigin(1, 0);

    this.#loadingHelperAnimation = this.tweens.add({
      targets: loadingHelper,
      x: -loadingHelper.width,
      ease: "Linear",
      duration: 15000,
      repeat: -1,
    });
  }

  preload() {
    this.load.setPath("assets");

    this.load.image(
      IMAGE_ASSET_KEY.BACKGROUND,
      "images/background/background.png"
    );
    this.load.image(
      IMAGE_ASSET_KEY.BACKGROUND,
      "images/background/ingame-background.png"
    );
    this.load.image(IMAGE_ASSET_KEY.CHARACTER_1, "images/character/01.png");
    this.load.image(IMAGE_ASSET_KEY.CHARACTER_2, "images/character/02.png");
    this.load.image(IMAGE_ASSET_KEY.CHARACTER_3, "images/character/03.png");
    this.load.image(IMAGE_ASSET_KEY.CHARACTER_4, "images/character/04.png");

    this.load.image(
      IMAGE_ASSET_KEY.QUESTION_HELPER,
      "images/helper/question-helper.png"
    );
    this.load.image(
      IMAGE_ASSET_KEY.WINNER_HELPER,
      "images/helper/winner-helper.png"
    );
    this.load.image(
      IMAGE_ASSET_KEY.LOSER_HELPER,
      "images/helper/loser-helper.png"
    );

    this.load.image(
      IMAGE_ASSET_KEY.BUTTON_O_OFF,
      "images/button/button-o-off.png"
    );
    this.load.image(
      IMAGE_ASSET_KEY.BUTTON_O_ON,
      "images/button/button-o-on.png"
    );
    this.load.image(
      IMAGE_ASSET_KEY.BUTTON_X_OFF,
      "images/button/button-x-off.png"
    );
    this.load.image(
      IMAGE_ASSET_KEY.BUTTON_X_ON,
      "images/button/button-x-on.png"
    );
    this.load.image(
      IMAGE_ASSET_KEY.BUTTON_JOIN,
      "images/button/button-join.png"
    );
    this.load.image(
      IMAGE_ASSET_KEY.BUTTON_REFRESH,
      "images/button/button-refresh.png"
    );
    this.load.image(IMAGE_ASSET_KEY.BUTTON_GOOGLE, "images/button/google.png");
    this.load.image(
      IMAGE_ASSET_KEY.FINGER_POINTER,
      "images/finger-pointer.png"
    );

    this.load.once("complete", () => {
      setTimeout(() => {
        this.#loadingHelperAnimation.destroy();
        this.scene.start(GAME_SCENE_KEY.LOGIN);
      }, 3000);
    });

    this.load.start();
  }

  create() {}
}
