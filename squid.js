 fetch("data.txt").then(response => response.text())
 .then(input => input);
// Split the input into an array of callNumbers and gameBoards.
let callNumbers = input[0].split(',').map(Number);
let gameBoards = input.slice(1).map(parseGameBoard);

// Function to parse the game board from a string representation.
function parseGameBoard(s) {
    // Split the string into rows and parse each row into an object with progress and numbers.
    let gameRows = s.split('\n').map(row => ({
        progress: 0, // Initialize the progress for each row.
        numbers: row
            .split(' ')
            .filter(value => value !== '') // Remove empty values and parse the numbers.
            .map(Number),
    }));
    let gameCols = []; // Create an array to store the columns for easier checking.

    // Create columns from the rows for easier checking.
    for (let row of gameRows) {
        let columnIndex = 0;
        for (let num of row.numbers) {
            if (!gameCols[columnIndex]) {
                gameCols[columnIndex] = {
                    progress: 0, // Initialize the progress for each column.
                    numbers: [],
                };
            }
            gameCols[columnIndex].numbers.push(num);
            columnIndex++;
        }
    }

    return {
        rows: gameRows,
        columns: gameCols,
    };
}

// Function to calculate the game score for a specific direction (row or column).
function calculateGameScore(board, direction) {
    let score = 0;
    if (direction === 'r') {
        // Calculate the score for rows.
        for (let row of board.rows) {
            for (let num of row.numbers) {
                if (!markedValues.has(num)) {
                    score += num;
                }
            }
        }
    } else if (direction === 'c') {
        // Calculate the score for columns.
        for (let col of board.columns) {
            for (let num of col.numbers) {
                if (!markedValues.has(num)) {
                    score += num;
                }
            }
        }
    }
    return score * lastCallValue; // Multiply the score by the last call value.
}

// Initialize variables to keep track of the game state.
let lastCallValue; // Stores the last called number.
let markedValues = new Set(); // Keep track of called numbers.
let winningBoards = new Set(); // Keep track of boards with winning patterns.
let finalScore; // Store the final game score.

// Iterate through the callNumbers and update the game state accordingly.
for (let call of callNumbers) {
    lastCallValue = call;
    markedValues.add(call); // Mark the called number as used.

    // Iterate through each game board and update progress in rows and columns.
    for (let board of gameBoards) {
        for (let row of board.rows) {
            for (let num of row.numbers) {
                if (call === num) {
                    row.progress++; // Increment the progress if the number matches the call.
                }
                if (row.progress === 5 && !winningBoards.has(board)) {
                    finalScore = calculateGameScore(board, 'r'); // Check for a winning row.
                    winningBoards.add(board);
                }
            }
        }

        for (let col of board.columns) {
            for (let num of col.numbers) {
                if (call === num) {
                    col.progress++; // Increment the progress if the number matches the call.
                }
                if (col.progress === 5 && !winningBoards.has(board)) {
                    finalScore = calculateGameScore(board, 'c'); // Check for a winning column.
                    winningBoards.add(board);
                }
            }
        }
    }
}

alert(finalScore); // Display the final game score.
