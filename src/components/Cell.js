import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
const Cell = ({curr_player,atoms}) => {
  const calculateCell = () => {
    const circles = [];
    for (let i = 0; i < atoms; i++) {
      let name = 'circles_' + atoms + '_'+ i;
      circles.push(<span className = {name} key = {i}><FontAwesomeIcon icon={faCircle} /></span>);
    }
    let name = 'circles_' + atoms
    return <div className = {name}>{circles}</div>;
  }
  return (
    <button className = {curr_player}>
    {calculateCell({atoms})}
    </button>
  )
}

export default Cell