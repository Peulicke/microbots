import { Example as ExampleType } from "./utils";
import { World } from "../core";
import arc from "./arc";
import bigArc from "./bigArc";
import bigCube from "./bigCube";
import box from "./box";
import brachiation from "./brachiation";
import crane from "./crane";
import floorTransport from "./floorTransport";
import frameTransport from "./frameTransport";
import planeToBridge1000 from "./planeToBridge1000";
import planeToBridge10000 from "./planeToBridge10000";
import platform from "./platform";
import platforms from "./platforms";
import platformsTall from "./platformsTall";
import rollingBox from "./rollingBox";
import stack from "./stack";
import towersShort from "./towersShort";
import towersTall from "./towersTall";
import transformer from "./transformer";
import transport from "./transport";
import verticalTransport from "./verticalTransport";
import wall from "./wall";
export type Example = ExampleType;

export const examples = [
    arc,
    bigArc,
    bigCube,
    box,
    brachiation,
    crane,
    floorTransport,
    frameTransport,
    planeToBridge1000,
    planeToBridge10000,
    platform,
    platforms,
    platformsTall,
    rollingBox,
    stack,
    towersShort,
    towersTall,
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
