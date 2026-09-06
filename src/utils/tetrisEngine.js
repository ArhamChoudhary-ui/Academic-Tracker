/**
 * Tetris Game Engine
 * Pure logic for Tetris game mechanics
 */

// Tetromino shapes (I, O, T, S, Z, J, L)
export const SHAPES = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

// Colors for each shape
export const COLORS = {
  I: "#00f0f0",
  O: "#f0f000",
  T: "#a000f0",
  S: "#00f000",
  Z: "#f00000",
  J: "#0000f0",
  L: "#f0a000",
};

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// Create empty board
export const createEmptyBoard = () => {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array(BOARD_WIDTH).fill(null),
  );
};

// Get random tetromino
export const randomTetromino = () => {
  const shapes = Object.keys(SHAPES);
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
  return {
    shape: SHAPES[randomShape],
    color: COLORS[randomShape],
    type: randomShape,
  };
};

// Rotate matrix 90 degrees clockwise
export const rotate = (matrix) => {
  const N = matrix.length;
  const rotated = Array.from({ length: N }, () => Array(N).fill(0));

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      rotated[j][N - 1 - i] = matrix[i][j];
    }
  }

  return rotated;
};

// Check if position is valid
export const isValidMove = (board, piece, position) => {
  const { shape } = piece;
  const { x, y } = position;

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newX = x + col;
        const newY = y + row;

        // Check boundaries
        if (
          newX < 0 ||
          newX >= BOARD_WIDTH ||
          newY >= BOARD_HEIGHT ||
          (newY >= 0 && board[newY][newX])
        ) {
          return false;
        }
      }
    }
  }

  return true;
};

// Merge piece with board
export const mergePieceToBoard = (board, piece, position) => {
  const newBoard = board.map((row) => [...row]);
  const { shape, color } = piece;
  const { x, y } = position;

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const boardY = y + row;
        const boardX = x + col;
        if (
          boardY >= 0 &&
          boardY < BOARD_HEIGHT &&
          boardX >= 0 &&
          boardX < BOARD_WIDTH
        ) {
          newBoard[boardY][boardX] = color;
        }
      }
    }
  }

  return newBoard;
};

// Clear completed lines and return new board + lines cleared
export const clearLines = (board) => {
  const newBoard = [];
  let linesCleared = 0;

  for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
    if (board[row].every((cell) => cell !== null)) {
      linesCleared++;
    } else {
      newBoard.unshift(board[row]);
    }
  }

  // Add empty rows at top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }

  return { board: newBoard, linesCleared };
};

// Calculate score based on lines cleared
export const calculateScore = (linesCleared, level) => {
  const baseScores = {
    1: 100,
    2: 300,
    3: 500,
    4: 800,
  };
  return (baseScores[linesCleared] || 0) * level;
};

// Calculate level based on total lines cleared
export const calculateLevel = (totalLines) => {
  return Math.floor(totalLines / 10) + 1;
};

// Calculate drop speed (ms) based on level
export const getDropSpeed = (level) => {
  return Math.max(100, 1000 - (level - 1) * 100);
};
