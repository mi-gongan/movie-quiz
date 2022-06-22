import React from 'react';
import styled from 'styled-components';

const Div=styled.div`
  background-color:white;
  color:black;
  width:100%;
  border-radius:10px;
  div{
    padding:15px;
    width:100%;
  }
`;
function Box(props) {
  return (
    <Div><div>{props.children}</div></Div>
  )
}

export default Box;