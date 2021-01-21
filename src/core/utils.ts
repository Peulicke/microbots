import { Vector3, Matrix3 } from "three";

export const outerProduct = (a: Vector3, b: Vector3): Matrix3 =>
    new Matrix3().set(
        a.x * b.x,
        a.x * b.y,
        a.x * b.z,
        a.y * b.x,
        a.y * b.y,
        a.y * b.z,
        a.z * b.x,
        a.z * b.y,
        a.z * b.z
    );

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

export const numberArrayFromVector3Array = (vec: Vector3[]): number[] => {
    const result = [...Array(3 * vec.length)].map(() => 0);
    vec.map((e, i) => {
        for (let k = 0; k < 3; ++k) {
            result[3 * i + k] = e.getComponent(k);
        }
    });
    return result;
};

export const numberArrayToVector3Array = (vec: number[]): Vector3[] =>
    [...Array(vec.length / 3)]
        .map(() => new Vector3())
        .map((e, i) => {
            for (let k = 0; k < 3; ++k) {
                e.setComponent(k, vec[3 * i + k]);
            }
            return e;
        });

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
