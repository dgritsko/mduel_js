import PIXI from "expose-loader?PIXI!phaser-ce/build/custom/pixi.js";
import p2 from "expose-loader?p2!phaser-ce/build/custom/p2.js";
import Phaser from "expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js";

import {
    bootState,
    gameState,
    gameStartState,
    sandboxState,
    scoreboardState,
    lobbyState
} from "./states";
import { gameConfig } from "./game/config";
import { gameStates } from "./enums/gameStates";

const game = new Phaser.Game(
    gameConfig.GAME_CONTAINER_WIDTH,
    gameConfig.GAME_CONTAINER_HEIGHT,
    Phaser.AUTO,
    "game"
);

window.game = game;

game.state.add(gameStates.BOOT, bootState);
game.state.add(gameStates.GAME_START, gameStartState);
game.state.add(gameStates.GAME, gameState);
game.state.add(gameStates.SCOREBOARD, scoreboardState);
game.state.add(gameStates.SANDBOX, sandboxState);
game.state.add(gameStates.LOBBY, lobbyState);

game.state.start(gameStates.BOOT);
