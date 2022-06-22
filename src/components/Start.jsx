import React, { useEffect,useState } from 'react';
import styled from 'styled-components';
import {NavLink} from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const Wrab=styled.div`
  max-width:420px;
  min-width:300px;
  width:100%;
  background-color:black;
  margin:0 auto;
  position:relative;
  color:white;
  height:100vh;
`;

const Title=styled.div`
  font-weight: 700;
  font-size: 49px;
  line-height: 20px;
  position:absolute;
  top:40%;
  left:50%;
  transform:translate(-50%,-50%);
  width:300px;
  text-align:center;
`;

const Sub=styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  width:300px;
  text-align:center;
`;

const Login=styled.div`
  img{
    width: 198px;
    height: 48px;
    position:absolute;
    top:70%;
    left:50%;
    transform:translate(-50%,-50%);
  }
  div{
    padding:15px;
    font-weight: 400;
    font-size: 11px;
    line-height: 20px;
    position:absolute;
    top:77%;
    left:50%;
    transform:translate(-50%,-50%);
    text-align:center;
  }
  .blur{
    font-size:16px;
    width:100%;
    -webkit-filter: blur(2px);
    filter: blur(2px);
  }
  .notblur{
    font-size:16px;
    width:100%;
    -webkit-transition: .3s ease-in-out;
    transition: .3s ease-in-out;
    -webkit-filter: blur(0);
    filter: blur(0);
  }
`;

export default function Start(props) {
  const user=props.user;
  const googleLogin=props.googleLogin
  const navigate=useNavigate();
  //애니메이션을 위한 state
  const [fadeout,setFadeout]=useState(false)
  
  //로그인 성공시 애니메이션후 /Home으로 이동
  useEffect(()=>{
    //유저가 없는 경우 실행x
    if(user){
      setTimeout(()=>{
        setFadeout("true")
      },700)
      setTimeout(()=>{
        navigate("/Home") 
      },2000)
    }
  },[user,navigate])

  return (
    <Wrab>
      <Title>Movie Quiz</Title>
      <Sub>영화 이름 맞추기 게임에 도전하시겠습니까?</Sub>
      <Login>
        {user?
        <>
        <div className={fadeout?'notblur':'blur'}>
          {user.email.split("@")[0]}님, 환영합니다
        </div>
        </>
        :
        <>
          <img alt="GoogleLogin" src={process.env.PUBLIC_URL+'/img/GoogleLogin.png'} onClick={googleLogin}></img>
          <div><NavLink style={{color:'white'}} to='/Home'>로그인없이 하러가기</NavLink></div>
        </>
        }
      </Login>
    </Wrab>
  )
}
