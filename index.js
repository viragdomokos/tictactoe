let gameTurn = 0;
let currentPlayer;
let otherPlayer;
let board;
let runAI;
let gameMode = null;
let difficulty;

// this function will be called whenever the user changes
// the `select` input labeled `please select game mode`
function setGameMode(selectedValue) {
    gameMode = selectedValue;
    switch (selectedValue) {
        case 'human-human':
            isPlayerXHuman = true;
            isPlayerYHuman = true;
            break;
        case 'human-ai':
            isPlayerXHuman = true;
            isPlayerYHuman = false;
            difficulty = "normal";
            break;
        case 'ai-human':
            isPlayerXHuman = false;
            isPlayerYHuman = true;
            difficulty = "normal";
            break;
        case 'ai-ai':
            isPlayerXHuman = false;
            isPlayerYHuman = false;
            difficulty = "normal";
            break;
        case 'human-unbeatable':
            isPlayerXHuman = true;
            isPlayerYHuman = false;
            difficulty = "unbeatable";
            break;
        case 'unbeatable-human':
            isPlayerXHuman = false;
            isPlayerYHuman = true;
            difficulty = "unbeatable";
            break;
        case 'unbeatable-unbeatable':
            isPlayerXHuman = false;
            isPlayerYHuman = false;
            difficulty = "unbeatable";
            break;
    }
    resetBoard();
    uiSetup();
    runAI = true;

    setHTMLvisibilityForInputGameMode(false);
    setHTMLvisibilityForButtonLabeledReset(true);
    turnMessage("Player X's turn");
    if (isPlayerXHuman === false) {
        setTimeout(function () { processAICoordinate() }, 500);
    }
}

function uiSetup() {
    const winningPlayer = getWinningPlayer(board, currentPlayer);
    if (winningPlayer) {
        displayMessage(`Player ${currentPlayer} has won !`);
        turnMessage("");
        runAI = false;
        setHTMLvisibilityForInputHumanCoordinates(false);
        setHTMLvisibilityForButtonLabeledReset(true);        
    } else if (gameTurn >= 9) {
        displayMessage(`It's a tie`);
        runAI = false;
        turnMessage("");
        setHTMLvisibilityForInputHumanCoordinates(false);
        setHTMLvisibilityForButtonLabeledReset(true);
    } else if (isPlayerXHuman === false && isPlayerYHuman === false) {
        setHTMLvisibilityForInputHumanCoordinates(false);
        setHTMLvisibilityForButtonLabeledReset(true);
    } else if (gameTurn % 2 === 0) {
        if (isPlayerXHuman === false) {
            setHTMLvisibilityForInputHumanCoordinates(false);
        } else {
            setHTMLvisibilityForInputHumanCoordinates(true);
        }
    } else {
        if (isPlayerYHuman === false) {
            setHTMLvisibilityForInputHumanCoordinates(false);
        } else {
            setHTMLvisibilityForInputHumanCoordinates(true);
        }
    }
}

// this function is called whenever the user presses the `enter`
// key in the input box labeled `enter coordinates`
// paramerter: input - the content of the input box
function processHumanCoordinate(input) {
    if (runAI === true) {
        console.log(`'processHumanCoordinate('${input}')`);
        currentTurn(gameTurn); //set Player X / O

        let coordinates = extractCoordinates(input);
        if ((coordinates.x == 0 || coordinates.x == 1 || coordinates.x == 2) && (coordinates.y == 0 || coordinates.y == 1 || coordinates.y == 2)) {
            if (validateEmptyCell(coordinates)) {
                board[coordinates.x][coordinates.y] = currentPlayer;
                displayBoard(board);
                gameTurn += 1;
                displayMessage("");                
                if (gameTurn % 2 === 0) {
                    turnMessage("Player X's turn");
                } else {
                    turnMessage("Player O's turn");
                }
                uiSetup();
                if (isPlayerXHuman === false || isPlayerYHuman === false) {
                    setTimeout(function () { processAICoordinate() }, 500);
                }
            } else {
                displayMessage("Position is already taken on board");
            }
        } else {
            displayMessage("Invalid input");
        }
    }
}

// this function should change from A1..C3 to coordinates
// that are present in the `board` global variable
function extractCoordinates(input) {
    let firstCoord = null;
    let secondCoord = null;
    if (input.length === 2) {
        if (input[0].toLowerCase() === "a") {
            firstCoord = 0;
        } else if (input[0].toLowerCase() === "b") {
            firstCoord = 1;
        } else if (input[0].toLowerCase() === "c") {
            firstCoord = 2;
        }

        if (input[1] == "1") {
            secondCoord = 0;
        } else if (input[1] == "2") {
            secondCoord = 1;
        } else if (input[1] == "3") {
            secondCoord = 2;
        }

        /*     x A/B/C (0/1/2)
            y 1/2/3 (0/1/2) */
        // this is a sample of what should be returned if the
        // the user had typed `A1`
        // you need to add the to also treat other cases (A2..C3)
    }
    return { x: firstCoord, y: secondCoord };
}

