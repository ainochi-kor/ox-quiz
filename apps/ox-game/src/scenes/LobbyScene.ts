import { Scene } from "phaser";
import { GAME_SCENE_KEY } from "../constants/config";
import { IMAGE_ASSET_KEY } from "../constants/assets";
import userStore from "../store/user-store";

export class LobbyScene extends Scene {
  constructor() {
    super(GAME_SCENE_KEY.LOBBY);
  }

  init() {
    console.log(userStore.getState());
    this.add.image(0, 0, IMAGE_ASSET_KEY.BACKGROUND).setOrigin(0);
  }

  preload() {
    this.load.setPath("assets");
  }

  create() {}
}
