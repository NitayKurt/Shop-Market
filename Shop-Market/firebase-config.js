// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqPVrLVJ1VfrHt2A4dSrpUip8sJYb0Rns",
  authDomain: "shop-market-20c07.firebaseapp.com",
  projectId: "shop-market-20c07",
  storageBucket: "shop-market-20c07.appspot.com",
  messagingSenderId: "43241391136",
  appId: "1:43241391136:web:03ae73d713b346cb0c6845",
  measurementId: "G-5J9ESMTC0M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);