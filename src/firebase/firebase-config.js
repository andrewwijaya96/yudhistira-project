// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "@firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCW1Jp4J5zFp-1fjNkC-4W2_GpCYfprhh4",
  authDomain: "yudhistira-1bef0.firebaseapp.com",
  projectId: "yudhistira-1bef0",
  storageBucket: "yudhistira-1bef0.appspot.com",
  messagingSenderId: "1002576446647",
  appId: "1:1002576446647:web:970aed9956ab5755bab932",
  measurementId: "G-69LFE5B0QQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
