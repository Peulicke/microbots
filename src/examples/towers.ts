import { Vec3, Bot, World } from "../core";

const s: Vec3.Vec3[] = [
    [2, 0.5, 0],
    [2, 1.5, 0],
    [2, 2.5, 0],
    [2, 3.5, 0],
    [2, 4.5, 0],
    [-2, 0.5, 0],
    [-2, 1.5, 0],
    [-2, 2.5, 0],
    [-2, 3.5, 0],
    [-2, 4.5, 0],
    [2, 5.5, 0]
];
const e: Vec3.Vec3[] = [
    [2, 0.5, 0],
    [2, 1.5, 0],
    [2, 2.5, 0],
    [2, 3.5, 0],
    [2, 4.5, 0],
    [-2, 0.5, 0],
    [-2, 1.5, 0],
    [-2, 2.5, 0],
    [-2, 3.5, 0],
    [-2, 4.5, 0],
    [-2, 5.5, 0]
];

const start: World.World = {
    bots: s.map(
        (pos): Bot.Bot =>
            Bot.newBot({
                pos: pos
            })
    )
};

const end: World.World = {
    bots: e.map(
        (pos): Bot.Bot =>
            Bot.newBot({
                pos: pos
            })
    )
};

const example: { title: string; start: World.World; end: World.World } = {
    title: "Towers",
    start: start,
    end: end
};

export default example;
