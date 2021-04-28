import { Vec3, add, length, multiplyScalar, sub } from "./Vec3";

import { Bot } from "./Bot";
import PriorityQueue from "./PriorityQueue";

export type Grid = {
    [i: number]: {
        [j: number]: {
            [k: number]: boolean;
        };
    };
};

type Cell = {
    dist: number;
    distEstimate: number;
    pos: Vec3;
    prev: Cell | undefined;
};

type Solution = {
    [i: number]: {
        [j: number]: {
            [k: number]: Cell;
        };
    };
};

const equals = (a: Vec3, b: Vec3): boolean => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

const backtrack = (c: Cell): Vec3 => {
    const halfDist = c.dist / 2;
    let cell: Cell = c;
    for (; cell.prev !== undefined && cell.prev.dist > halfDist; cell = cell.prev);
    if (cell.prev === undefined) return cell.pos;
    const prevCell = cell.prev;
    const d1 = halfDist - prevCell.dist;
    const d2 = cell.dist - halfDist;
    const w = d1 / (d1 + d2);
    return add(multiplyScalar(prevCell.pos, 1 - w), multiplyScalar(cell.pos, w));
};

const round = (v: Vec3): Vec3 => [Math.round(v[0]), Math.round(v[1]), Math.round(v[2])];

const resolution = 3;

const midpoint = (grid: Grid, s: Vec3, e: Vec3): Vec3 => {
    const exactMidpoint = multiplyScalar(add(s, e), 0.5);
    if (length(sub(e, s)) < 1) return exactMidpoint;
    const start = round(s);
    const end = round(e);
    const checked: Solution = {};
    const check = new PriorityQueue((a: Cell, b: Cell): number => b.distEstimate - a.distEstimate);
    check.push({ dist: 0, distEstimate: 0, pos: start, prevPos: start });
    let iter = 0;
    for (; iter < 10000 && check.size() > 0; ) {
        const c = check.pop();
        const [x, y, z] = c.pos;
        if (y < 0.5 * resolution) continue;
        if (((grid[x] || {})[y] || {})[z] === true) continue;
        if (((checked[x] || {})[y] || {})[z] !== undefined) continue;
        if (checked[x] === undefined) checked[x] = {};
        if (checked[x][y] === undefined) checked[x][y] = {};
        checked[x][y][z] = c;
        if (equals(c.pos, end)) return backtrack(c);
        ++iter;
        for (let i = -1; i <= 1; ++i) {
            for (let j = -1; j <= 1; ++j) {
                for (let k = -1; k <= 1; ++k) {
                    if (i === 0 && j === 0 && k === 0) continue;
                    const p: Vec3 = [i, j, k];
                    const pos = add(c.pos, p);
                    const dist = c.dist + length(p);
                    check.push({
                        dist,
                        distEstimate: dist + length(sub(end, pos)),
                        pos,
                        prev: c
                    });
                }
            }
        }
    }
    return exactMidpoint;
};

export const botsToGrid = (bots: Bot[]): Grid => {
    const range = [...Array(2 * resolution + 1)].map((_, i) => (i / resolution - 1) * resolution * 0.5);
    const result: Grid = {};
    bots.forEach(bot => {
        range.forEach(a => {
            range.forEach(b => {
                range.forEach(c => {
                    const [i, j, k] = round(add(multiplyScalar(bot.pos, resolution), [a, b, c]));
                    if (result[i] === undefined) result[i] = {};
                    if (result[i][j] === undefined) result[i][j] = {};
                    result[i][j][k] = true;
                });
            });
        });
    });
    return result;
};

export default (grid: Grid, start: Vec3, end: Vec3): Vec3 =>
    multiplyScalar(midpoint(grid, multiplyScalar(start, resolution), multiplyScalar(end, resolution)), 1 / resolution);
