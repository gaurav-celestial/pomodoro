import { useRef, useState } from "react";
import "./Game.css";
import { useSelector } from "react-redux";

const Game = () => {
  const [won, setWon] = useState(false);

  const mode = useSelector((state) => state.settings.mode);

  // DOM ELEMENTS
  const guess = useRef();
  const message = useRef();
  const scoreEl = useRef();
  const highscoreEl = useRef();

  const [isPlaying, setIsPlaying] = useState(true);
  const [score, setScore] = useState(20);
  const [highscore, setHighscore] = useState(0);
  const [randomNum, setRandomNum] = useState(
    Math.trunc(Math.random() * 20 + 1)
  );

  // number.textContent = randomNum;
  console.log(score);

  const checkFun = function () {
    if (isPlaying) {
      if (randomNum > guess.current.value) {
        if (score > 1) {
          message.current.textContent = "too low...";
          setScore(score - 1);
        } else {
          message.current.textContent = "You lost...";
          setScore(score - 1);
        }
      } else if (randomNum < guess.current.value) {
        if (score > 1) {
          message.current.textContent = "too high...";
          setScore(score - 1);
        } else {
          message.current.textContent = "You lost...";
          setScore(score - 1);
        }
      } else {
        setWon(true);
        message.current.textContent = "Correct Number...";
        // document.body.style.backgroundColor = "green";
        if (highscore < score) setHighscore(score);
        highscoreEl.current.textContent = highscore;
        setIsPlaying(false);
      }
      scoreEl.current.textContent = score;
    }
  };

  const againFun = function () {
    console.log("again clicked");
    setWon(false);
    setIsPlaying(true);
    setScore(20);
    setRandomNum(Math.trunc(Math.random() * 20 + 1));
    scoreEl.current.textContent = score;
    guess.current.value = "";
    message.current.textContent = "Start Guessing";
    // document.body.style.backgroundColor = "black";
  };

  return (
    <div
      className={`game-container ${
        mode === "dark" ? "mode2-game-container" : undefined
      } ${won ? "won" : undefined}`}
    >
      <header>
        <div className="top-heading">
          <h1>Guess My Number!</h1>
          <p className="between">(Between 1 and 20)</p>
          <button onClick={againFun} className="btn again">
            Again!
          </button>
        </div>

        <div className="number">?</div>
      </header>
      <main>
        <section className="left">
          <input ref={guess} type="number" className="guess" />
          <button onClick={checkFun} className="btn check">
            Check!
          </button>
        </section>
        <section className="right">
          <p ref={message} className="message">
            Start guessing...
          </p>
          <p className="label-score">
            💯 Score:{" "}
            <span ref={scoreEl} className="score">
              {score}
            </span>
          </p>
          <p className="label-highscore">
            🥇 Highscore:{" "}
            <span ref={highscoreEl} className="highscore">
              {highscore}
            </span>
          </p>
        </section>
      </main>
    </div>
  );
};

export default Game;
