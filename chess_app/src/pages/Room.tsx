import { useState, useRef, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useParams, useSearchParams } from "react-router-dom";

function Room() {
    const socketRef = useRef(null);
    const { gameId } = useParams();

    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;
    const [params] = useSearchParams();
    const reversed = params.get('reversed');

    // States
    const [chessPosition, setChessPosition] = useState(chessGame.fen());
    const [moveFrom, setMoveFrom] = useState('');
    const [optionSquares, setOptionSquares] = useState({});
    const [position, setPosition] = useState('white'); // Default to white to avoid empty string errors
    const [gameOverMsg, setGameOverMsg] = useState("");

    // NEW STATE: Track the king in check
    const [kingInCheckSquare, setKingInCheckSquare] = useState("");

    useEffect(() => {
        if (reversed === 'true') {
            setPosition('black');
        } else {
            setPosition('white');
        }
    }, [reversed]);

    useEffect(() => {
        socketRef.current = new WebSocket(`/ws/ws/${gameId}`);

        socketRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const newFen = message.data;

            chessGame.load(newFen);
            setChessPosition(newFen);
            updateGameStatus(chessGame);
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        }
    }, [gameId]);

    // UPDATED: Now checks for checkmate, draws, AND the red King square
    function updateGameStatus(gameInstance) {
        if (gameInstance.isCheckmate()) {
            const winner = gameInstance.turn() === 'w' ? 'Black' : 'White';
            setGameOverMsg(`Checkmate! ${winner} wins!`);
        } else if (gameInstance.isDraw()) {
            setGameOverMsg("Game Over: Draw");
        } else {
            setGameOverMsg("");
        }

        // Check detection logic
        const inCheck = typeof gameInstance.inCheck === 'function' ? gameInstance.inCheck() : gameInstance.in_check();

        if (inCheck) {
            const board = gameInstance.board();
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const piece = board[r][c];
                    if (piece && piece.type === 'k' && piece.color === gameInstance.turn()) {
                        const files = "abcdefgh";
                        const squareAlias = files[c] + (8 - r);
                        setKingInCheckSquare(squareAlias);
                        return;
                    }
                }
            }
        } else {
            setKingInCheckSquare("");
        }
    }

    function getMoveOptions(square) {
        const moves = chessGame.moves({ square, verbose: true });
        if (moves.length === 0) {
            setOptionSquares({});
            return false;
        }

        const newSquares = {};
        for (const move of moves) {
            newSquares[move.to] = {
                background: chessGame.get(move.to) && chessGame.get(move.to)?.color !== chessGame.get(square)?.color
                    ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
                    : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
                borderRadius: '50%'
            };
        }
        newSquares[square] = { background: 'rgba(255, 255, 0, 0.4)' };
        setOptionSquares(newSquares);
        return true;
    }

    function onSquareClick({ square, piece }) {
        if (!moveFrom && piece) {
            const hasMoveOptions = getMoveOptions(square);
            if (hasMoveOptions) setMoveFrom(square);
            return;
        }

        const moves = chessGame.moves({ square: moveFrom, verbose: true });
        const foundMove = moves.find(m => m.from === moveFrom && m.to === square);

        if (!foundMove) {
            const hasMoveOptions = getMoveOptions(square);
            setMoveFrom(hasMoveOptions ? square : '');
            return;
        }

        try {
            chessGame.move({ from: moveFrom, to: square, promotion: 'q' });
        } catch {
            const hasMoveOptions = getMoveOptions(square);
            if (hasMoveOptions) setMoveFrom(square);
            return;
        }

        setChessPosition(chessGame.fen());
        updateGameStatus(chessGame);

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ room: gameId, data: chessGame.fen() }));
        }

        setMoveFrom('');
        setOptionSquares({});
    }

    function onPieceDrop({ sourceSquare, targetSquare }) {
        if (!targetSquare) return false;

        try {
            chessGame.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });

            setChessPosition(chessGame.fen());
            updateGameStatus(chessGame);

            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({ room: gameId, data: chessGame.fen() }));
            }
            return true;
        } catch {
            return false;
        }
    }

    function canDragPiece({ piece }) {
        return piece.pieceType[0] === position[0];
    }

    // MERGE STYLES: Combine the yellow move options with the red check square
    const mergedStyles = { ...optionSquares };
    if (kingInCheckSquare) {
        mergedStyles[kingInCheckSquare] = {
            background: 'radial-gradient(circle, rgba(255,0,0,.6) 25%, transparent 75%)',
            borderRadius: '50%'
        };
    }

    const chessboardOptions = {
        canDragPiece: canDragPiece,
        onSquareClick: onSquareClick,
        position: chessPosition,
        onPieceDrop: onPieceDrop,
        id: 'multiplayer-board',
        boardOrientation: position,

        // FIX: Change this back to squareStyles!
        squareStyles: mergedStyles,
    }

    return (
        <div className="flex flex-col items-center justify-center h-full mt-20 relative">

            {gameOverMsg && (
                <div className="absolute z-10 bg-slate-800/90 border border-slate-600 p-8 rounded-xl shadow-2xl text-center backdrop-blur-sm transform -translate-y-1/2 top-1/2">
                    <h2 className="text-3xl font-bold text-white mb-2">{gameOverMsg}</h2>
                    <button
                        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors"
                        onClick={() => window.location.reload()}
                    >
                        Return to Lobby
                    </button>
                </div>
            )}

            <div className={`w-[600px] max-w-full ${gameOverMsg ? 'opacity-50 pointer-events-none' : ''}`}>
                <Chessboard options={chessboardOptions} />
            </div>
        </div>
    );
}

export default Room;