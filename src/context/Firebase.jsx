import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

const FirebaseContext = createContext(null);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestoredb = getFirestore(firebaseApp);
const GoogleProvider = new GoogleAuthProvider();

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      console.log("User:", user);
      setUser(user || null);
    });
  }, []);

  const isLoggedIn = !!user;

  const SignInwithGoogle = () => signInWithPopup(firebaseAuth, GoogleProvider);

  const SignUpUserwithEmailandPassword = (email, password) =>
    createUserWithEmailAndPassword(firebaseAuth, email, password);

  const SignInUserwithEmailandPassword = (email, password) =>
    signInWithEmailAndPassword(firebaseAuth, email, password);

  const handleCreateNewListing = async (title, isbnNumber, price, coverPicUrl) => {
    return await addDoc(collection(firestoredb, "books"), {
      title,
      isbnNumber,
      price: Number(price),
      coverPicUrl,
      createdAt: serverTimestamp(),
      userID: user?.uid,
      userEmail: user?.email,
      displayName: user?.displayName,
      userImg: user?.photoURL,
    });
  };

  const listAllBooks = ()=>{
    return getDocs(collection(firestoredb,"books"))
  }

  return (
    <FirebaseContext.Provider
      value={{
        SignUpUserwithEmailandPassword,
        SignInUserwithEmailandPassword,
        SignInwithGoogle,
        handleCreateNewListing,
        isLoggedIn,
        user,
        listAllBooks,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
