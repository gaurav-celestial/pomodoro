import { useState } from "react";
import "./TicTacToe.css";
import Row from "./Row";
import { useSelector } from "react-redux";

const TicTacToe = () => {
  const mode = useSelector((state) => state.settings.mode);

  const [initialGame, setInitialGame] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [playerWon, setPlayerWon] = useState();

  const resetGame = function () {
    setInitialGame([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setPlayerWon(null);
    setCurrentPlayer("X");
  };

  const hasWon = function (gameStatus, currentPlayer) {
    const final = gameStatus.map((row) => {
      return row.map((col) => {
        return col === currentPlayer;
      });
    });

    if (final[0][0] && final[1][0] && final[2][0]) {
      setPlayerWon(currentPlayer);
    } else if (final[0][1] && final[1][1] && final[2][1]) {
      setPlayerWon(currentPlayer);
    } else if (final[0][2] && final[1][2] && final[2][2]) {
      setPlayerWon(currentPlayer);
    } else if (final[0][0] && final[0][1] && final[0][2]) {
      setPlayerWon(currentPlayer);
    } else if (final[1][0] && final[1][1] && final[1][2]) {
      setPlayerWon(currentPlayer);
    } else if (final[2][0] && final[2][1] && final[2][2]) {
      setPlayerWon(currentPlayer);
    } else if (final[0][0] && final[1][1] && final[2][2]) {
      setPlayerWon(currentPlayer);
    } else if (final[0][2] && final[1][1] && final[2][0]) {
      setPlayerWon(currentPlayer);
    } else {
      return -1;
    }
  };

  const changeGameStatus = function (clickedIndex) {
    if (playerWon) return;
    console.log(clickedIndex);

    const changeInitialGame = [...initialGame];
    console.log(changeInitialGame[clickedIndex[0]][clickedIndex[1]]);

    if (!changeInitialGame[clickedIndex[0]][clickedIndex[1]]) {
      changeInitialGame[clickedIndex[0]][clickedIndex[1]] = currentPlayer;
      setInitialGame(changeInitialGame);

      const bool = hasWon(changeInitialGame, currentPlayer);

      if (bool === undefined) return;

      if (currentPlayer === "X") {
        setCurrentPlayer("O");
      } else {
        setCurrentPlayer("X");
      }
    }
  };

  return (
    <div
      className={`tic-tac-toe-game ${
        mode === "dark" ? "mode2-tic-tac-toe-game" : undefined
      }`}
    >
      <h1 className="winner">
        {playerWon ? `${playerWon} Won` : "Tic Tac Toe"}
      </h1>
      <div className="tic-tac-toe-container">
        <Row
          initialGame={initialGame[0]}
          row={0}
          changeGameStatus={changeGameStatus}
        />
        <Row
          initialGame={initialGame[1]}
          row={1}
          changeGameStatus={changeGameStatus}
        />
        <Row
          row={2}
          initialGame={initialGame[2]}
          changeGameStatus={changeGameStatus}
        />
        <button onClick={resetGame} className="tic-tac-toe-again">
          Play Again
        </button>
      </div>
    </div>
  );
};

export default TicTacToe;
