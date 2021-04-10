import { Bot, World } from "../core";

const world: World.World = {
    bots: [
        ...[...Array(9)].map((_, i): Bot.Bot => Bot.newBot({ pos: [i - 3.5, 0.5, 0], weight: 0.3 })),
        Bot.newBot({
            pos: [0.5, 0.5, 1],
            target: t => {
                if (Math.abs(t - 0.4) < 0.03) return [1, 3.5, 1];
                if (Math.abs(t - 0.6) < 0.03) return [-1, 3.5, 1];
                if (Math.abs(t - 0.8) < 0.03) return [-1, 3.5, -1];
                if (Math.abs(t - 1) < 0.03) return [1, 3.5, -1];
            }
        })
    ],
    time: 0
};

const example: { title: string; world: World.World } = {
    title: "Targets",
    world: world
};

export default example;
