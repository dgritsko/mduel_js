import { items as itemsEnum } from "../enums/items";
import { gameConfig } from "../game/config";
import { mergeDeepRight } from "ramda";

const getSpawns = () => {
    const LEFT_SPAWNS = [{ x: 63, y: 300 }, { x: 128, y: 300 }];

    const RIGHT_SPAWNS = [
        { x: game.world.width - 63, y: 300 },
        { x: game.world.width - 128, y: 300 }
    ];

    return { LEFT_SPAWNS, RIGHT_SPAWNS };
};

const getDefaultPlayers = () => {
    const { LEFT_SPAWNS, RIGHT_SPAWNS } = getSpawns();

    return {
        players: [
            {
                name: "Percy",
                sprite: "player1",
                id: 1,
                teamId: 1,
                inputId: "k1"
            },
            {
                name: "Clifford",
                sprite: "player2",
                id: 2,
                teamId: 2,
                inputId: "k2"
            }
            // {
            //     name: "Mowbray",
            //     sprite: "player3",
            //     id: 3,
            //     teamId: 2,
            //     inputId: "k3"
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
        ]
    };
};

export const buildConfig = customConfig => {
    const baseConfig = {
        rounds: 0,
        maxRounds: 3,

        items: {
            availableItems: Object.values(itemsEnum),
            maxItems: gameConfig.MAX_ITEMS,

            minItemSpeed: gameConfig.ITEM_MINIMUM_SPEED,
            maxItemSpeed: gameConfig.ITEM_MAXIMUM_SPEED,

            minItemLifetime: gameConfig.ITEM_MINIMUM_LIFETIME,
            maxItemLifetime: gameConfig.ITEM_MAXIMUM_LIFETIME,

            initialSpawnDelay: gameConfig.ITEM_INITIAL_SPAWN_DELAY,

            minSpawnDelay: gameConfig.ITEM_MINIMUM_SPAWN_DELAY,
            maxSpawnDelay: gameConfig.ITEM_MAXIMUM_SPAWN_DELAY
        }
    };

    const { items, players } = customConfig;

    let config = Object.assign({}, baseConfig);

    if (items) {
        config = mergeDeepRight(config, { items });
    }

    if (players) {
        // TODO: Build teams
        const { LEFT_SPAWNS, RIGHT_SPAWNS } = getSpawns();

        const teams = players.map((p, i) => ({
            id: i + 1, // TODO
            name: p.name,
            spawns: i % 2 == 0 ? LEFT_SPAWNS : RIGHT_SPAWNS,
            score: 0
        }));

        config = Object.assign(config, { players, teams });
    } else {
        config = Object.assign(config, getDefaultPlayers());
    }

    return config;
};
