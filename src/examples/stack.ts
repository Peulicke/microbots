import { Bot, World } from "../core";

const world: World.World = {
    bots: [
        ...[...Array(5)].map(
            (_, i): Bot.Bot =>
                Bot.newBot({
                    pos: [i, 0.5, 0],
                    target: t => {
                        if (t > 0.9999) return [0, 0.5 + i, 0];
                    },
                    weight: 1
                })
        )
    ]
};

const example: { title: string; world: World.World } = {
    title: "Stack",
    world: world
};

export default example;
