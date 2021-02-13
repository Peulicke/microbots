import { Matrix3 } from "three";
import { Vec3, newVec3 } from "./Vec3";

const throwError = () => {
    throw new Error("Vectors need to be the same length");
};

export const dot = (a: number[], b: number[]): number => {
    if (a.length !== b.length) throwError();
    let result = 0;
    for (let i = 0; i < a.length; ++i) result += a[i] * b[i];
    return result;
};

export const applyMatrix = (A: number[][], b: number[]): number[] => {
    if (A[0].length !== b.length) throwError();
    return [...Array(A.length)].map((_, i) => dot(A[i], b));
};

export const outerProduct = (a: Vec3, b: Vec3): Matrix3 => {
    return new Matrix3().set(
        a[0] * b[0],
        a[0] * b[1],
        a[0] * b[2],
        a[1] * b[0],
        a[1] * b[1],
        a[1] * b[2],
        a[2] * b[0],
        a[2] * b[1],
        a[2] * b[2]
    );
};

export const addMatrix3 = (a: Matrix3, b: Matrix3): Matrix3 => {
    const result = new Matrix3();
    result.elements = a.elements.map((e, i) => e + b.elements[i]);
    return result;
};

export const subMatrix3 = (a: Matrix3, b: Matrix3): Matrix3 => {
    const result = new Matrix3();
    result.elements = a.elements.map((e, i) => e - b.elements[i]);
    return result;
};

export const zeros = (height: number, width: number): number[][] =>
    [...Array(height)].map(() => [...Array(width)].map(() => 0));

export const numberArrayFromVector3Array = (vec: Vec3[]): number[] => {
    const result = [...Array(3 * vec.length)].map(() => 0);
    vec.map((e, i) => {
        for (let k = 0; k < 3; ++k) {
            result[3 * i + k] = e[k];
        }
    });
    return result;
};

export const numberArrayToVector3Array = (vec: number[]): Vec3[] =>
    [...Array(vec.length / 3)].map((_, i) => newVec3(vec[3 * i], vec[3 * i + 1], vec[3 * i + 2]));

export const numberArrayFromMatrix3Array = (mat: Matrix3[][]): number[][] => {
    const result = zeros(3 * mat.length, 3 * mat[0]?.length || 0);
    mat.map((row, i) =>
        row.map((element, j) => {
            for (let k = 0; k < 3; ++k) {
                for (let l = 0; l < 3; ++l) {
                    result[3 * i + k][3 * j + l] = mat[i][j].elements[k + 3 * l];
                }
            }
        })
    );
    return result;
};

export const numberArrayToMatrix3Array = (mat: number[][]): Matrix3[][] =>
    zeros(mat.length / 3, (mat[0]?.length || 0) / 3).map((row, i) =>
        row.map((element, j) => {
            const res = new Matrix3();
            for (let k = 0; k < 3; ++k) {
                for (let l = 0; l < 3; ++l) {
                    res.elements[k + 3 * l] = mat[3 * i + k][3 * j + l];
                }
            }
            return res;
        })
    );
