import { Example as ExampleType } from "./utils";
import { World } from "../core";
import arc from "./arc";
import bigArc from "./bigArc";
import bigCube from "./bigCube";
import brachiation from "./brachiation";
import crane from "./crane";
import cube from "./cube";
import floorTransport from "./floorTransport";
import frameTransport from "./frameTransport";
import platform from "./platform";
import platforms from "./platforms";
import stack from "./stack";
import towers from "./towers";
import transformer from "./transformer";
import transport from "./transport";
import verticalTransport from "./verticalTransport";
import wall from "./wall";
export type Example = ExampleType;

export const examples = [
    arc,
    bigArc,
    bigCube,
    brachiation,
    crane,
    cube,
    floorTransport,
    frameTransport,
    platform,
    platforms,
    stack,
    towers,
    transformer,
    transport,
    verticalTransport,
    wall
].sort((a, b) => {
    const d = a.start.bots.length - b.start.bots.length;
    if (d === 0) return a.title > b.title ? 1 : -1;
    return d;
});

export default (example: Example): [World.World, World.World] => [World.clone(example.start), World.clone(example.end)];
