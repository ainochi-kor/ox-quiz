import { Player } from "@repo/ox-game-helper/types/types.js";
import { Scene } from "phaser";

export class PlayersInGame {
  #scene: Scene;
  playerList: Record<string, Player>;
  playerImageList: Map<string, Phaser.GameObjects.Image> = new Map();

  #initialPosition = {
    x: 40,
    y: 500,
  };
  #rangePosition = {
    x: 400,
    y: 800,
  };

  constructor(scene: Scene) {
    this.#scene = scene;
  }

  createPlayersInGame(players: Record<string, Player>) {
    this.playerList = players;
    Object.values(this.playerList).forEach((player, index) => {
      this.createPlayerImage(player, index);
    });
  }

  movePlayer(movedPlayer: Player) {
    this.playerList = Object.assign({}, this.playerList, movedPlayer);

    let isCreatedImage = false;

    console.log(this.playerList);

    Object.values(this.playerList).forEach((player, index) => {
      if (player.id === movedPlayer.id) {
        const playerImage = this.playerImageList.get(player.id);
        playerImage?.setPosition(
          this.#initialPosition.x +
            this.#getInitialXPosition(movedPlayer) +
            Math.random() * this.#rangePosition.x,
          this.#initialPosition.y + Math.random() * this.#rangePosition.y
        );
        isCreatedImage = true;
      }
    });

    if (!isCreatedImage) {
      this.createPlayerImage(movedPlayer, this.playerImageList.size);
    }
  }

  createPlayerImage(player: Player, index: number) {
    const playerImage = this.#scene.add
      .image(
        this.#initialPosition.x +
          this.#getInitialXPosition(player) +
          Math.random() * this.#rangePosition.x,
        this.#initialPosition.y + Math.random() * this.#rangePosition.y,
        player.characterImageId
      )
      .setOrigin(0);

    this.playerImageList.set(player.id, playerImage);
  }

  deletePlayersInGame() {
    this.playerImageList?.forEach((playerImage) => playerImage.destroy());
    this.playerImageList?.clear();
  }

  #getInitialXPosition(player: Player) {
    return player.position ? 0 : 630;
  }
}
