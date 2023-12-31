import { useState } from 'react';

function Square({ background, value, onSquareClick }) {
  return (
    <button style={{ background }} className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + squares[winner[0]];
  } else if (!winner && squares.every(x => x !== null && typeof x !== 'undefined')) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      {Array(3)
        .fill(null)
        .map((_, row) => (
          <div className="board-row">
            {Array(3)
              .fill(null)
              .map((_, col) => {
                const squareIndex = row * 3 + col;
                return (
                  <Square background={winner?.includes(squareIndex) ? 'green' : 'white'}
                    key={squareIndex}
                    value={squares[squareIndex]}
                    onSquareClick={() => handleClick(squareIndex)}
                  />
                );
              })}
          </div>
        ))}
    </>
  );

}

export default function Game() {
  const [toggle, setToggle] = useState(0);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function getPositionMove(squares, move) {
    debugger;
    let position = [Array(2).fill(null)];
    for (let i = 0; i < history[0].length; i++) {
      if (history[move-1][i] !== squares[i]) {
        position[0] = Math.floor(i / 3 + 1);
        position[1] = i % 3 + 1;
        return position;
      }
    }
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === history.length - 1) {
      return (
        <li key={move}>
          <p>You are at move #{move}</p>
        </li>
      )
    }
    if (move > 0) {
      description = 'Go to move #' + move + '. You put a ' + (move%2===1 ? 'X':'O') +' in the position (' + getPositionMove(squares,move) + ')';
    }
    else {
      description = 'Go to game start';
    }
    
    return (
      <li key={move}>
        <button onClick={() => setCurrentMove(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button id="toggleButton" class="button" onClick={() => setToggle(!toggle)}>{"Change the sorting order"}</button>
        {toggle ? <ol>{moves.reverse()}</ol> : <ol>{moves}</ol>}
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
