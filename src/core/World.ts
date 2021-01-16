import update from "immutability-helper";
import { matrix, Matrix, transpose, subtract, dot, multiply, divide, subset, index, zeros, range, add } from "mathjs";
import { Bot } from "./Bot";

export type World = { readonly bots: Bot[]; readonly edges: Matrix };

export const newWorld = (): World => ({ bots: [], edges: matrix([]) });

export const setBots = (bots: Bot[]) => (world: World): World => update(world, { bots: { $set: bots } });

export const initEdges = (world: World): World => {
    const list = [...Array(world.bots.length)].map(() => 1);
    return update(world, {
        edges: { $set: matrix(list.map(() => list)) }
    });
};

export const outerProduct = (a: Matrix, b: Matrix): Matrix =>
    multiply(transpose(matrix([a.toArray() as number[]])), matrix([b.toArray() as number[]]));

export const stiffness = (a: Bot, b: Bot, edge: number): Matrix => {
    const d = subtract(b.pos, a.pos) as Matrix;
    return multiply(divide(outerProduct(d, d), dot(d, d)) as Matrix, -edge);
};

export const stiffnessMatrix = (world: World): Matrix => {
    const size = 3 * world.edges.size()[0];
    let result = matrix(zeros(size, size));
    (world.edges.toArray() as number[][]).forEach((row, i) => {
        row.forEach((edge, j) => {
            if (i === j) return;
            const s = stiffness(world.bots[i], world.bots[j], edge);
            const ri = range(3 * i, 3 * i + 3);
            const rj = range(3 * j, 3 * j + 3);
            const ii = index(ri, ri);
            const ij = index(ri, rj);
            result = subset(result, ii, subtract(subset(result, ii), s));
            result = subset(result, ij, add(subset(result, ij), s));
        });
    });
    return result;
};

export const forceMatrix = (world: World): Matrix => matrix(world.bots.map(bot => [0, -bot.weight, 0]).flat());

export const optimize = (world: World): World => {
    return world;
};
