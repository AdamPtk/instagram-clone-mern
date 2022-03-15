import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCkWYulUxsIbE3TfETxfX3q_vGXTgqhavU",
  authDomain: "instagram-clone-d4d35.firebaseapp.com",
  projectId: "instagram-clone-d4d35",
  storageBucket: "instagram-clone-d4d35.appspot.com",
  messagingSenderId: "905203036001",
  appId: "1:905203036001:web:bbc4d74b7b5d5f99a69f20",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
