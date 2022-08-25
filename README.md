Movie-quiz
============================================

### Play url
https://movie-quiz-eight.vercel.app/


## Intro

![image](https://user-images.githubusercontent.com/33277896/174984948-3a0fa253-049b-48b1-8b4f-816a03a93f85.png)

![image](https://user-images.githubusercontent.com/33277896/174985018-c0706c75-987d-44b9-8a56-150b45f815c9.png)

기존의 단어를 한글 -> 영어 -> 한글로 번역할 경우 원래 단어와 다른 해석을 내는 것을 이용하여 게임으로 제작하였습니다.

번역한 결과 단어를 보고 원래 영화 제목을 맞추면 정답입니다.
( 자리수와 공백은 주어지며 초성 추가힌트를 볼 수 있습니다. )

게임 한번에 총 10개의 무작위 퀴즈가 주어지고, 60초 내에 풀면 됩니다.

빠르게 풀수록, 많이 맞출수록 고득점이 가능합니다.


### Functions & Pages


 - /Home :
 구글 로그인 후, 전체 최고득점 랭킹과 경험치 랭킹 스코어보드를 볼 수 있습니다. 좌상단의 버튼으로 도움말을, 우상단의 버튼으로 MyPage를 볼 수 있습니다.
 
 
![image](https://user-images.githubusercontent.com/33277896/174987927-a547c0db-6d00-4344-baa2-f5407f37923b.png)


 - /MyPage :
 본인의 점수 기록, 현재 순위, 경험치/레벨을 확인 할 수 있습니다.
 
 
![image](https://user-images.githubusercontent.com/33277896/174988006-aae60d26-6d5f-438a-a5e3-18ac79fa46d4.png)


 - /Quiz :
 힌트를 클릭하여 볼 수 있고 타이머와 문제를 푼 개수를 볼 수 있습니다.
 
 
![image](https://user-images.githubusercontent.com/33277896/174988158-a220bf45-6df1-4109-82bf-07025d798c0f.png)

 
 
 - /Result :
 게임 결과창입니다. 맞춘 개수, 남은 시간, 최종 점수, 얻은 EXP를 볼 수 있습니다.
 
 
 ![image](https://user-images.githubusercontent.com/33277896/174989530-3ce9b629-84b0-406f-8ef8-ab6ae2ee897f.png)

### What used for this

- React for front-end
- Firestore for back-end
- Naver papago NMT api for translation
# movie-quiz
