import React,{useEffect, useState} from 'react'
import {getQuiz,getRandomNumArray} from "../firebase.js";
import Problem from './Problem';



function Quiz() {
  //문제번호를 관리하기 위한 state
  const [index,setIndex]=useState(0);
  //index에 데한 quiz를 담을 state
  const [quizes, setQuiz] = useState([]);
  //문제를 불러오기 전인지를 알기 위한 state
  const [loading,setLoading]=useState('');

  //Quiz를 세팅하는 함수
  const setMyQuiz = () => {
    getQuiz(getRandomNumArray()).then(result => {
        setQuiz(result);
        setLoading("complete")
    }).catch(error=>console.log(error))
  };

  //처음 랜더링시에만 Quiz를 세팅
  useEffect(()=>setMyQuiz(),[])

  //다음문제로 넘어가는 함수
  const nextProblem=()=>{
    setIndex(index+1)
  }

  return (
      <Problem loading={loading} quiz={quizes[index]} index={index} onClick={nextProblem}/>
  )
}

export default Quiz