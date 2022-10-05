import Board from "./Board"
import React from 'react'
import { Component } from "react";

const sleep = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);
export default class Game extends Component {
  constructor(props) {
    super(props);
    this.calculateChanges = this.calculateChanges.bind(this)
    this.state = {
      cells: Array(8).fill(0).map(() => Array(8).fill(0)),
      colors: Array(8).fill().map(() => Array(8).fill("not__taken")),
      curr_player: 'player__1',
      winner: "no__winner",
      winner_name: "None",
      disabled: false
  }
  }
  restartGame() {
    this.setState({
      cells: Array(8).fill(0).map(() => Array(8).fill(0)),
      colors: Array(8).fill().map(() => Array(8).fill("not__taken")),
      curr_player: 'player__1'
  });
  }
  changeTeam() {
    if(this.state.curr_player == "player__1") {
        this.setState({
            curr_player: "player__2"
        });
    } else {
        this.setState({
            curr_player: "player__1"
        });
    }
}
updateBoard(board,colors){
    this.setState({
        cells: board,
        colors: colors

    });
}
explosion(curr,board) {
    let max = 0
    if (((curr[0] == 0) || (curr[0]==7)) && ((curr[1]==0) || (curr[1]==7))) {
        max = 2
    } else if(curr[0] == 0 || curr[0] == 7|| curr[1]==0|| curr[1]==7) {
        max = 3
    } else {
        max = 4
    }
    if (board[curr[0]][curr[1]] > max) {
        return true;
    }
    return false;
}
async calculateChanges(r,c){
    if(this.state.disabled||(this.state.colors[r][c] != this.state.curr_player  && this.state.colors[r][c] != "not__taken") || this.state.winner!="no__winner") {
        return;
    }
    this.setState({
        disabled: true
    });
    var board = this.state.cells;
    let colors = this.state.colors;
    let queue1 = [];
    let queue2 = [];
    queue1.push([r,c]);
    while(queue1.length > 0 || queue2.length > 0) {
        for (let i = 0; i < queue1.length; i++) {
            let curr = queue1[i]
            board[curr[0]][curr[1]]+=1
            colors[curr[0]][curr[1]] = this.state.curr_player;
        }
        if (queue1.length == 1 && this.explosion(queue1[0],board)) {
            await sleep(200);
        } else if (queue1.length > 1) {
            await sleep(200);
        }
        this.updateBoard(board,colors);
        while(queue1.length > 0) {
            let curr = queue1.shift();
            colors[curr[0]][curr[1]] = this.state.curr_player;
            let original = board[curr[0]][curr[1]] - 1;
            if (((curr[0] == 0) || (curr[0]==7)) && ((curr[1]==0) || (curr[1]==7))) {
                board[curr[0]][curr[1]]  = (board[curr[0]][curr[1]] - 1) % 2 + 1;
            } else if(curr[0] == 0 || curr[0] == 7|| curr[1]==0|| curr[1]==7) {
                board[curr[0]][curr[1]]  = (board[curr[0]][curr[1]] - 1) % 3 + 1;
            } else {
                board[curr[0]][curr[1]]  = (board[curr[0]][curr[1]] - 1) % 4 + 1;
            }
            if (board[curr[0]][curr[1]] < original) {
                for (let i = -1; i<=1; i+=2){
                    if(curr[0] + i >= 0 && curr[0] + i < board.length) {
                            queue2.push([curr[0] + i,curr[1]]);
                        }
                }
                for (let i = -1; i<=1; i+=2){
                    if(curr[1] + i >= 0 && curr[1] + i < board.length) {
                            queue2.push([curr[0] ,curr[1] + i]);
                        }
                }
            }
    }
    for (let i = 0; i < queue2.length; i++) {
        let curr = queue2[i]
        board[curr[0]][curr[1]]+=1
        colors[curr[0]][curr[1]] = this.state.curr_player;
    }
    this.updateBoard(board,colors);
    if (queue2.length > 0) {
        await sleep(200);
    }
    while(queue2.length > 0) {
        let curr = queue2.shift();
        colors[curr[0]][curr[1]] = this.state.curr_player;
        let original = board[curr[0]][curr[1]] - 1;
        if (((curr[0] == 0) || (curr[0]==7)) && ((curr[1]==0) || (curr[1]==7))) {
            board[curr[0]][curr[1]]  = (board[curr[0]][curr[1]] - 1) % 2 + 1;
        } else if(curr[0] == 0 || curr[0] == 7|| curr[1]==0|| curr[1]==7) {
            board[curr[0]][curr[1]]  = (board[curr[0]][curr[1]] - 1) % 3 + 1;
        } else {
            board[curr[0]][curr[1]]  = (board[curr[0]][curr[1]] - 1) % 4 + 1;
        }
        if (board[curr[0]][curr[1]] < original) {
            for (let i = -1; i<=1; i+=2){
                if(curr[0] + i >= 0 && curr[0] + i < board.length) {
                        queue1.push([curr[0] + i,curr[1]]);
                    }
            }
            for (let i = -1; i<=1; i+=2){
                if(curr[1] + i >= 0 && curr[1] + i < board.length) {
                        queue1.push([curr[0] ,curr[1] + i]);
                    }
            }
        }
    }
    let count = 0;
    let empty = 0;
    for (let i = 0; i < this.state.colors.length; i++) {
        for(let j = 0; j < this.state.colors[0].length; j++) {
            if(this.state.colors[i][j] == "player__1") {
                count++;
            } else if(this.state.colors[i][j] == "not__taken") {
                empty+=1
            }
        }
    }
    if(count == 64 && empty == 0) {
        this.setState({
            winner: "win_player_1",
            winner_name: "Player 1"
        });
    } else if(count == 0 && empty == 0) {
        this.setState({
            winner: "win_player_2",
            winner_name: "Player 2"
        });
    }
}
this.changeTeam();
this.setState({
    disabled:false
});
}
  render() {
    return (
      <div>
        <div className="main">
        <div className={this.state.winner}> Winner: {this.state.winner_name}</div><Board calculateChanges = {this.calculateChanges} cells = {this.state.cells} colors = {this.state.colors} curr_player = {this.state.curr_player}></Board>
        <button onClick = {() => this.restartGame()} className="new__game">New Game</button>
        </div>
      </div>
    )
  }
}