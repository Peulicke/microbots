import * as Vec3 from "./Vec3";

export type Mat3 = [Vec3.Vec3, Vec3.Vec3, Vec3.Vec3];

export const newMat3 = (x: Vec3.Vec3, y: Vec3.Vec3, z: Vec3.Vec3): Mat3 => [x, y, z];

export const add = (a: Mat3, b: Mat3): void => {
    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            a[i][j] += b[i][j];
        }
    }
};

export const sub = (a: Mat3, b: Mat3): void => {
    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            a[i][j] -= b[i][j];
        }
    }
};

export const multiplyScalar = (a: Mat3, s: number): void => {
    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            a[i][j] *= s;
        }
    }
};

export const apply = (a: Mat3, b: Vec3.Vec3): Vec3.Vec3 => {
    const result: Vec3.Vec3 = [0, 0, 0];
    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            result[i] += a[i][j] * b[j];
        }
    }
    return result;
};
