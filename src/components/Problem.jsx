import React,{useEffect,  useState} from 'react';
import styled,{keyframes} from 'styled-components';
import BottomBox from './BottomBox';
import AppBar from './AppBar';
import Button from './Button';
import Progress from './Progress';
import { useNavigate } from 'react-router-dom';
import hangul from 'hangul-js';

const Wrap=styled.div`
  min-height:900px;
`;

//로딩시 애니메이션을 위한 함수
const rotator = keyframes`
  0% {
    -webkit-transform: rotate(-45deg) translateZ(0);
    transform: rotate(-45deg) translateZ(0);
  }
  100% {
    -webkit-transform: rotate(315deg) translateZ(0);
    transform: rotate(315deg) translateZ(0);
  }
`;

const Loading=styled.div`
  position:absolute;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
  img{
    widht:70px;
    height:70px;
    animation-name: ${rotator};
    animation-iteration-count: infinite;
    animation-duration: 3s;
  }
  div{
    text-align:center;
    font-size:20px;
    margin-top:20px;
  }
`;

const Hint=styled.div`
  font-weight: 700;
  font-size: 38px;
  text-align:center;
  padding:100px 0px 80px 0px;
`;

const Hole=styled.div`
  position:absolute;
  left:50%;
  transform:translateX(-50%);
  display:flex;
  .hole{
    width:10px;
    height:10px;
    border:white 5px solid;
    border-radius:100%;
    margin:8px;
  }
  .blank{
    border:none;
    margin:8px;
  }
`;

const Result=styled.div`
  font-weight:700;
  font-size:30px;
  text-align:center;
  margin:10px 0px 50px 0px;
  color:${props=>props.result==='틀렸습니다'?'red':'#04C000'}
`;

const Answer=styled.div`
  font-weight: 700;
  font-size: 30px;
`;

const AnswerWrap=styled.div`
  text-align:center;
  margin-top:50px;
  div.img{
    margin:30px 0px;
  }
`;

const AddHint=styled.div`
  font-size:30px;
  text-align:center;
`;

const HintClick=styled.div`
  text-align:center;
  margin-top:90px;
  text-decoration:underline;
`;
const Timer=styled.div`
  height:50px;
  line-height:50px;
  text-align:center;
  font-size:30px;
  margin-top:20px;
`;

