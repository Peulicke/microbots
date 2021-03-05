export type Vec3 = [number, number, number];

export const newVec3 = (x: number, y: number, z: number): Vec3 => [x, y, z];

export const clone = (a: Vec3): Vec3 => [a[0], a[1], a[2]];

export const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

export const addEq = (a: Vec3, b: Vec3): void => {
    a[0] += b[0];
    a[1] += b[1];
    a[2] += b[2];
};

export const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

export const subEq = (a: Vec3, b: Vec3): void => {
    a[0] -= b[0];
    a[1] -= b[1];
    a[2] -= b[2];
};

export const multiplyScalar = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];

export const dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export const length = (a: Vec3): number => Math.sqrt(dot(a, a));

export const normalize = (a: Vec3): Vec3 => multiplyScalar(a, 1 / length(a));