function validateEmptyCell(coordinates) {
    return (board[coordinates.x][coordinates.y] === "") ? true : false; // checks if a cell is empty
}

function currentTurn(gameTurn) {
    if (gameTurn % 2 === 0) {
        currentPlayer = 'X';
        otherPlayer = 'O';
    } else {
        currentPlayer = 'O';
        otherPlayer = 'X';
    }
}

// this function is called whenever the user presses
// the button labeled `Generate AI coordinates`
function processAICoordinate() {
    currentTurn(gameTurn);
    uiSetup();
    console.log(`processAICoordinate()`);
    if (gameTurn < 9 && runAI === true) {
        if (difficulty === "unbeatable") {
            console.log(currentPlayer);
            aiBestMove = bestSpot(board, currentPlayer);
            board[aiBestMove.x][aiBestMove.y] = currentPlayer;
            displayBoard(board);
            gameTurn += 1;            
            if (gameTurn % 2 === 0) {
                turnMessage("Player X's turn");
            } else {
                turnMessage("Player O's turn");
            }
            uiSetup();
        } else {
            let firstCoord = 0;
            let secondCoord = 0;
            while (true) {
                firstCoord = Math.floor(3 * Math.random());
                secondCoord = Math.floor(3 * Math.random());
                if (validateEmptyCell({ x: firstCoord, y: secondCoord })) {
                    console.log("Good coord, we return");
                    let easyWinMove = checkSomething(board, currentPlayer);
                    let preventLose = checkSomething(board, otherPlayer);
                    if (easyWinMove) {
                        board[easyWinMove.x][easyWinMove.y] = currentPlayer;
                    } else if (preventLose) {
                        board[preventLose.x][preventLose.y] = currentPlayer;
                    } else {
                        board[firstCoord][secondCoord] = currentPlayer;
                    }
                    displayBoard(board);
                    gameTurn += 1;                    
                    if (gameTurn % 2 === 0) {
                        turnMessage("Player X's turn");
                    } else {
                        turnMessage("Player O's turn");
                    }
                    uiSetup();
                    break;
                }
            }
        }
        if (gameMode === "ai-ai" || gameMode === "unbeatable-unbeatable") {
            setTimeout(function () { processAICoordinate() }, 200);
        }
    }
}

// this function is called when the user clicks on 
// the button labeled `Restart Game`
function resetGame() {
    setHTMLvisibilityForInputHumanCoordinates(false);
    setHTMLvisibilityForInputGameMode(true);
    setHTMLvisibilityForButtonLabeledReset(false);
    displayMessage('');
    turnMessage('');
    resetBoard();
    displayBoard(board);
    console.log(`resetGame()`);
    gameTurn = 0;
    document.getElementById(13).selected = true; //Select game mód visszaállítása alapértelmezett értékre, hogy újra tudjunk game módot választani,ha szeretnénk még játszani
}

// this function should return `X` or `O` or undefined (carefull it's not a string )
// based on interpreting the values in the board variable
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

function checkSomething(board, player) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == "") { // Only possible moves
                let boardToCheck = [...board];
                boardToCheck[i][j] = player;
                if (getWinningPlayer(boardToCheck, player)) {
                    boardToCheck[i][j] = "";
                    return { x: i, y: j };
                } else {
                    boardToCheck[i][j] = "";
                }
            }
        }
    }
    return false;
}

//Unbeatable AI
function bestSpot(board, thisPlayer) {
    let bestVal;
    if (thisPlayer === "O") {
        bestVal = -1000;
    } else {
        bestVal = 1000;
    }
    let bestMove = {};
    bestMove.x = -1;
    bestMove.y = -1;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === "") {
                board[i][j] = thisPlayer;
                let moveVal = minimax(board, 0, thisPlayer);
                board[i][j] = "";
                if (thisPlayer === "O") {
                    if (moveVal > bestVal) {
                        bestMove.x = i;
                        bestMove.y = j;
                        bestVal = moveVal;
                    }
                } else if (moveVal < bestVal) {
                    bestMove.x = i;
                    bestMove.y = j;
                    bestVal = moveVal;
                }
            }
        }
    }
    //console.log(`Best move is: x: ${bestMove.x}, y: ${bestMove.y}`);
    return bestMove;
}

function minimax(newBoard, depth, thisPlayer) {
    if (getWinningPlayer(newBoard, "O")) {
        return (20 - depth);
    } else if (getWinningPlayer(newBoard, "X")) {
        return (-20 + depth);
    } else if ((depth + gameTurn) === 8) {
        return 0;
    }

    if (thisPlayer === "O") {
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
        return best;
    }
}