function Problem(props) {
  const navigate=useNavigate();
  const loading=props.loading;
  const quiz=props.quiz;
  const index=props.index+1;
  //정답을 관리하는 state
  const [answer,setAnswer]=useState('');
  //영어로 변역한걸 관리하느 state
  const [english,setEnglish]=useState('');
  //다시 한글로 번역한 힌트를 관리하는 state
  const [hint, setHint]=useState('');
  //정답의 길이만큼의 배열
  const num = (answer?[...answer]:'');
  //input값을 관리하는 state
  const [text,setText]=useState('');
  //맞고 틀림을 관리하는 state
  const [result,setResult]=useState('');
  //문제창인지 경과창인지 관리하는 state
  const [present,setPresent]=useState('problem');  
  //맞은 갯수를 관리하는 state
  const [correct,setCorrect]=useState(0);
  //힌트를 보여줄지 안보여줄지 관리하는 state
  const [addHint,setAddHint]=useState('');
  //초성힌트를 담는 state
  const [consonant,setConsonant]=useState('');
  //시간을 관리하는 state
  const [time,setTime]=useState('1:00');

    //props로 내려준 quiz를 각 state에 분배
    useEffect(()=>{
      if(quiz){
        setAnswer(quiz.title_ans);
        setEnglish(quiz.title_eng);
        setHint(quiz.title_hint);
      }
    },[quiz]);

  //타이머 생성
  useEffect(()=>{
    const timer=setInterval(()=>{
      if(present==='problem'){
          const sec=time.slice(2,4);
          const min=time.slice(0,1);
          if(sec==='00'){
            const timeRef=`${min-1}`.concat(':').concat('59');
            setTime(timeRef);
          }else if(parseInt(sec)<11){
            const timeRef=min.concat(':').concat(`0${sec-1}`);
            setTime(timeRef);
          }else{
            const timeRef=min.concat(':').concat(`${sec-1}`);
            setTime(timeRef);
          };
      };
    },1000);
    return ()=>clearInterval(timer);
  },[time,present]);

  //타이머가 끝날시 Result창으로 이동
  useEffect(()=>{
    if(time==='0:00'){
      navigate("/Result", {state: {correct:correct,time:parseInt((time.slice(0,1)==='1'?60:time.slice(2,4)))}}) ;
    }
  },[navigate,time,correct]);

  //input값 관리 함수
  const onChange=(e)=>{
    setText(e.target.value);
  };

  //result창에서 enter로 넘어가는거 처리
  window.onkeydown=(e)=>{
    if(present==='result'&&e.key==="Enter"){
      nextProblem();
    };
  };

  //input제출시 처리함수
  const onSubmit=()=>{
    if(text){
      if(answer===text){
        setResult('정답입니다');
        setCorrect(correct+1);
      }else{
        setResult('틀렸습니다');
      }
      setText('');
      setPresent('result');
    };
  };

  //input에서 enter누를시 submit
  const onKeyPress=(e)=>{
    if(e.key==='Enter'){
      onSubmit();
    };
  };

  //다음문제로 넘어가면 초성이랑 보여줄지에 대한 state를 초기화
  useEffect(()=>{
    setConsonant('');
    setAddHint('');
  },[index]);

  //다음문제로 이동 함수
  const nextProblem=()=>{
    if(index===10){
      navigate("/Result", {state: {correct:correct,time:parseInt((time.slice(0,1)==='1'?60:time.slice(2,4)))}});
    }
    props.onClick();
    setPresent('problem');
  };

  //힌트 관리 함수
  const handleAddHint=()=>{
    const hangleArray=hangul.d(quiz.title_ans,true);
    let str='';
    hangleArray.map((hangle)=>
      str+=hangle[0]
    )
      
    setConsonant(str);
    setAddHint('show');
  };

  return (
    <Wrap>
      <AppBar></AppBar>
      <Progress state={index}></Progress>
      <Timer>⏰ {time}</Timer>
      {loading?
        <>
          {present==='problem'?
            <>
              <Hint>{hint}</Hint>
              {addHint?<AddHint>{consonant}</AddHint>:
              <>
                {num?
                <>
                  <Hole>
                    {num.map((hole,index)=>hole===' '?<div className='blank' key={index}></div>:<div className='hole'key={index}></div>)}
                  </Hole>
                  <HintClick onClick={handleAddHint}>힌트보기</HintClick>
                </>
                :null}
              </>}
            </>:
            <AnswerWrap>
              <Answer>{hint}</Answer>
              <div className='img'><img alt="arrow"  src={process.env.PUBLIC_URL+'/img/arrow.png'}></img></div>
              <Answer style={{fontSize:'30px'}}>{english}</Answer>
              <div className='img'><img alt="arrow"  src={process.env.PUBLIC_URL+'/img/arrow.png'}></img></div>
              <Answer style={{fontSize:'35px'}}>{answer}</Answer>
            </AnswerWrap>
          }
          <BottomBox>
            {present==='problem'?
            <div style={{marginBottom:'20px'}}>
              <div style={{lineHeight:'49px',textAlign:'center',marginBottom:'20px',fontWeight:'700',fontSize:'21px'}}>정답을 입력해주세요.</div>
              <div style={{textAlign:'center',padding:'10px 0px 30px 0px'}}>
                <input onChange={onChange} value={text} onKeyPress={onKeyPress} type='text' name='title' style={{width:'90%',border:'1px solid rgba(0, 0, 0, 0.2)',height:'50px',borderRadius:'10px',margin:'0px',textAlign:'center',fontSize:'20px'}} required autoFocus/>
              </div>
            </div>:
            <Result result={result}>{result}</Result>}
          </BottomBox>
          {present==='problem'?
          <Button onClick={onSubmit}>Submit</Button>
          :<Button onClick={nextProblem}>Next</Button>}
        </>
        :
        <Loading>
          <div><img alt="img" src={process.env.PUBLIC_URL + `/img/loading.png`}></img></div>
          <div>문제를 준비중입니다</div>
        </Loading>
        
      }
      
      
    </Wrap>
  )
}

export default Problem