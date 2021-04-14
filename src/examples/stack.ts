import { Bot, World } from "../core";

const world: World.World = {
    bots: [
        ...[...Array(5)].map(
            (_, i): Bot.Bot =>
                Bot.newBot({
                    pos: [i, 0.5, 0],
                    target: [0, 0.5 + i, 0],
                    weight: 10
                })
        )
    ],
    time: 0
};

const example: { title: string; world: World.World } = {
    title: "Stack",
    world: world
};

export default example;
