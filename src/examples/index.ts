import { Vec3, Bot, World } from "../core";
import towers from "./towers";
import stack from "./stack";
import cube from "./cube";
import bigCube from "./bigCube";

export const examples = [towers, stack, cube, bigCube].sort((a, b) => {
    const d = a.data[0].length - b.data[0].length;
    if (d === 0) return a.title > b.title ? 1 : -1;
    return d;
});

const toWorld = (index: number, time: number): World.World =>
    World.setBots(examples[index].data[time].map(p => Bot.setPos(Vec3.newVec3(p[0], p[1], p[2]))(Bot.newBot())))(
        World.newWorld()
    );

export default (index: number): [World.World, World.World] => [toWorld(index, 0), toWorld(index, 1)];
