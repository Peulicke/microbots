import { Vec3, Bot, World } from "../core";

const r = 6;
const h = 3;
const w = 2;

const floor = () =>
    [...Array(2 * r + 1)]
        .map((_, i) => [...Array(2 * r + 1)].map((_, j): [number, number, number] => [i - r, 0.5, j - r]))
        .flat()
        .filter(p => Math.abs(p[0] + p[2]) < w);

const start: Vec3.Vec3[] = [
    ...floor(),
    ...[...Array(h)].map((_, i): [number, number, number] => [-r, i + 1.5, r]),
    ...[...Array(h)].map((_, i): [number, number, number] => [r, i + 1.5, -r]),
    [-r, h + 1.5, r]
];

const end: Vec3.Vec3[] = [
    ...floor(),
    ...[...Array(h)].map((_, i): [number, number, number] => [-r, i + 1.5, r]),
    ...[...Array(h)].map((_, i): [number, number, number] => [r, i + 1.5, -r]),
    [r, h + 1.5, -r]
];

const world: World.World = {
    bots: start.map(
        (pos, i): Bot.Bot =>
            Bot.newBot({
                pos: pos,
                target: end[i],
                weight: 1
            })
    ),
    time: 0
};

const example: { title: string; world: World.World } = {
    title: "Floor transport",
    world: world
};

export default example;
