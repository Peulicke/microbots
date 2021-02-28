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

export const cg = (A: SparseMat, b: number[]): number[] => {
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

export const precondition = (A: SparseMat, b: number[]): [SparseMat, number[]] => {
    b = b.map(v => v);
    const sum = [...Array(b.length / 3)].map(() => 0);
    for (let c = 0; c < A.length; ++c) {
        const [i, j, v] = A[c];
        if (Math.floor(i / 3) === Math.floor(j / 3)) sum[Math.floor(i / 3)] += v;
    }
    sum.map((v, i) => (sum[i] = Math.sqrt(3 / v)));
    for (let c = 0; c < A.length; ++c) {
        A[c][2] *= sum[Math.floor(A[c][0] / 3)];
    }
    for (let i = 0; i < b.length; ++i) {
        b[i] *= sum[Math.floor(i / 3)];
    }
    return [A, b];
};

export const ldiv = (A: number[][], b: number[]): number[] => {
    const p = precondition(matToSparse(A), b);
    return cg(p[0], p[1]);
};
