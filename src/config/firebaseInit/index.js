// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDKVzYsPcg6qFx0kH9QAYksDcYeHWp3HIQ',
  authDomain: 'hospital-2f80b.firebaseapp.com',
  projectId: 'hospital-2f80b',
  storageBucket: 'hospital-2f80b.appspot.com',
  messagingSenderId: '871759794553',
  appId: '1:871759794553:web:de574ea4be58ae50755fa8',
  databaseURL:
    'https://hospital-2f80b-default-rtdb.asia-southeast1.firebasedatabase.app',
};

// Initialize Firebase
export const firebaseInit = initializeApp(firebaseConfig);
