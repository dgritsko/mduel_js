import { gameStates } from "../enums/gameStates";

function create() {
    const LEFT_SPAWNS = [{ x: 63, y: 300 }, { x: 128, y: 300 }];

    const RIGHT_SPAWNS = [
        { x: game.world.width - 63, y: 300 },
        { x: game.world.width - 128, y: 300 }
    ];

    const config = {
        players: [
            {
                name: "Percy",
                sprite: "player1",
                id: 1,
                teamId: 1
            },

            {
                name: "Clifford",
                sprite: "player2",
                id: 2,
                teamId: 2
            }

            // {
            //     name: "Mowbray",
            //     sprite: "player3",
            //     id: 3,
            //     teamId: 2
            // }
        ],
        teams: [
            {
                id: 1,
                name: "Percy",
                spawns: LEFT_SPAWNS,
                score: 0
            },
            {
                id: 2,
                name: "Clifford",
                spawns: RIGHT_SPAWNS,
                score: 0
            }
        ],
        rounds: 0,
        maxRounds: 3
    };

    game.state.start(gameStates.GAME, true, false, config);
}

export default { create };
