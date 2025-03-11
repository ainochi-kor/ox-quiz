import { BootScene } from "./scenes/BootScene";
import { AUTO, Game, Scale, Types } from "phaser";
import { PreloadScene } from "./scenes/PreloadScene";
import { LobbyScene } from "./scenes/LobbyScene";
import { LoginScene } from "./scenes/LoginScene";
import { GameScene } from "./scenes/GameScene";
import { LAYOUT_SIZE } from "./constants/config";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
  type: AUTO,
  width: LAYOUT_SIZE.width,
  height: LAYOUT_SIZE.height,
  parent: "game-container",
  backgroundColor: "#ffffff",
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  scene: [BootScene, PreloadScene, LoginScene, LobbyScene, GameScene],
};

export default new Game(config);
