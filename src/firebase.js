// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzNfs8VdD_tHroxZjDCrTETlUSk_91crI",
  authDomain: "realestateproject2024-61b4b.firebaseapp.com",
  projectId: "realestateproject2024-61b4b",
  storageBucket: "realestateproject2024-61b4b.appspot.com",
  messagingSenderId: "172709212692",
  appId: "1:172709212692:web:39de6f8cb7c0b05e916d01"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()