import * as Vec3 from "./Vec3";
import * as Mat3 from "./Mat3";
import { outerProduct } from "./utils";
import { SparseSymmetric, ldiv } from "./conjugateGradientSparse";
import * as Bot from "./Bot";
import delaunay from "./delaunay";
import Prando from "prando";

export type World = { bots: Bot.Bot[] };

export const newWorld = (): World => ({ bots: [] });

export const setBots = (bots: Bot.Bot[]) => (world: World): World => {
    world.bots = bots;
    return world;
};

let offset = 1.5;
let slack = 2;
export const setSlack = (s: number): void => {
    slack = s;
};
export const setOffset = (o: number): void => {
    offset = o;
};
const friction = 0.1;

export const edgeStrength = (d: number): number => {
    if (d < offset - slack / 2) return 1;
    if (d > offset + slack / 2) return 0;
    return (2 * (d + slack - offset) * (offset + slack / 2 - d) ** 2) / slack ** 3;
};

export const edgeStrengthGround = (d: number): number => edgeStrength(d) + 1e-4;

const stiffness = (d: Vec3.Vec3): Mat3.Mat3 => {
    const l = Vec3.length(d);
    d = Vec3.multiplyScalar(d, Math.sqrt(edgeStrength(l)) / l);
    return outerProduct(d, d);
};

const stiffnessGround = (d: Vec3.Vec3): Mat3.Mat3 => {
    const result = outerProduct(d, d);
    Mat3.multiplyScalar(result, edgeStrengthGround(Vec3.length(d)) / Vec3.dot(d, d));
    return result;
};

const stiffnessDerivative = (dim: number, d: Vec3.Vec3): Mat3.Mat3 => {
    const epsilon = 0.00001;
    const val = d[dim];
    const dPlus = Vec3.clone(d);
    dPlus[dim] = val + epsilon;
    const dMinus = Vec3.clone(d);
    dMinus[dim] = val - epsilon;
    const plus = stiffness(dPlus);
    const minus = stiffness(dMinus);
    Mat3.sub(plus, minus);
    Mat3.multiplyScalar(plus, 1 / (2 * epsilon));
    return plus;
};

const stiffnessPair = (a: Bot.Bot, b: Bot.Bot): Mat3.Mat3 => {
    const d = Vec3.sub(b.pos, a.pos);
    return stiffness(d);
};

const stiffnessPairDerivative = (a: Bot.Bot, dim: number, b: Bot.Bot): Mat3.Mat3 =>
    stiffnessDerivative(dim, Vec3.sub(a.pos, b.pos));

const stiffnessMatrix = (world: World, con: number[][], neigh: number[][]): SparseSymmetric => {
    const result: SparseSymmetric = [...Array(world.bots.length * 3)].map(() => []);
    for (let i = 0; i < world.bots.length; ++i) {
        const sx = stiffnessGround(Vec3.newVec3(world.bots[i].pos[1] + 0.5, 0, 0));
        const sy = stiffnessGround(Vec3.newVec3(0, world.bots[i].pos[1] + 0.5, 0));
        const sz = stiffnessGround(Vec3.newVec3(0, 0, world.bots[i].pos[1] + 0.5));
        for (let k = 0; k < 3; ++k) {
            for (let l = k; l < 3; ++l) {
                result[3 * i + k].push([3 * i + l, (sx[k][l] + sz[k][l]) * friction + sy[k][l]]);
            }
        }
    }
    for (let i = 0; i < world.bots.length; ++i) {
        neigh[i].forEach(j => {
            const s = stiffnessPair(world.bots[i], world.bots[j]);
            for (let k = 0; k < 3; ++k) {
                for (let l = 0; l < 3; ++l) {
                    result[3 * i + k].push([3 * j + l, -s[k][l]]);
                    if (k > l) continue;
                    result[3 * i + k][l - k][1] += s[k][l];
                    result[3 * j + k][l - k][1] += s[k][l];
                }
            }
        });
    }
    return result;
};

const forceMatrix = (before: World, after: World, dt: number, world: World): number[] => {
    const result = [...Array(world.bots.length * 3)].map(() => 0);
    world.bots.forEach((bot, i) => {
        for (let j = 0; j < 3; ++j) {
            const v1 = (world.bots[i].pos[j] - before.bots[i].pos[j]) / dt;
            const v2 = (after.bots[i].pos[j] - world.bots[i].pos[j]) / dt;
            const acc = (v2 - v1) / dt;
            result[3 * i + j] = ((j === 1 ? -1 : 0) - acc) * bot.weight;
        }
    });
    return result;
};

export const displacement = (
    before: World,
    after: World,
    dt: number,
    world: World,
    con: number[][],
    neigh: number[][]
): number[] => {
    const f = forceMatrix(before, after, dt, world);
    const k = stiffnessMatrix(world, con, neigh);
    return ldiv(k, f);
};

