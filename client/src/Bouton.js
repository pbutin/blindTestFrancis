import React from 'react';

const Bouton = (props) => {
  return (
    <span className={"clickable bouton " + props.type} onClick={props.onClick}>
        <i className="vertical-center">{props.label}</i>
    </span>
  );
}

export default Bouton;