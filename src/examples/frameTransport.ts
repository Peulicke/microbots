import { Vec3, Bot, World } from "../core";

const r = 1;
const d = 5;

const frame = (pos: Vec3.Vec3) =>
    [...Array(2 * r + 1)]
        .map((_, i) =>
            [...Array(2 * r + 1)].map((_, j) =>
                [...Array(2 * r + 1)].map((_, k): [number, number, number] => [i - r, j - r, k - r])
            )
        )
        .flat()
        .flat()
        .filter(
            p => (Math.abs(p[0]) === r ? 1 : 0) + (Math.abs(p[1]) === r ? 1 : 0) + (Math.abs(p[2]) === r ? 1 : 0) >= 2
        )
        .map(p => Vec3.newVec3(p[0], p[1] + 0.5 + r, p[2]))
        .map(p => Vec3.add(p, pos));

const s: Vec3.Vec3[] = [
    ...frame([0, 0, d]),
    ...frame([0, 2 * r + 1, d]),
    ...frame([-d, 0, d]),
    ...frame([d, 0, -d]),
    ...frame([-d, 2 * r + 1, d])
];

const e: Vec3.Vec3[] = [
    ...frame([0, 0, d]),
    ...frame([0, 2 * r + 1, d]),
    ...frame([-d, 0, -d]),
    ...frame([d, 0, d]),
    ...frame([d, 2 * r + 1, d])
];

const start: World.World = {
    bots: s.map(
        (pos): Bot.Bot =>
            Bot.newBot({
                pos: pos
            })
    ),
    time: 0
};

const end: World.World = {
    bots: e.map(
        (pos): Bot.Bot =>
            Bot.newBot({
                pos: pos
            })
    ),
    time: 0
};

const example: { title: string; start: World.World; end: World.World } = {
    title: "Frame transport",
    start: start,
    end: end
};

export default example;
