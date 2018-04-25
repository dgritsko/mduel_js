import PIXI from "expose-loader?PIXI!phaser-ce/build/custom/pixi.js";
import p2 from "expose-loader?p2!phaser-ce/build/custom/p2.js";
import Phaser from "expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js";

import { bootState, gameState, sandboxState, scoreboardState } from "./states";

const game = new Phaser.Game(640, 400, Phaser.AUTO, "game");

window.game = game;

game.state.add("Boot", bootState);
game.state.add("Game", gameState);
game.state.add("Scoreboard", scoreboardState);
game.state.add("Sandbox", sandboxState);

game.state.start("Boot");
