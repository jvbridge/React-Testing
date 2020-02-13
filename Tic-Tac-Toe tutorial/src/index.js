import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/***
 * This is the only file I'm really modifying for this project. I finished the 
 * tutorial, now I'm implementing their suggested changes for this
 * 1. Display the location for each move in the format (col, row) in the move 
 *    history list
 * 2. ::DONE:: Bold the currently selected item in the move list. ::DONE::
 * 3. ::DONE:: Rewrite Board to use two loops to make the squares instead of 
 *    hardcoding them. ::DONE::
 * 4. Add a toggle button that lets you sort the moves in either ascending or
 *    descending order.
 * 5. When someone wins, highlight the three squares that caused the win.
 * 6. When no one wins, display a message about the result being a draw.
 */

 /**
  * Creates a square using a react object
  * @param {Object} props Properties inherited from the Game object
  */
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )  
}

class Board extends React.Component {  
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={()=> this.props.onClick(i)} 
      />
    );
  }

  render() {
    var rows = [];
    const rowCount = 3;
    for (var i = 0; i < rowCount; i++){
      var row = [];
      for (var n = 0; n < rowCount; n++){
        row.push(this.renderSquare(n + (i * rowCount)));
      }
      rows.push(<div className="board-row">{row}</div>);
    }
    
    return (<div>{rows}</div>);
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares:Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    }
  }
  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X': 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  };

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        "Go to move #: " + move :
        "Go to game start";
      
      if (this.state.stepNumber === move){
        return (
          <li key={move}>
            <button style={{fontWeight: 'bold'}} onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        )
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    });

    let status;
    if (winner){
      status = "Winner: " + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares){
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
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
