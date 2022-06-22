import React,{useState} from 'react';
import styled from 'styled-components';
import BottomBox from './BottomBox';
import AppBar from './AppBar';
import Box from './Box';
import Button from './Button';
import {NavLink} from "react-router-dom";
import {getScoreboard,getExpScoreboard} from "../firebase.js";
import { useEffect } from 'react'

const Wrap=styled.div`
  min-height:950px;
`;

const SelectRank=styled.div`
  text-align:center;
  .rank{
    color:gray;
    font-size:18px;
    text-align:center;
    height:50px;
    padding-top:20px;
  }
  span{
    cursor:pointer;
    padding:5px 10px;
    margin:10px;
    position:relative;
    top:12px;
  }
  .select{
    color:orange;
    border:1px white solid;
    border-radius:10px;
  }
`;

const Gold=styled.div`
  img{
    width:100px;
    height:100px;
  }
  position:absolute;
  top:28%;
  left:50%;
  transform:translate(-50%,-50%);
  text-align:center;
  div{
    margin:5px;
  }
` ;

const Silver=styled.div`
  img{
    width:100px;
    height:100px;
  }
  position:absolute;
  top:48%;
  left:10%;
  transform:translate(0%,-50%);
  text-align:center;
  div{
    margin:5px;
  }
`;

const Ddong=styled.div`
  img{
    width:100px;
    height:100px;
  }
  position:absolute;
  top:48%;
  right:10%;
  transform:translate(0%,-50%);
  text-align:center;
  div{
    margin:5px;
  }
`;


export default function Home(props) {
  const [scores, setScores] = useState([]);
  const [exp, setExp] = useState([]);
  const bottomScores=scores.slice(3,7);
  const bottomExp=exp.slice(3,7);
  console.log(bottomExp)
  const [loading,setLoading]=useState('');
  const [rank,setRank]=useState('Score');

  //처음 랜더링시에만 랭킹 업데이트
  useEffect(()=>{
    setScoreboard();
    setExpboard();
  },[]);

  //ScoreRanking 가져오기 함수(firebase.js)
  const setScoreboard = () => {
    getScoreboard().then(result => {
        setScores(result);
        setLoading('complete')
    }).catch(error=>console.log(error))
  };
  
  //ExpRanking 가져오기 함수
  const setExpboard = () => {
    getExpScoreboard().then(result => {
        setExp(result);
    }).catch(error=>console.log(error));
  };
  
  //rank선택
  const handleRank=(e)=>{
    setRank(e.target.innerText);
  };

  return (
    <Wrap>
      <AppBar handleShow={()=>props.handleShow()}></AppBar>
      {loading===''?'': //로딩이 안됐을 경우 처리
      <>
        <SelectRank>
          <div className='rank'><span className={rank==='Score'?'select':''} onClick={handleRank}>Score</span><span className={rank==='Exp'?'select':''} onClick={handleRank}>Exp</span></div>
        </SelectRank>
        <Gold>
          <img alt="GoogleLogin" src={process.env.PUBLIC_URL +'/img/gold.png'}></img>
          <div>{rank==="Score"?scores[0].email.split('@')[0]:exp[0].email.split('@')[0]}</div><div>{rank==="Score"?scores[0].bestScore:exp[0].EXP}</div>
        </Gold>
        <Silver>
          <img alt="GoogleLogin" src={process.env.PUBLIC_URL +'/img/silver.png'}></img>
          <div>{rank==="Score"?scores[1].email.split('@')[0]:exp[1].email.split('@')[0]}</div><div>{rank==="Score"?scores[1].bestScore:exp[1].EXP}</div>
        </Silver>
        <Ddong>
          <img alt="GoogleLogin" src={process.env.PUBLIC_URL +'/img/ddong.png'}></img>
          <div>{rank==="Score"?scores[2].email.split('@')[0]:exp[2].email.split('@')[0]}</div><div>{rank==="Score"?scores[2].bestScore:exp[2].EXP}</div>
        </Ddong>
        <BottomBox>
          {rank==="Score"?
            <>
              {bottomScores.map((obj,idx)=>
              <div key={idx} style={{display:'flex',marginBottom:'20px'}}>
                <div style={{lineHeight:'49px',textAlign:'center',marginRight:'20px',fontWeight:'700',fontSize:'21px'}}>{idx+4}</div>
                <Box style={{fontSize:'14px'}}>{obj.email.split('@')[0]}</Box>
                <div style={{lineHeight:'49px',textAlign:'center',marginLeft:'20px',fontWeight:'700',fontSize:'21px'}}>{obj.bestScore}</div>
              </div>)}
            </>
            :
            <>
              {bottomExp.map((obj,idx)=>
              <div key={idx} style={{display:'flex',marginBottom:'20px'}}>
                <div style={{lineHeight:'49px',textAlign:'center',marginRight:'20px',fontWeight:'700',fontSize:'21px'}}>{idx+4}</div>
                <Box style={{fontSize:'14px'}}>{obj.email.split('@')[0]}</Box>
                <div style={{lineHeight:'49px',textAlign:'center',marginLeft:'20px',fontWeight:'700',fontSize:'21px'}}>{obj.EXP}</div>
              </div>)}
            </>
          }
        </BottomBox>
        <Button>
          <NavLink style={{color:'white',textDecoration:'none'}} to='/Quiz'>
            Game Start
          </NavLink>
        </Button>
      </>}
    </Wrap>
  )
}
