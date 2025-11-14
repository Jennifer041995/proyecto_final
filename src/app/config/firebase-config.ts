// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVAFiRqHN7lvT7ZTBehxy4OZ6o6M6vDs0",
  authDomain: "player-86149.firebaseapp.com",
  databaseURL: "https://player-86149-default-rtdb.firebaseio.com",
  projectId: "player-86149",
  storageBucket: "player-86149.firebasestorage.app",
  messagingSenderId: "528248121707",
  appId: "1:528248121707:web:4c5cf9ca0714ad76bc042e",
  measurementId: "G-0FK9RBZQ50"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);