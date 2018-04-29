import { gameStates } from "../enums/gameStates";

let config;

function init(data) {
    config = data;
}

function create() {
    const description = describe(config);

    const text = game.add.bitmapText(
        game.world.centerX,
        game.world.centerY,
        "mduel-menu",
        description,
        16
    );

    text.anchor.setTo(0.5);

    text.tint = 0xa439a4;

    window.setTimeout(() => {
        game.state.start(gameStates.GAME, true, false, config);
    }, 5000);
}

function describe(config) {
    if (config.rounds === 0) {
        return `${teamOne.name} vs. ${teamTwo.name}`;
    }

    const teamOne = config.teams.filter(t => t.id === 1)[0];
    const teamTwo = config.teams.filter(t => t.id === 2)[0];

    if (teamOne.score === config.maxRounds) {
        return `${teamOne.name} wins series, ${teamOne.score} - ${
            teamTwo.score
        }`;
    }

    if (teamTwo.score === config.maxRounds) {
        return `${teamTwo.name} wins series, ${teamTwo.score} - ${
            teamOne.score
        }`;
    }

    if (teamOne.score === teamTwo.score) {
        return `Series Tied, ${teamOne.score} - ${teamTwo.score}`;
    }

    return teamOne.score > teamTwo.score
        ? `${teamOne.name} leads series, ${teamOne.score} - ${teamTwo.score}`
        : `${teamTwo.name} leads series, ${teamTwo.score} - ${teamOne.score}`;
}

export default { init, create };
