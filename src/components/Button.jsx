import React from 'react'
import styled from 'styled-components'

const Div=styled.div`
  position:absolute;
  bottom:0px;
  width:100%;
  max-width:420px;
  div{
    margin:10px auto;
    width:80%;
    background-color:black;
    text-align:center;
    padding:18px;
    font-weight:700;
    font-size:21px;
    border-radius:10px;
    z-index:999;
  }
  
`
function Button(props) {
  return (
    <Div><div onClick={props.onClick}>{props.children}</div></Div>
  )
}

export default Button