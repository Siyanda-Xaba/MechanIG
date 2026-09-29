// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIow8TP9gJTEbOyIAInaMh-3usjrCOw9s",
  authDomain: "mechaniq-3a0f2.firebaseapp.com",
  databaseURL: "https://mechaniq-3a0f2-default-rtdb.firebaseio.com",
  projectId: "mechaniq-3a0f2",
  storageBucket: "mechaniq-3a0f2.firebasestorage.app",
  messagingSenderId: "174807907179",
  appId: "1:174807907179:web:decd35675c9a5f14e8aa2e",
  measurementId: "G-MQSQTV657X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);