export const neighbors = (world: World, con: number[][], n: number): number[] => {
    const checked: { [key: string]: boolean } = {};
    const result: { [key: string]: boolean } = {};
    const checkI = [n];
    const checkLevel = [0];
    while (checkI.length > 0) {
        const i = checkI.shift()!;
        const level = checkLevel.shift()!;
        if (checked[i]) continue;
        checked[i] = true;
        const d = Vec3.dist(world.bots[n].pos, world.bots[i].pos);
        if (d > offset + slack / 2) continue;
        if (level === 1 && i > n) result[i] = true;
        if (d > 1.5 && !con[n].includes(i)) continue;
        if (i > n) result[i] = true;
        for (let c = 0; c < con[i].length; ++c) {
            const j = con[i][c];
            checkI.push(j);
            checkLevel.push(level + 1);
        }
    }
    return Object.keys(result)
        .map(v => Number(v))
        .sort();
};

export const gradient = (
    uBefore: number[],
    u: number[],
    uAfter: number[],
    beforeBefore: World,
    before: World,
    after: World,
    afterAfter: World,
    dt: number,
    world: World,
    neigh: number[][]
): Vec3.Vec3[] => {
    const udku = [...Array(world.bots.length)].map(() => [0, 1, 2].map(() => 0));
    for (let i = 0; i < world.bots.length; ++i) {
        for (let dim = 0; dim < 3; ++dim) {
            const sx = stiffnessDerivative(dim, Vec3.newVec3(world.bots[i].pos[1] + 0.5, 0, 0));
            Mat3.multiplyScalar(sx, friction);
            const sy = stiffnessDerivative(dim, Vec3.newVec3(0, world.bots[i].pos[1] + 0.5, 0));
            const sz = stiffnessDerivative(dim, Vec3.newVec3(0, 0, world.bots[i].pos[1] + 0.5));
            Mat3.multiplyScalar(sz, friction);
            const vi = Vec3.newVec3(u[3 * i], u[3 * i + 1], u[3 * i + 2]);
            Mat3.add(sx, sy);
            Mat3.add(sx, sz);
            const d = Vec3.dot(vi, Mat3.apply(sx, vi));
            udku[i][dim] += d;
            neigh[i].forEach(j => {
                const s = stiffnessPairDerivative(world.bots[i], dim, world.bots[j]);
                const vj = Vec3.newVec3(u[3 * j], u[3 * j + 1], u[3 * j + 2]);
                Vec3.subEq(vj, vi);
                const svisvj = Mat3.apply(s, vj);
                const diff = Vec3.dot(vj, svisvj);
                udku[i][dim] += diff;
                udku[j][dim] -= diff;
            });
        }
    }
    const result = [...Array(world.bots.length)].map(() => Vec3.newVec3(0, 0, 0));
    for (let i = 0; i < world.bots.length; ++i) {
        for (let dim = 0; dim < 3; ++dim) {
            result[i][dim] =
                -udku[i][dim] + 2 * ((-uBefore[3 * i + dim] + 2 * u[3 * i + dim] - uAfter[3 * i + dim]) / dt ** 2);
        }
    }
    const overlapPenalty = 1000;
    for (let i = 0; i < world.bots.length; ++i) {
        if (world.bots[i].pos[1] > 0.5) continue;
        const l = world.bots[i].pos[1] + 0.5;
        result[i][1] += 2 * overlapPenalty * (2 * (l - 2));
    }
    for (let i = 0; i < world.bots.length; ++i) {
        neigh[i].forEach(j => {
            let d = Vec3.sub(world.bots[j].pos, world.bots[i].pos);
            const l = Vec3.length(d);
            if (l > 1) return;
            d = Vec3.multiplyScalar(d, overlapPenalty * ((2 * (l - 2)) / l));
            Vec3.subEq(result[i], d);
            Vec3.addEq(result[j], d);
        });
    }
    for (let i = 0; i < world.bots.length; ++i) {
        const p1 = Vec3.multiplyScalar(beforeBefore.bots[i].pos, 2);
        const p2 = Vec3.multiplyScalar(before.bots[i].pos, -8);
        const p3 = Vec3.multiplyScalar(world.bots[i].pos, 12);
        const p4 = Vec3.multiplyScalar(after.bots[i].pos, -8);
        const p5 = Vec3.multiplyScalar(afterAfter.bots[i].pos, 2);
        Vec3.addEq(p1, p2);
        Vec3.addEq(p1, p3);
        Vec3.addEq(p1, p4);
        Vec3.addEq(p1, p5);
        Vec3.addEq(result[i], Vec3.multiplyScalar(p1, 100 / dt ** 4));
    }
    return result;
};

const rng = new Prando(123);

const rand = () => Vec3.multiplyScalar(Vec3.newVec3(rng.next() - 0.5, rng.next() - 0.5, rng.next() - 0.5), 0.1);

export const connections = (world: World): number[][] => delaunay(world.bots.map(bot => Vec3.add(bot.pos, rand())));
