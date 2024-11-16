// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBoFvevgNcIJYRCFqr0EBYgEZ5nUsjM_Zc',
  authDomain: 'hospitalproject-83059.firebaseapp.com',
  projectId: 'hospitalproject-83059',
  storageBucket: 'hospitalproject-83059.firebasestorage.app',
  messagingSenderId: '555175416646',
  appId: '1:555175416646:web:048f8f82df52423bc58b47',
  measurementId: 'G-XEJ8VZHK5L',
};

// Initialize Firebase
export const firebaseInit = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseInit);
