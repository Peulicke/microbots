type SparseMat = [number, number, number][];

export const matToSparse = (A: number[][]): SparseMat => {
    const result: SparseMat = [];
    for (let i = 0; i < A.length; ++i) {
        for (let j = 0; j < A.length; ++j) {
            if (Math.floor(i / 3) !== Math.floor(j / 3) && Math.abs(A[i][j]) < 1e-3) continue;
            result.push([i, j, A[i][j]]);
        }
    }
    return result;
};

const clone = (a: number[]): number[] => a.map(v => v);

const dot = (a: number[], b: number[]): number => {
    let result = 0;
    for (let i = 0; i < a.length; ++i) {
        result += a[i] * b[i];
    }
    return result;
};

const addVecMultNum = (a: number[], b: number[], c: number): number[] => a.map((v, i) => v + b[i] * c);

const matMultVec = (A: SparseMat, b: number[]): number[] => {
    const result = b.map(() => 0);
    for (let c = 0; c < A.length; ++c) {
        const i = A[c][0];
        const j = A[c][1];
        const v = A[c][2];
        result[i] += v * b[j];
    }
    return result;
};

export const cg = (ADense: number[][], b: number[]): number[] => {
    const A = matToSparse(ADense);
    let x = b.map(() => 0);
    let r = addVecMultNum(b, matMultVec(A, x), -1);
    let p = clone(r);
    let rsold = dot(r, r);
    for (let i = 0; i < 10; ++i) {
        const Ap = matMultVec(A, p);
        const alpha = rsold / dot(p, Ap);
        x = addVecMultNum(x, p, alpha);
        r = addVecMultNum(r, Ap, -alpha);
        const rsnew = dot(r, r);
        p = addVecMultNum(r, p, rsnew / rsold);
        rsold = rsnew;
    }
    return x;
};

export const precondition = (A: number[][], b: number[]): [number[][], number[]] => {
    A = A.map(row => row.map(v => v));
    b = b.map(v => v);
    for (let i = 0; i < A.length; i += 3) {
        let sum = 0;
        for (let j = 0; j < 3; ++j) {
            for (let k = 0; k < 3; ++k) {
                sum += A[i + j][i + k] ** 2;
            }
        }
        sum = Math.sqrt(3 / sum);
        for (let j = 0; j < 3; ++j) {
            for (let k = 0; k < A.length; ++k) {
                A[i + j][k] *= sum;
            }
            b[i + j] *= sum;
        }
    }
    return [A, b];
};

export const ldiv = (A: number[][], b: number[]): number[] => {
    [A, b] = precondition(A, b);
    return cg(A, b);
};
