import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import Mypage from './components/Mypage';
import Start from './components/Start';
import styled from 'styled-components'
import Home from './components/Home';
import Quiz from './components/Quiz';
import Result from "./components/Result";
import {useEffect, useState} from "react";
import {loginGoogle,addUser,getUserData} from "./firebase.js";
import {useCookies} from "react-cookie";

const Screen=styled.div`
  max-width:420px;
  min-width:300px;
  width:100%;
  background-color:black;
  margin:0px auto;
  position:relative;
  color:white;
`;

function App() {
  //로그인 저장을 위한 쿠키 state
  const [cookies, setCookie,deleteCookie] = useCookies(["user_id"]); 
  //User관리를 위한 user state
  const [user,setUser]=useState('');

  //쿠키가 있을경우 쿠키로 유저state를 업데이트
  useEffect(()=>{
    const cookie=cookies.user_id
    if(cookie){
      getUserData(cookie).then(user=>{setUser(user)}).catch(error=>console.log(error))
      }
  },[cookies]);

  //구글 로그인
  const googleLogin = (e) => {
    e.preventDefault();
    loginGoogle()
      .then(data => {
        getUserData(data.user.uid).then(user=>setUser(user)).catch(error=>console.log(error))
        addUser(data.user.uid,data.user.email)
        setCookie("user_id",data.user.uid);
      }).catch(error => console.log(error))
  };

  //로그아웃
  const handleLogout=()=>{
    setUser('')
    deleteCookie("user_id")
  };


  return (
      <Screen>
        <Router basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route path="" element={<Start user={user} googleLogin={googleLogin}/>}/>
            <Route path="/Home" element={<Home/>}/>
            <Route path="/Quiz" element={<Quiz/>}/>
            <Route path="/Result" element={<Result user={user} user_id={cookies.user_id}/>}/>
            <Route path="/Mypage" element={<Mypage user={user} user_id={cookies.user_id} googleLogin={googleLogin} onClick={()=>handleLogout}/>}/>
          </Routes>
        </Router>
      </Screen>
  );
}

export default App;
