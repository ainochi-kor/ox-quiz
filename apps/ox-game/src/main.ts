import { BootScene } from "./scenes/BootScene";
import { Game as MainGame } from "./scenes/Game";
import { AUTO, Game, Scale, Types } from "phaser";
import { PreloadScene } from "./scenes/PreloadScene";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
  type: AUTO,
  width: 1280,
  height: 1920,
  parent: "game-container",
  backgroundColor: "#ffffff",
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  scene: [BootScene, PreloadScene],
};

export default new Game(config);
