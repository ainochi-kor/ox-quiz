import { Scene } from "phaser";
import { GAME_SCENE_KEY } from "../constants/config";
import { IMAGE_ASSET_KEY, SPLASH_ASSET_KEY } from "../constants/assets";

export class BootScene extends Scene {
  constructor() {
    super(GAME_SCENE_KEY.BOOT);
  }

  preload() {
    this.load.image(SPLASH_ASSET_KEY.SPLASH, "assets/images/splash.png");
    this.load.image(
      IMAGE_ASSET_KEY.LOADING_HELPER,
      "assets/images/helper/loading-helper.png"
    );
  }

  create() {
    this.scene.start(GAME_SCENE_KEY.PRELOAD);
  }
}
