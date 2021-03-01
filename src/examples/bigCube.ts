export default {
    title: "Big cube",
    data: [
        [...Array(8)].map((_, i) => [...Array(8)].map((_, j) => [i - 3.5, 0.5, j - 3.5])).flat(),
        [...Array(4)]
            .map((_, i) => [...Array(4)].map((_, j) => [...Array(4)].map((_, k) => [i - 3.5, k + 0.5, j - 3.5])))
            .flat()
            .flat()
    ]
};
