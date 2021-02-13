import * as Vec3 from "./Vec3";

export type Mat3 = [Vec3.Vec3, Vec3.Vec3, Vec3.Vec3];

export const newMat3 = (x: Vec3.Vec3, y: Vec3.Vec3, z: Vec3.Vec3): Mat3 => [x, y, z];

export const clone = (a: Mat3): Mat3 => [Vec3.clone(a[0]), Vec3.clone(a[1]), Vec3.clone(a[2])];

export const add = (a: Mat3, b: Mat3): Mat3 => [Vec3.add(a[0], b[0]), Vec3.add(a[1], b[1]), Vec3.add(a[2], b[2])];

export const sub = (a: Mat3, b: Mat3): Mat3 => [Vec3.sub(a[0], b[0]), Vec3.sub(a[1], b[1]), Vec3.sub(a[2], b[2])];

export const multiplyScalar = (a: Mat3, s: number): Mat3 => [
    Vec3.multiplyScalar(a[0], s),
    Vec3.multiplyScalar(a[1], s),
    Vec3.multiplyScalar(a[2], s)
];

export const divideScalar = (a: Mat3, s: number): Mat3 => [
    Vec3.divideScalar(a[0], s),
    Vec3.divideScalar(a[1], s),
    Vec3.divideScalar(a[2], s)
];

export const apply = (a: Mat3, b: Vec3.Vec3): Vec3.Vec3 => [Vec3.dot(a[0], b), Vec3.dot(a[1], b), Vec3.dot(a[2], b)];
