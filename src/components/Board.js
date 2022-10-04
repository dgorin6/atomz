import React, { Component } from 'react'
import Cell from './Cell'

export default class Board extends Component {
    constructor(props) {
        super(props);
    }
  render() {
    return(
        <div className='board'>
        {this.props.cells.map((row, rindex) => {
            return (
            <div key = {rindex} className="board-row">
                {row.map((column, cindex) => {
                  return <span key = {[rindex,cindex]} onClick = {()=>this.props.calculateChanges(rindex,cindex)}><Cell curr_player = {this.props.colors[rindex][cindex]} atoms = {this.props.cells[rindex][cindex]}></Cell></span>;
                })}
              </div>
            );
          })}
          </div>
    )
  }
}