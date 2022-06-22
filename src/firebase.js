// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {
    getFirestore,
    doc, collection,
    getDoc, getDocs, setDoc, addDoc, updateDoc,
    arrayUnion, increment,
} from 'firebase/firestore';
import {
    browserLocalPersistence,
    getAuth,
    GoogleAuthProvider,
    setPersistence,
    signInAnonymously,
    signInWithPopup,
    updateProfile
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBH5GEuWjqCvwstosSsmH3z88Nb6fPoDqE",
    authDomain: "reactdemo-642cd.firebaseapp.com",
    projectId: "reactdemo-642cd",
    storageBucket: "reactdemo-642cd.appspot.com",
    messagingSenderId: "847945455955",
    appId: "1:847945455955:web:66c640a01a7eccdb6769a6",
    measurementId: "G-27VV5X6338"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

//for google login
export const loginGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
}

// if there's no info on UserData with user's id, add new document with blank score history and email
export const addUser = async (user_id,email) => {
    const docSnap = await getDoc(doc(db, "userData", user_id));
    if (!docSnap.exists()) {
        const data = {
            email : email,
            EXP : 0,
            scores : [],
            bestScore : 0,
            bestScoreDate : '',
            recentScoreDate : ''
        }
        await setDoc(doc(db, "userData", user_id), data).catch(err => console.log(err))
    }
}

//Changeable - for anonymous login (guest play)
export const loginGuest = () => {
    return signInAnonymously(auth)
}

//for setting a user's displayName. used at adding displayname for guest users
export const renameUser = async(name,user=auth.currentUser) => {
    if (user) {
        return await updateProfile(user, {displayName: name}).catch(error => console.log(error));
    } else {
        return null;
    }
}

//for letting login info persistent. Only Logout function can make it deleted.
export const persistenceSet = () => {
    setPersistence(auth, browserLocalPersistence).catch(error => console.log(error));
}

//for updating scores, bestScore, bestScoreDate on firestore userData DB.
//arrayUnion() does not support to store duplicate elements on an array so following 'if' statements used.
export const addScoreHistory = async (user_id, correct,time) => {

    const score=parseInt(50*correct)+parseInt(time);
    const curr = new Date();
    const utc = curr.getTime() + (curr.getTimezoneOffset()*60*1000);
    const kr_curr = new Date(utc+9*60*60*1000);

    const docRef = doc(db,"userData",user_id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()){

        const pastScores = docSnap.data().scores;
        const data = {
            scores: [...pastScores, score],
            recentScoreDate: kr_curr
        };
        await updateDoc(docRef, data);
        const numberScoreArr = pastScores.map(str => Number(str));
        const numberScore = Number(score);
        if (pastScores && Math.max(...numberScoreArr) < numberScore) {
            await updateDoc(docRef, {
                bestScore: score,
                bestScoreDate : kr_curr
            });
        }
        await updateDoc(docRef,{
            scores: arrayUnion(score),
            recentScoreDate: kr_curr
    })
        
    }
}

//for updating user's EXP on firestore userData DB.
export const addExp = async (user_id,exp) => {
    const docSnap = await getDoc(doc(db, "userData", user_id));
    if (docSnap.exists()) {
        const data = {
            EXP : increment(exp)
        }
        await updateDoc(doc(db, "userData", user_id), data).catch(err => console.log(err))
    }
}

//for getting top 10 scores and username info from userData DB's bestScore. if same, earlier one comes first.
//return an array of 10 objects {email, bestScore, bestScoreDate}
export const getScoreboard = async (size=10) => {
    const querySnap = await getDocs(collection(db,"userData"));
    let userScores = [];
    if (querySnap) {
        querySnap.forEach(doc => {
            if (doc.exists() && doc.data().email && doc.data().bestScoreDate !== '') {
                userScores.push({email: doc.data().email, bestScore: Number(doc.data().bestScore), bestScoreDate: doc.data().bestScoreDate})
            }
        })
    }
    const compare = (a,b) => {
        if (b['bestScore']-a['bestScore'] === 0) {
            return a['bestScoreDate']-b['bestScoreDate'];
        } else {
            return b['bestScore']-a['bestScore']
        }
    }
    return userScores.sort(compare).slice(0,size);
}


