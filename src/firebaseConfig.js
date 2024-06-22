// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDf65w2koRr-SDxJvVgYLddp0euVhLG13E",
  authDomain: "bridgethegap-school.firebaseapp.com",
  projectId: "bridgethegap-school",
  storageBucket: "bridgethegap-school.appspot.com",
  messagingSenderId: "844083782564",
  appId: "1:844083782564:web:dbd6d4b1d727a6520dd731",
  measurementId: "G-GYM2LFXNP6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
export { db, storage};