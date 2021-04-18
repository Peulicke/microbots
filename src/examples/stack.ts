import { Bot, World } from "../core";

const start: World.World = {
    bots: [
        ...[...Array(5)].map(
            (_, i): Bot.Bot =>
                Bot.newBot({
                    pos: [i, 0.5, 0]
                })
        )
    ],
    time: 0
};

const end: World.World = {
    bots: [
        ...[...Array(5)].map(
            (_, i): Bot.Bot =>
                Bot.newBot({
                    pos: [0, 0.5 + i, 0]
                })
        )
    ],
    time: 0
};

const example: { title: string; start: World.World; end: World.World } = {
    title: "Stack",
    start: start,
    end: end
};

export default example;
