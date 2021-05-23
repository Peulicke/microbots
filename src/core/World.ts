import * as Bot from "./Bot";
import * as BoundingBox from "./BoundingBox";
import * as Mat3 from "./Mat3";
import * as Vec3 from "./Vec3";

import { SparseSymmetric, ldiv } from "./conjugateGradientSparse";

import Prando from "prando";
import delaunay from "./delaunay";
import { outerProduct } from "./utils";

export type World = { bots: Bot.Bot[] };

export const newWorld = (): World => ({ bots: [] });

export const clone = (world: World): World => ({ bots: world.bots.map(bot => Bot.clone(bot)) });

const edgeStrength = (offset: number, slack: number, d: number): number => {
    if (d < offset - slack / 2) return 1;
    if (d > offset + slack / 2) return 0;
    return (2 * (d + slack - offset) * (offset + slack / 2 - d) ** 2) / slack ** 3;
};

const edgeStrengthGround = (offset: number, slack: number, d: number): number => edgeStrength(offset, slack, d) + 1e-4;

const stiffness = (offset: number, slack: number, d: Vec3.Vec3): Mat3.Mat3 => {
    const l = Vec3.length(d);
    const s = Vec3.multiplyScalar(d, Math.sqrt(edgeStrength(offset, slack, l)) / l);
    return outerProduct(s, s);
};

const stiffnessGround = (offset: number, slack: number, d: Vec3.Vec3): Mat3.Mat3 => {
    const result = outerProduct(d, d);
    Mat3.multiplyScalar(result, edgeStrengthGround(offset, slack, Vec3.length(d)) / Vec3.dot(d, d));
    return result;
};

const stiffnessDerivative = (offset: number, slack: number, dim: number, d: Vec3.Vec3): Mat3.Mat3 => {
    const epsilon = 0.00001;
    const val = d[dim];
    const dPlus = Vec3.clone(d);
    dPlus[dim] = val + epsilon;
    const dMinus = Vec3.clone(d);
    dMinus[dim] = val - epsilon;
    const plus = stiffness(offset, slack, dPlus);
    const minus = stiffness(offset, slack, dMinus);
    Mat3.sub(plus, minus);
    Mat3.multiplyScalar(plus, 1 / (2 * epsilon));
    return plus;
};

const stiffnessPair = (offset: number, slack: number, a: Bot.Bot, b: Bot.Bot): Mat3.Mat3 => {
    const d = Vec3.sub(b.pos, a.pos);
    return stiffness(offset, slack, d);
};

const stiffnessPairDerivative = (offset: number, slack: number, a: Bot.Bot, dim: number, b: Bot.Bot): Mat3.Mat3 =>
    stiffnessDerivative(offset, slack, dim, Vec3.sub(a.pos, b.pos));

