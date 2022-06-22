
import React from 'react';
import styled from 'styled-components';

const Wrap=styled.div`
  display:flex;
  height:40px;
  div:nth-child(2){
    font-weight: 700;
    font-size: 28px;
    line-height:30px;
    margin:5px;
  }
  margin:15px
`;


const Bar=styled.div`
  height:24px;
  background-color:white;
  width:80%;
  position:relative;
  margin:8px;
`;

const Size=styled.div`
  width:${props=>props.state*10}%;
  background-color:#949494;
  height:24px;
  position:absolute;
  left:0px;
  top:0px;
`;

function Progress(props) {
  const state=props.state;
  return (
    <Wrap>
      <Bar>
        <Size state={state}></Size>
      </Bar>
      <div>{state}/10</div>
    </Wrap>
  )
}

export default Progress