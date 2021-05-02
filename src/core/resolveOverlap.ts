import { Vec3, addEq, clone, length, multiplyScalar, sub, subEq } from "./Vec3";

import { Bot } from "./Bot";

type Grid = {
    [i: number]: {
        [j: number]: {
            [k: number]: {
                [l: number]: boolean;
            };
        };
    };
};

const equals = (a: Vec3, b: Vec3): boolean => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

const round = (v: Vec3): Vec3 => [Math.round(v[0]), Math.round(v[1]), Math.round(v[2])];

const addToGrid = (grid: Grid, pos: Vec3, i: number): void => {
    const [x, y, z] = round(pos);
    for (let dx = -1; dx <= 1; ++dx) {
        for (let dy = -1; dy <= 1; ++dy) {
            for (let dz = -1; dz <= 1; ++dz) {
                const a = x + dx;
                const b = y + dy;
                const c = z + dz;
                if (grid[a] === undefined) grid[a] = {};
                if (grid[a][b] === undefined) grid[a][b] = {};
                if (grid[a][b][c] === undefined) grid[a][b][c] = [];
                grid[a][b][c][i] = true;
            }
        }
    }
};

const removeFromGrid = (grid: Grid, pos: Vec3, i: number): void => {
    const [x, y, z] = round(pos);
    for (let dx = -1; dx <= 1; ++dx) {
        for (let dy = -1; dy <= 1; ++dy) {
            for (let dz = -1; dz <= 1; ++dz) {
                const a = x + dx;
                const b = y + dy;
                const c = z + dz;
                delete grid[a][b][c][i];
            }
        }
    }
};

export default (bots: Bot[]): (() => void) => {
    const prevPos = bots.map(bot => clone(bot.pos));
    const grid: Grid = {};
    for (let i = 0; i < bots.length; ++i) {
        addToGrid(grid, bots[i].pos, i);
    }
    return () => {
        for (let i = 0; i < bots.length; ++i) {
            if (equals(prevPos[i], bots[i].pos)) continue;
            removeFromGrid(grid, prevPos[i], i);
            addToGrid(grid, bots[i].pos, i);
        }
        for (let i = 0; i < bots.length; ++i) {
            const [x, y, z] = round(prevPos[i]);
            const list = Object.keys(grid[x][y][z]).map(key => Number(key));
            for (let l = 0; l < list.length; ++l) {
                const j = list[l];
                const b = bots[j];
                if (bots[i] === b) continue;
                const d = sub(b.pos, bots[i].pos);
                const dLength = length(d);
                if (dLength > 1) continue;
                const n = multiplyScalar(d, (1 - dLength) / dLength / 2);
                subEq(bots[i].pos, n);
                addEq(b.pos, n);
            }
        }
    };
};
