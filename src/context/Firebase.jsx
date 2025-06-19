import {createContext, useContext,useState,useEffect} from "react"
import { initializeApp } from "firebase/app";
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged} from "firebase/auth";
const FirebaseContext = createContext(null);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const GoogleProvider = new GoogleAuthProvider();



export const useFirebase = ()=> useContext(FirebaseContext);

export const FirebaseProvider = (props)=>{

    const [user,setUser] = useState(null);
    useEffect(()=>{
        onAuthStateChanged(firebaseAuth,(user)=>{
            console.log("User:",user)
            if(user){
                setUser(user);
            } else{
                setUser(null);
            }
        })
    },[])

    const isLoggedIn = user ? true :false;

    const SignInwithGoogle = ()=>{
        const result = signInWithPopup(firebaseAuth,GoogleProvider)
        return result;
    }
    const SignUpUserwithEmailandPassword = (email,password)=>{
        const result = createUserWithEmailAndPassword(firebaseAuth,email,password);
        return result;
    }

    const SignInUserwithEmailandPassword = (email,password)=>{
        const result = signInWithEmailAndPassword(firebaseAuth,email,password)
        return result;
    }


    return(
        <FirebaseContext.Provider value={{
                SignUpUserwithEmailandPassword,
                SignInUserwithEmailandPassword,
                SignInwithGoogle,
                isLoggedIn,
            }}>
            {props.children}
        </FirebaseContext.Provider>
    )
}