const stiffnessMatrix = (
    offset: number,
    slack: number,
    friction: number,
    world: World,
    neigh: number[][]
): SparseSymmetric => {
    const result: SparseSymmetric = [...Array(world.bots.length * 3)].map(() => []);
    for (let i = 0; i < world.bots.length; ++i) {
        const sx = stiffnessGround(offset, slack, Vec3.newVec3(world.bots[i].pos[1] + 0.5, 0, 0));
        const sy = stiffnessGround(offset, slack, Vec3.newVec3(0, world.bots[i].pos[1] + 0.5, 0));
        const sz = stiffnessGround(offset, slack, Vec3.newVec3(0, 0, world.bots[i].pos[1] + 0.5));
        for (let k = 0; k < 3; ++k) {
            for (let l = k; l < 3; ++l) {
                result[3 * i + k].push([3 * i + l, (sx[k][l] + sz[k][l]) * friction + sy[k][l]]);
            }
        }
    }
    for (let i = 0; i < world.bots.length; ++i) {
        neigh[i].forEach(j => {
            const s = stiffnessPair(offset, slack, world.bots[i], world.bots[j]);
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

const forceMatrix = (before: World, after: World, dt: number, g: number, m: number, world: World): number[] => {
    const result = [...Array(world.bots.length * 3)].map(() => 0);
    world.bots.forEach((_, i) => {
        for (let j = 0; j < 3; ++j) {
            const v1 = (world.bots[i].pos[j] - before.bots[i].pos[j]) / dt;
            const v2 = (after.bots[i].pos[j] - world.bots[i].pos[j]) / dt;
            const acc = (v2 - v1) / dt;
            result[3 * i + j] = ((j === 1 ? -1 : 0) - acc) * g * m;
        }
    });
    return result;
};

export const displacement = (
    offset: number,
    slack: number,
    friction: number,
    before: World,
    after: World,
    dt: number,
    g: number,
    m: number,
    world: World,
    neigh: number[][]
): number[] => {
    const f = forceMatrix(before, after, dt, g, m, world);
    const k = stiffnessMatrix(offset, slack, friction, world, neigh);
    return ldiv(k, f);
};

export const neighbors = (neighborRadius: number, world: World, con: number[][], n: number): number[] =>
    con[n]
        .filter(i => i > n)
        .filter(i => {
            const d = Vec3.dist(world.bots[n].pos, world.bots[i].pos);
            return d < neighborRadius;
        });

export const gradient = (
    offset: number,
    slack: number,
    friction: number,
    overlapPenalty: number,
    uBefore: number[],
    u: number[],
    uAfter: number[],
    beforeBefore: World,
    before: World,
    after: World,
    afterAfter: World,
    dt: number,
    world: World,
    neigh: number[][],
    t: number
): Vec3.Vec3[] => {
    const udku = [...Array(world.bots.length)].map(() => [0, 1, 2].map(() => 0));
    for (let i = 0; i < world.bots.length; ++i) {
        for (let dim = 0; dim < 3; ++dim) {
            const sx = stiffnessDerivative(offset, slack, dim, Vec3.newVec3(world.bots[i].pos[1] + 0.5, 0, 0));
            Mat3.multiplyScalar(sx, friction);
            const sy = stiffnessDerivative(offset, slack, dim, Vec3.newVec3(0, world.bots[i].pos[1] + 0.5, 0));
            const sz = stiffnessDerivative(offset, slack, dim, Vec3.newVec3(0, 0, world.bots[i].pos[1] + 0.5));
            Mat3.multiplyScalar(sz, friction);
            const vi = Vec3.newVec3(u[3 * i], u[3 * i + 1], u[3 * i + 2]);
            Mat3.add(sx, sy);
            Mat3.add(sx, sz);
            const d = Vec3.dot(vi, Mat3.apply(sx, vi));
            udku[i][dim] += d;
            neigh[i].forEach(j => {
                const s = stiffnessPairDerivative(offset, slack, world.bots[i], dim, world.bots[j]);
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
        const dest = Bot.interpolate(
            t,
            dt,
            beforeBefore.bots[i].pos,
            before.bots[i].pos,
            after.bots[i].pos,
            afterAfter.bots[i].pos
        );
        const d = Vec3.sub(dest, world.bots[i].pos);
        Vec3.addEq(result[i], Vec3.multiplyScalar(d, -0.1));
    }
    return result;
};

const rng = new Prando(123);

const rand = () => Vec3.multiplyScalar(Vec3.newVec3(rng.next() - 0.5, rng.next() - 0.5, rng.next() - 0.5), 0.1);

export const connections = (positions: Vec3.Vec3[]): number[][] =>
    delaunay(
        [...positions, ...positions.map((pos): Vec3.Vec3 => [pos[0], -0.5, pos[2]])].map(pos => Vec3.add(pos, rand()))
    )
        .map(con => con.map(c => (c >= positions.length ? -1 : c)))
        .slice(0, positions.length);

export const boundingBox = (world: World): BoundingBox.BoundingBox => {
    if (world.bots.length === 0)
        return {
            min: [0, 0, 0],
            max: [0, 0, 0]
        };
    let result = Bot.boundingBox(world.bots[0]);
    world.bots.forEach(bot => {
        result = BoundingBox.merge(result, Bot.boundingBox(bot));
    });
    return result;
};
