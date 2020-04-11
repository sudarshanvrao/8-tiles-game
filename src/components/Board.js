import React from 'react';
import { shuffleGrid, calculateWinner } from "../utils/shuffle";

function Tile(props) {
    let { index, handleClick } = props;
    if (props.value !== 0)
        return (
            <div
                style={{
                    cursor: "pointer",
                }}
                onClick={() => {
                    handleClick(index);
                }}
                className="tile"
            >
                {props.value}
            </div>
        );
    else return <span className="empty">.</span>;
}

export class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            empty_i: 2,
            empty_j: 2,
            grid: [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 0],
            ],
            time: 0,
            game_started: false,
        };
    }
    shuffleBoard = () => {
        this.interval = setInterval(this.increment, 1000);
        let grid = shuffleGrid();
        let i, j;
        let empty_i, empty_j;
        for (i = 0; i <= 2; i++)
            for (j = 0; j <= 2; j++)
                if (grid[i][j] === 0) {
                    empty_i = i;
                    empty_j = j;
                    j = 2;
                    i = 2;
                }
        this.setState({ grid, empty_i, empty_j, game_started: true });
    }
    increment = () => {
        this.setState((state) => ({ time: state.time + 1 }));
    };

    reset = () => {
        let grid = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 0],
        ];
        window.clearInterval(this.interval);
        this.setState({ grid, empty_i: 2, empty_j: 2, time: 0, game_started: false });
    };
    handleChange = (index) => {
        let grid = this.state.grid;
        let empty_i = this.state.empty_i;
        let empty_j = this.state.empty_j;
        let { i, j } = index;

        //swap with empty block
        let temp = grid[empty_i][empty_j];
        grid[empty_i][empty_j] = grid[i][j];
        grid[i][j] = temp;
        this.setState({ grid: grid, empty_i: i, empty_j: j });
        let correct = calculateWinner(this.state.grid);
        if (correct)
            window.clearInterval(this.interval);
    };

    handleClick = (index) => {
        let { i, j } = index;
        let { empty_i, empty_j } = this.state;
        if ((empty_i === i + 1 && empty_j === j) || (empty_i === i - 1 && empty_j === j)
            || (empty_j === j - 1 && empty_i === i) || (empty_j === j + 1 && empty_i === i))
            this.handleChange(index);
    };
    render() {
        let correct = calculateWinner(this.state.grid);
        let won = correct && this.state.game_started;
        if (!won) {
            return (
                <div>
                    <div className="card">
                        <div className="board">
                            {
                                this.state.grid.map((list, i) => {
                                    return (
                                        <div key={i}>
                                            {list.map((item, j) => {
                                                let index = { i, j, };
                                                return <Tile value={this.state.grid[i][j]} key={j} handleClick={this.handleClick} index={index} />;
                                            })}
                                        </div>
                                    );
                                })}
                        </div>
                        <div className="clock">
                            <h3>
                                {Math.floor(this.state.time / 60)} : {this.state.time % 60}
                            </h3>
                        </div>
                    </div>
                    <div className="buttons">
                        <button onClick={correct ? this.shuffleBoard : this.reset}>
                            {correct ? "START" : "RESET"}
                        </button>
                    </div>
                </div>
            );
        } else {
            window.clearInterval(this.interval);
            return (
                <div style={{
                    display: "grid",
                    justifyItems: "center",
                }}>
                    <h1>
                        CONGRATULATIONS <br /> YOU WON IN {Math.floor(this.state.time / 60)}:
                    {this.state.time % 60}{" "}
                    </h1>
                    <button
                        onClick={() => {
                            window.location.reload();
                        }}
                    >
                        PLAY AGAIN
                  </button>
                </div>
            );
        }
    }
}
