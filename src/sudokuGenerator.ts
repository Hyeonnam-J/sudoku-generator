import { create2DEmptyArray, shuffleArray } from "./func.js";

class SudokuGenerator {

    private readonly SIZE: number = 9;
    private board: number[][] = create2DEmptyArray(this.SIZE);

    // 행, 열, 서브그리드에 숫자 중복 체크.
    // this.subgrid[4][3] = 1; 이라면,
    // 4번 그리드에 3이란 숫자는 이미 쓰임.
    // 2차원 인덱스에 1~9 사이의 값이 들어가야 해서 SIZE + 1로 초기화.
    private row: number[][] = create2DEmptyArray(this.SIZE + 1);
    private col: number[][] = create2DEmptyArray(this.SIZE + 1);
    private subgrid: number[][] = create2DEmptyArray(this.SIZE + 1);

    // 스도쿠 생성.
    public generate(): { answer: number[][], question: number[][] } {
        this.initBoard();
        this.makeBoard(0);
        const answer = this.board;

        // todo: this.board로 question 만들기.
        const question = this.board;

        console.log(answer);
        return { answer, question };
    }

    // 스도쿠 초기화.
    private initBoard(): void {
        // 9x9 스도쿠 보드의 서브그리드(3x3 작은 보드) 번호가 다음과 같다고 가정.
        //
        // 0 1 2
        // 3 4 5
        // 6 7 8
        const _diagSubgrid: number[] = [0, 4, 8];

        // offset의 값은 0, 3, 6으로 변화하며
        // 9x9 스도쿠 보드에서 0, 4, 8번 서브그리드의 좌상단 행과 열의 값.
        for (let offset = 0; offset < this.SIZE; offset += 3) {

            let _arr: number[] = new Array(this.SIZE);
            for(let i = 0; i < this.SIZE; i++){
                _arr[i] = i + 1;
            }
            shuffleArray(_arr);

            // 숫자 중복 체크를 위한 로직.
            for (let idx = 0; idx < this.SIZE; idx++) {
                // i, j의 값은
                // 0, 0 -> 0, 1 -> 0, 2
                // 1, 0 -> 1, 1 -> 1, 2
                // 2, 0 -> 2, 1 -> 2, 2
                const i: number = Math.floor(idx / 3);
                const j: number = idx % 3;
                this.row[offset + i][_arr[idx]] = 1;
                this.col[offset + j][_arr[idx]] = 1;

                // k의 값은 0, 4, 8
                const k: number = _diagSubgrid[Math.floor(offset / 3)];
                this.subgrid[k][_arr[idx]] = 1;        

                this.board[offset + i][offset + j] = _arr[idx];
            }
        }
    }

    // 재귀적인 방법으로 퍼즐을 완성하는 메서드
    private makeBoard(boardIdx: number): boolean {
        // 퍼즐 완성.
        if (boardIdx === this.SIZE * this.SIZE) return true;

        // 현재 boardIdx를 기반으로 현재 행(i)과 열(j)을 계산.
        const i: number = Math.floor(boardIdx / this.SIZE);
        const j: number = boardIdx % this.SIZE;
        
        // 값이 할당되어져 있으면 다음 칸으로 이동.
        if (this.board[i][j] !== 0) return this.makeBoard(boardIdx + 1);
        
        // 1 ~ 9 사이 랜덤한 숫자를 기준으로 배열 생성.
        // randomNumber = 7이면 numbers = [8, 9, 1, 2, 3, 4, 5, 6, 7]로 초기화.
        const randomNumber: number = Math.floor(Math.random() * this.SIZE) + 1; // 1 ~ 9
        const numbers: number[] = Array.from({ length: this.SIZE }, (_, index) => {
            return (index + randomNumber) % this.SIZE + 1;
        });

        for (let idx = 1; idx <= this.SIZE; idx++) {
            // 현재 boardIdx에 넣으려는 값.
            const candidateNumber: number = numbers[idx];

            // 현재 위치 (i, j)가 속한 서브그리드 번호 k를 계산.
            const k: number = Math.floor(i / 3) * 3 + Math.floor(j / 3);

            // 중복이 없으면,
            if (this.row[i][candidateNumber] === 0 && this.col[j][candidateNumber] === 0 && this.subgrid[k][candidateNumber] === 0) {
                // 중복 체크 변수들을 업데이트하고 board에 후보 숫자를 할당.
                this.row[i][candidateNumber] = this.col[j][candidateNumber] = this.subgrid[k][candidateNumber] = 1;
                this.board[i][j] = candidateNumber;

                // 보드의 다음 칸으로 재귀적 이동.
                // 다음 칸에서 유효한 값을 찾을 수 없다면 현재 candidateNumber 값이 유효하지 않다는 의미.
                // 중복 체크 변수와 board의 값을 0으로 다시 되돌리고, for문을 계속 진행한다.
                if (this.makeBoard(boardIdx + 1)) {
                    return true;
                } else {
                    this.row[i][candidateNumber] = this.col[j][candidateNumber] = this.subgrid[k][candidateNumber] = 0;
                    this.board[i][j] = 0;
                }
            }
        }
        
        // 현재 위치에서 유효한 값을 찾지 못했다면 false를 리턴.
        return false;
    }
}

new SudokuGenerator().generate();