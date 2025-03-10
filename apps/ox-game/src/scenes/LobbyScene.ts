import { GameObjects, Scene } from "phaser";
import { GAME_SCENE_KEY } from "../constants/config";
import { IMAGE_ASSET_KEY } from "../constants/assets";
import userStore from "../store/user-store";
import { getQuizRoomList } from "../api/quiz.api";
import { QuizRoom } from "@repo/ox-game-helper/types/types.js";

export class LobbyScene extends Scene {
  quizRoomList: QuizRoom[] = [];
  #scrollContainer: GameObjects.Container;

  isCreated = false;
  #createdRoomIdList: string[] = [];

  constructor() {
    super(GAME_SCENE_KEY.LOBBY);
  }

  init() {
    console.log(userStore.getState());
    this.add.image(0, 0, IMAGE_ASSET_KEY.BACKGROUND).setOrigin(0);
  }

  async preload() {
    this.#createQuizRoomList();
  }

  create() {}

  async #createQuizRoomList() {
    this.quizRoomList = await getQuizRoomList();
    this.#scrollContainer = this.add.container(0, 0);
    this.#createdRoomIdList = [];

    this.quizRoomList.forEach((room, index) => {
      this.#createdRoomIdList.push(room.id);
      const item = this.#createQuizRoom(room);
      item.setPosition(0, index * 120 + 20); // Position each item vertically with spacing
      this.#scrollContainer.add(item);
    });
    this.isCreated = true;
  }

  #createQuizRoom(quiz: QuizRoom) {
    const item = this.add.container(0, 0);

    item.setData("quiz", quiz); // Store the room data in the container

    const background = this.add.graphics();
    background.fillStyle(0xffffff, 1); // White background color
    background.fillRoundedRect(0, 0, 312, 80, 4); // Border radius

    item.add(background);

    const titleText = this.add
      .text(100, 130, quiz.title, {
        fontSize: "80px",
        color: "#000",
      })
      .setName("titleText");
    item.add(titleText);

    const joinButton = this.add
      .image(900, 100, IMAGE_ASSET_KEY.BUTTON_JOIN)
      .setOrigin(0);
    joinButton.setInteractive();

    joinButton.on("pointerdown", () => {
      this.scene.start(GAME_SCENE_KEY.GAME, {
        id: quiz.id,
      });
      joinButton.disableInteractive();
    });

    joinButton.on("pointerover", () => {
      joinButton.setScale(1.05);
    });

    joinButton.on("pointerout", () => {
      joinButton.setScale(1.0);
    });

    item.add(joinButton);

    return item;
  }
}
