import * as World from "./World";
import { Vec3, addEq, clone, length, multiplyScalar, sub, subEq } from "./Vec3";
import { Bot } from "./Bot";

type Element = {
    value: number;
    next: Element | null;
};

type Grid = {
    min: Vec3;
    max: Vec3;
    bots: {
        [i: number]: {
            [j: number]: {
                [k: number]: Element | null;
            };
        };
    };
};

const floor = (v: Vec3): Vec3 => [Math.floor(v[0]), Math.floor(v[1]), Math.floor(v[2])];

const round = (v: Vec3): Vec3 => [Math.round(v[0]), Math.round(v[1]), Math.round(v[2])];

const ceil = (v: Vec3): Vec3 => [Math.ceil(v[0]), Math.ceil(v[1]), Math.ceil(v[2])];

const createGrid = (bots: Bot[]): Grid => {
    const bb = World.boundingBox({ bots });
    bb.min = floor(bb.min);
    bb.max = ceil(bb.max);
    return {
        min: bb.min,
        max: bb.max,
        bots: [...Array(bb.max[0] - bb.min[0] + 1)].map(() =>
            [...Array(bb.max[1] - bb.min[1] + 1)].map(() => [...Array(bb.max[2] - bb.min[2] + 1)].map(() => null))
        )
    };
};

const addToGrid = (grid: Grid, pos: Vec3, i: number): void => {
    const [x, y, z] = round(pos);
    for (let dx = -1; dx <= 1; ++dx) {
        for (let dy = -1; dy <= 1; ++dy) {
            for (let dz = -1; dz <= 1; ++dz) {
                const a = x + dx - grid.min[0];
                const b = y + dy - grid.min[1];
                const c = z + dz - grid.min[2];
                if (a < 0) continue;
                if (b < 0) continue;
                if (c < 0) continue;
                if (a > grid.max[0] - grid.min[0]) continue;
                if (b > grid.max[1] - grid.min[1]) continue;
                if (c > grid.max[2] - grid.min[2]) continue;
                const e = grid.bots[a][b][c];
                grid.bots[a][b][c] = {
                    value: i,
                    next: e
                };
            }
        }
    }
};

export default (bots: Bot[]): void => {
    for (let iter = 0; iter < 5; ++iter) {
        const prevPos = bots.map(bot => clone(bot.pos));
        const grid = createGrid(bots);
        for (let i = 0; i < bots.length; ++i) {
            addToGrid(grid, bots[i].pos, i);
        }
        for (let i = 0; i < bots.length; ++i) {
            const [x, y, z] = sub(round(prevPos[i]), grid.min);
            for (let e = grid.bots[x][y][z]; e !== null; e = e.next) {
                const j = e.value;
                const b = bots[j];
                if (bots[i] === b) continue;
                const d = sub(b.pos, bots[i].pos);
                const dLength = length(d);
                if (dLength > 1) continue;
                const n = multiplyScalar(d, (1 - dLength) / dLength / 2);
                if (bots[i].fixed) addEq(b.pos, n);
                else subEq(bots[i].pos, n);
                if (b.fixed) subEq(bots[i].pos, n);
                else addEq(b.pos, n);
            }
        }
        for (let i = 0; i < bots.length; ++i) {
            bots[i].pos[1] = Math.max(bots[i].pos[1], 0.5);
        }
    }
};
