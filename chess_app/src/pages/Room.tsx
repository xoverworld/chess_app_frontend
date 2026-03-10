import { useState, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

function Room() {
    // const [game, setGame] = useState(new Chess());


    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;

    // track the current position of the chess game in state to trigger a re-render of the chessboard
    const [chessPosition, setChessPosition] = useState(chessGame.fen());

    // make a random "CPU" move
    function makeRandomMove() {
        // get all possible moves`
        const possibleMoves = chessGame.moves();

        // exit if the game is over
        if (chessGame.isGameOver()) {
            return;
        }

        // pick a random move
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

        // make the move
        chessGame.move(randomMove);

        // update the position state
        setChessPosition(chessGame.fen());
    }

    // handle piece drop
    function onPieceDrop({
                             sourceSquare,
                             targetSquare
                         }: PieceDropHandlerArgs) {
        // type narrow targetSquare potentially being null (e.g. if dropped off board)
        if (!targetSquare) {
            return false;
        }

        // try to make the move according to chess.js logic
        try {
            chessGame.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q' // always promote to a queen for example simplicity
            });

            // update the position state upon successful move to trigger a re-render of the chessboard
            setChessPosition(chessGame.fen());

            // make random cpu move after a short delay
            setTimeout(makeRandomMove, 500);

            // return true as the move was successful
            return true;
        } catch {
            // return false as the move was not successful
            return false;
        }
    }

    // set the chessboard options
    const chessboardOptions = {
        position: chessPosition,
        onPieceDrop,
        id: 'play-vs-random'
    };

    return (
        <div className="flex flex-col items-center justify-center h-full mt-20">
            <div className="w-125">
                {/*<Chessboard position={game.fen()} onPieceDrop={onDrop} />*/}
                <Chessboard options={chessboardOptions} />
            </div>
        </div>
    );
}
export default Room;