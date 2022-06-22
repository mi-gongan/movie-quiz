import React from 'react'
import styled from 'styled-components'

const Back=styled.div`
  background-color:gray;
  opacity:0.6;
  z-index:90;
  position:fixed;
  width:100%;
  max-width:420px;
  height:100%;
`
const Rule=styled.div`
  text-align:center;
  background-color:white;
  z-index:99;
  position:fixed;
  width:300px;
  height:400px;
  left:50%;
  top:200px;
  transform:translateX(-50%);
  border-radius:20px;
  div{
    color:black;
    margin:60px 30px;
  }
  span{
    color:orange;
  }
`
const Modal=styled.div`
  display:${props=>props.show==='show'?'block':'none'}
`

function RuleModal(props) {
  return (
    <Modal show={props.show} onClick={()=>props.onClick()}>
      <Back></Back>
      <Rule>
        <div>
          <p><span>영화이름</span> 맞추기 게임입니다.</p>
          <p>정답은 항상 <span>한글</span>이며</p>
          <p><span>한글</span>에서 <span>영어</span>로 변역</p>
          <p><span>영어</span>에서 <span>한글</span>로 번역</p>
          <p>한것을 보여줍니다</p>
          <p><span>자리수</span>와 <span>공백</span>은 주어집니다</p>
          <p>추가적인 힌트는 <span>초성</span>입니다</p>
          <p>그럼 게임을 하러 가보실까요❓</p> 
        </div>
      </Rule>
    </Modal>
  )
}

export default RuleModal