//board2 = [["O", "X", "X"], ["O", "", "X"], ["", "", ""]]; // --> 2,0 win -> WORKS
//board2 = [["X", "O", "X"], ["", "O", ""], ["", "", "X"]]; // --> 2,1 win -> WORKS
//board2 = [["X", "O", "X"], ["", "O", "X"], ["", "", ""]]; // --> 2,1 win -> WORKS
//board2 = [["X", "", "O"], ["X", "", ""], ["O", "X", ""]]; // --> 1,1 win -> WORKS
//board2 = [["", "", "X"], ["", "X", "X"], ["O", "", "O"]]; // --> 2,1 win -> WORKS
//board2 = [["X", "X", ""], ["O", "", ""], ["X", "O", ""]]; // --> 0,2 prevent -> WORKS
//board2 = [["O", "O", "X"], ["X", "", "X"], ["", "", ""]]; // --> 1,1 és 2,2 PREVENT -> WORKS
//board2 = [["", "", "X"], ["", "X", "O"], ["O", "", "X"]]; // --> 0,0 prevent -> 0,0
board2 = [["O", "", ""], ["", "", ""], ["X", "", "X"]]; // --> 0,2 prevent -> WORKS


let gameTurn = 3;
let ourbestmove = bestSpot(board2, "Os");
console.log("Our best move is ");
console.log(ourbestmove);

//Unbeatable AI
function bestSpot(board, thisPlayer) {
    let bestVal = -1000;
    let bestMove = {};
    bestMove.x = -1;
    bestMove.y = -1;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === "") {
                board[i][j] = thisPlayer;
                let moveVal = minimax(board, 0, "O");
                board[i][j] = "";
                if (moveVal > bestVal) {                    
                    bestMove.x = i;
                    bestMove.y = j;
                    bestVal = moveVal;
                }
            }
        }
    }
    console.log(`Best move is: x: ${bestMove.x}, y: ${bestMove.y}`);
    return bestMove;
}

function minimax(newBoard, depth, currentPlayer) {
    if (getWinningPlayer(newBoard, "O")) {
        return (20 - depth);
    } else if (getWinningPlayer(newBoard, "X")) {
        return (-20 + depth);
    } else if ((depth + gameTurn) === 8) {
        return 0;
    }

    if (currentPlayer === "O") {
        let best = 1000;
        for (let i = 0; i < 3; i++) { // For all moves
            for (let j = 0; j < 3; j++) {
                if (newBoard[i][j] == "") { // Only possible moves
                    newBoard[i][j] = "X";
                    best = Math.min(best, minimax(newBoard, depth + 1, "X"));
                    newBoard[i][j] = "";
                }
            }
        }
        //console.log(`isMax current best: ${best}`);
        return best;
    } else {
        let best = -1000;
        for (let i = 0; i < 3; i++) { // For all moves
            for (let j = 0; j < 3; j++) {
                if (newBoard[i][j] == "") { // Only possible moves
                    newBoard[i][j] = "O";           
                    best = Math.max(best, minimax(newBoard, depth + 1, "O"));
                    newBoard[i][j] = "";
                }
            }
        }
        //console.log(`!isMax current best: ${best}`);
        return best;
    }
}

function getWinningPlayer(board, player) {
    if (board[0][0] === player && board[0][0] === board[0][1] && board[0][0] === board[0][2]) {
        return true;
    }
    if (board[1][0] === player && board[1][0] === board[1][1] && board[1][0] === board[1][2]) {
        return true;
    }
    if (board[2][0] === player && board[2][0] === board[2][1] && board[2][0] === board[2][2]) {
        return true;
    }
    if (board[0][0] === player && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
        return true;
    }
    if (board[0][0] === player && board[0][0] === board[1][0] && board[0][0] === board[2][0]) {
        return true;
    }
    if (board[0][1] === player && board[0][1] === board[1][1] && board[0][1] === board[2][1]) {
        return true;
    }
    if (board[0][2] === player && board[0][2] === board[1][2] && board[0][2] === board[2][2]) {
        return true;
    }
    if (board[2][0] === player && board[2][0] === board[1][1] && board[2][0] === board[0][2]) {
        return true;
    }
    return false;
}