import { Vec3, Bot, World } from "../core";
import towers from "./towers";
import stack from "./stack";
import cube from "./cube";

export const examples = [towers, stack, cube];

const toWorld = (index: number, time: number): World.World =>
    World.setBots(examples[index].data[time].map(p => Bot.setPos(Vec3.newVec3(p[0], p[1], p[2]))(Bot.newBot())))(
        World.newWorld()
    );

export default (index: number): [World.World, World.World] => [toWorld(index, 0), toWorld(index, 1)];
