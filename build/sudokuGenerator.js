import { create2DEmptyArray, shuffleArray } from "./func.js";
class SudokuGenerator {
    constructor() {
        this.SIZE = 9;
        this.answerBoard = create2DEmptyArray(this.SIZE);
        this.questionBoard = create2DEmptyArray(this.SIZE);
        // 행, 열, 서브그리드에 숫자 중복 체크.
        // this.subgrid[4][3] = 1; 이라면,
        // 4번 그리드에 3이란 숫자는 이미 쓰임.
        // 2차원 인덱스에 1~9 사이의 값이 들어가야 해서 SIZE + 1로 초기화.
        this.row = create2DEmptyArray(this.SIZE + 1);
        this.col = create2DEmptyArray(this.SIZE + 1);
        this.subgrid = create2DEmptyArray(this.SIZE + 1);
    }
    // 스도쿠 생성.
    generate() {
        this.boardInit();
    }
    // 스도쿠 초기화.
    boardInit() {
        // 9x9 스도쿠 보드의 서브그리드(3x3 작은 보드) 번호가 다음과 같다고 가정.
        //
        // 0 1 2
        // 3 4 5
        // 6 7 8
        const _diagSubgrid = [0, 4, 8];
        // offset의 값은 0, 3, 6으로 변화하며
        // 9x9 스도쿠 보드에서 0, 4, 8번 서브그리드의 좌상단 행과 열의 값.
        for (let offset = 0; offset < this.SIZE; offset += 3) {
            let _arr = new Array(this.SIZE);
            for (let i = 0; i < this.SIZE; i++) {
                _arr[i] = i + 1;
            }
            shuffleArray(_arr);
            // 숫자 중복 체크를 위한 로직.
            for (let idx = 0; idx < this.SIZE; idx++) {
                // i, j의 값은
                // 0, 0 -> 0, 1 -> 0, 2
                // 1, 0 -> 1, 1 -> 1, 2
                // 2, 0 -> 2, 1 -> 2, 2
                const i = Math.floor(idx / 3);
                const j = idx % 3;
                this.row[offset + i][_arr[idx]] = 1;
                this.col[offset + j][_arr[idx]] = 1;
                // k의 값은 0, 4, 8
                const k = _diagSubgrid[Math.floor(offset / 3)];
                this.subgrid[k][_arr[idx]] = 1;
                this.answerBoard[offset + i][offset + j] = _arr[idx];
            }
        }
        console.log(this.answerBoard);
    }
}
new SudokuGenerator().generate();
