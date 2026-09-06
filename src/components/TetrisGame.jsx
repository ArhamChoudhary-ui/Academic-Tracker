import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, Play, Pause, RotateCw, BookOpen } from "lucide-react";
import {
  createEmptyBoard,
  randomTetromino,
  rotate,
  isValidMove,
  mergePieceToBoard,
  clearLines,
  calculateScore,
  calculateLevel,
  getDropSpeed,
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from "../utils/tetrisEngine";

const TetrisGame = ({ isOpen, onClose }) => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [nextPiece, setNextPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const dropIntervalRef = useRef(null);
  const gameContainerRef = useRef(null);

  // Initialize game
  const initGame = useCallback(() => {
    setBoard(createEmptyBoard());
    const piece = randomTetromino();
    const next = randomTetromino();
    setCurrentPiece(piece);
    setNextPiece(next);
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
    setScore(0);
    setLines(0);
    setLevel(1);
    setIsPlaying(true);
    setIsPaused(false);
    setGameOver(false);
  }, []);

  // Move piece down
  const moveDown = useCallback(() => {
    if (!currentPiece || isPaused || gameOver) return;

    const newPos = { ...position, y: position.y + 1 };

    if (isValidMove(board, currentPiece, newPos)) {
      setPosition(newPos);
    } else {
      // Lock piece and spawn new one
      const newBoard = mergePieceToBoard(board, currentPiece, position);
      const { board: clearedBoard, linesCleared } = clearLines(newBoard);

      setBoard(clearedBoard);

      if (linesCleared > 0) {
        const newLines = lines + linesCleared;
        setLines(newLines);
        setScore((prev) => prev + calculateScore(linesCleared, level));
        setLevel(calculateLevel(newLines));
      }

      // Spawn next piece
      const spawnPos = { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };

      if (isValidMove(clearedBoard, nextPiece, spawnPos)) {
        setCurrentPiece(nextPiece);
        setNextPiece(randomTetromino());
        setPosition(spawnPos);
      } else {
        // Game over
        setGameOver(true);
        setIsPlaying(false);
      }
    }
  }, [
    board,
    currentPiece,
    position,
    nextPiece,
    isPaused,
    gameOver,
    lines,
    level,
  ]);

  // Move piece left
  const moveLeft = useCallback(() => {
    if (!currentPiece || isPaused || gameOver) return;
    const newPos = { ...position, x: position.x - 1 };
    if (isValidMove(board, currentPiece, newPos)) {
      setPosition(newPos);
    }
  }, [board, currentPiece, position, isPaused, gameOver]);

  // Move piece right
  const moveRight = useCallback(() => {
    if (!currentPiece || isPaused || gameOver) return;
    const newPos = { ...position, x: position.x + 1 };
    if (isValidMove(board, currentPiece, newPos)) {
      setPosition(newPos);
    }
  }, [board, currentPiece, position, isPaused, gameOver]);

  // Rotate piece
  const rotatePiece = useCallback(() => {
    if (!currentPiece || isPaused || gameOver) return;
    const rotatedShape = rotate(currentPiece.shape);
    const rotatedPiece = { ...currentPiece, shape: rotatedShape };

    if (isValidMove(board, rotatedPiece, position)) {
      setCurrentPiece(rotatedPiece);
    }
  }, [board, currentPiece, position, isPaused, gameOver]);

  // Hard drop
  const hardDrop = useCallback(() => {
    if (!currentPiece || isPaused || gameOver) return;

    let newPos = { ...position };
    while (isValidMove(board, currentPiece, { ...newPos, y: newPos.y + 1 })) {
      newPos.y++;
    }

    setPosition(newPos);
    // Trigger immediate lock by calling moveDown
    setTimeout(() => moveDown(), 0);
  }, [board, currentPiece, position, isPaused, gameOver, moveDown]);

  // Handle keyboard controls
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          moveLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          moveRight();
          break;
        case "ArrowDown":
          e.preventDefault();
          moveDown();
          break;
        case "ArrowUp":
          e.preventDefault();
          rotatePiece();
          break;
        case " ":
          e.preventDefault();
          hardDrop();
          break;
        case "p":
        case "P":
          e.preventDefault();
          setIsPaused((prev) => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, isPlaying, moveLeft, moveRight, moveDown, rotatePiece, hardDrop]);

  // Auto drop interval
  useEffect(() => {
    if (!isPlaying || isPaused || gameOver) {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
      }
      return;
    }

    const speed = getDropSpeed(level);
    dropIntervalRef.current = setInterval(moveDown, speed);

    return () => {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
      }
    };
  }, [isPlaying, isPaused, gameOver, level, moveDown]);

  // Render board with current piece
  const renderBoard = () => {
    const displayBoard = board.map((row) => [...row]);

    // Draw current piece on board
    if (currentPiece) {
      const { shape, color } = currentPiece;
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const boardY = position.y + row;
            const boardX = position.x + col;
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH
            ) {
              displayBoard[boardY][boardX] = color;
            }
          }
        }
      }
    }

    return displayBoard;
  };

  // Render next piece preview
  const renderNextPiece = () => {
    if (!nextPiece) return null;

    return (
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(4, 1fr)`,
          width: "80px",
        }}
      >
        {Array(4)
          .fill(null)
          .map((_, row) =>
            Array(4)
              .fill(null)
              .map((_, col) => {
                const shape = nextPiece.shape;
                const hasBlock = shape[row] && shape[row][col];
                return (
                  <div
                    key={`${row}-${col}`}
                    className="aspect-square rounded-sm"
                    style={{
                      backgroundColor:
                        hasBlock ? nextPiece.color : "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                );
              }),
          )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl shadow-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            🎮 Tetris Break
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} className="text-white/70" />
          </button>
        </div>

        {/* Game Content */}
        <div className="p-6">
          <div className="flex gap-6 items-start justify-center">
            {/* Game Board */}
            <div className="flex flex-col gap-4">
              <div
                ref={gameContainerRef}
                className="grid gap-0.5 bg-blue-950/50 p-2 rounded-lg border-2 border-white/20"
                style={{
                  gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
                  width: "300px",
                }}
              >
                {renderBoard().map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="aspect-square rounded-sm transition-colors"
                      style={{
                        backgroundColor: cell || "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                  )),
                )}
              </div>

              {/* Controls Info */}
              <div className="bg-white/5 rounded-lg p-3 text-sm text-white/70">
                <div className="font-semibold text-white mb-2">Controls:</div>
                <div className="space-y-1">
                  <div>← → : Move</div>
                  <div>↓ : Soft Drop</div>
                  <div>↑ : Rotate</div>
                  <div>Space : Hard Drop</div>
                  <div>P : Pause</div>
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="flex flex-col gap-4 w-48">
              {/* Score */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm mb-1">Score</div>
                <div className="text-2xl font-bold text-white">{score}</div>
              </div>

              {/* Lines & Level */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="text-white/60 text-sm">Lines</div>
                    <div className="text-xl font-bold text-white">{lines}</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">Level</div>
                    <div className="text-xl font-bold text-white">{level}</div>
                  </div>
                </div>
              </div>

              {/* Next Piece */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm mb-3">Next</div>
                <div className="flex justify-center">{renderNextPiece()}</div>
              </div>

              {/* Game Controls */}
              <div className="space-y-2">
                {!isPlaying && !gameOver && (
                  <button
                    onClick={initGame}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all"
                  >
                    <Play size={18} />
                    Start Game
                  </button>
                )}

                {isPlaying && !gameOver && (
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all"
                  >
                    {isPaused ?
                      <>
                        <Play size={18} />
                        Resume
                      </>
                    : <>
                        <Pause size={18} />
                        Pause
                      </>
                    }
                  </button>
                )}

                {gameOver && (
                  <div className="space-y-2">
                    <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 text-center">
                      <div className="text-white font-bold mb-1">
                        Game Over!
                      </div>
                      <div className="text-white/70 text-sm">
                        Final Score: {score}
                      </div>
                    </div>
                    <button
                      onClick={initGame}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all"
                    >
                      <RotateCw size={18} />
                      Play Again
                    </button>
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all"
                >
                  <BookOpen size={18} />
                  Back to Study
                </button>
              </div>
            </div>
          </div>

          {/* Pause Overlay */}
          {isPaused && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl">
              <div className="bg-blue-900/90 border border-white/20 rounded-xl p-8 text-center">
                <Pause size={48} className="mx-auto mb-4 text-white/70" />
                <div className="text-2xl font-bold text-white mb-2">Paused</div>
                <div className="text-white/60">Press P to resume</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TetrisGame;
