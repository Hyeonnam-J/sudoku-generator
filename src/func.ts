// 배열 초기화.
export function create2DEmptyArray(size: number): number[][] {
    return Array.from({ length: size }, () => Array(size).fill(0));
}

// Fisher-Yates shuffle.
export function shuffleArray(arr: number[]): void {
    for (let i = arr.length - 1; i > 0; i--) {
        const index = Math.floor(Math.random() * (i + 1)); // 0부터 i까지의 난수 인덱스 생성
        const temp = arr[index];
        arr[index] = arr[i];
        arr[i] = temp;
    }
}