//currently Working... -> when same EXP met, how can I sort them reasonably?

//for getting top 10 scores and username info from userData DB's EXP. if same, user with earlier BestScoreDate comes first.
//return an array of 10 objects {email, EXP}
export const getExpScoreboard = async (size=10) => {
    const querySnap = await getDocs(collection(db,"userData"));
    let userExps = [];
    if (querySnap) {
        querySnap.forEach(doc => {
            if (doc.exists() && doc.data().email) {
                userExps.push({email: doc.data().email, EXP: doc.data().EXP})
            }
        })
    }
    const compare = (a,b) => {
        if (b['EXP']-a['EXP'] === 0) {
            return a['bestScoreDate']-b['bestScoreDate'];
        } else {
            return b['EXP']-a['EXP'];
        }
    }
    return userExps.sort(compare).slice(0,size);

}

//for calculating rank of game result. guest doesn't get rank.
export const getRank = async (user_id) => {
    const docRef=doc(db,"userData",user_id)
    const docSnap=await(getDoc(docRef))
    const bestScore=docSnap.data().bestScore
    const querySnap = await getDocs(collection(db,"userData"));
    let userScores = [];
    querySnap.forEach(doc => {
        userScores.push(Number(doc.data().bestScore));
    })
    userScores.sort((a,b) =>{ return (a-b) });
    console.log(userScores)
    return userScores.length-userScores.indexOf(parseInt(bestScore));

}

export const getExpRank = async (user_id) => {
    let userExps = [];
    let exp = 0;

    const docRef = doc(db,"userData",user_id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        exp = docSnap.data().EXP;
    }
    const querySnap = await getDocs(collection(db,"userData"));
    querySnap.forEach(doc => {
        userExps.push(Number(doc.data().EXP));
    })
    userExps.sort((a,b) =>{ return (a-b) });
    return userExps.length-userExps.indexOf(exp);
}

// for getting 10 random unique numbers within movieData index.
export const getRandomNumArray = (size=10) => {
    //const querySnap = await getDocs(collection(db,"movieData"));
    //get movieDB Length each time is cost inefficient.
    //set this fixed or add var to db which is +1 each time you add movie to db.
    const moviesCount = 75;
    const arr = Array.from(Array(moviesCount).keys());
    function shuffleArray(array) {
        for (let index = array.length - 1; index > 0; index--) {
            const randomPosition = Math.floor(Math.random() * (index + 1));
            const temporary = array[index];
            array[index] = array[randomPosition];
            array[randomPosition] = temporary;
        }
    }
    shuffleArray(arr);
    return arr.slice(0,size);
}

//for getting movies data from movieData for quiz. return an array of string(title)
export const getQuiz = async (indexArr) => {
    let quizzes = [];
    for (const index of indexArr) {
        const docRef = doc(db, "movieData", String(index));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            quizzes.push(docSnap.data());
        }
    }
    return quizzes;
}



// functions below are for development

//user_id로 userData 받아오기
export const getUserData = async (user_id) => {
    const docRef = doc(db, "userData", user_id)
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}


//for adding random accounts to userData
export const addUnknownUser = async () => {
    const curr = new Date();
    const utc = curr.getTime() + (curr.getTimezoneOffset()*60*1000);
    const kr_curr = new Date(utc+9*60*60*1000);
    const data = {
        email : 'unknown@gmail.com',
        EXP : 10,
        scores : ['10'],
        bestScore : 10,
        bestScoreDate : kr_curr,
        recentScoreDate : kr_curr,
    }
    await addDoc(collection(db,"userData"),data);
}

//DO NOT USE if you don't want to add more data to db.
//for adding title data of a movie on movieData DB with random-gen id-named document
export const addMovie = async (index,title_ans,title_eng,title_hint) => {
    console.log('Added a movie.');
    const data = {
        title_ans : title_ans,
        title_eng : title_eng,
        title_hint : title_hint
    }
    await setDoc(doc(db,"movieData", String(index)), data).catch(err => console.log(err));
}



export { db, auth };
//DO NOT USE if you don't want to add more data to db.
//for adding title data of a movie on movieData DB with random-gen id-named document



