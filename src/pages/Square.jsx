import cross from '../assets/crossB.png'
import circle from '../assets/circleB.png'
import React from 'react';

function Square(props) {
  return (
    <div className={'square'} {...props}>{props.cross ? <view><img src={cross} /></view> : (props.circle ? <view><img src={circle} /></view> : '')}</div>
  );
}

export default Square;