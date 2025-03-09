import { BootScene } from "./scenes/BootScene";
import { AUTO, Game, Scale, Types } from "phaser";
import { PreloadScene } from "./scenes/PreloadScene";
import { LobbyScene } from "./scenes/LobbyScene";

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
  scene: [BootScene, PreloadScene, LobbyScene],
};

export default new Game(config);
