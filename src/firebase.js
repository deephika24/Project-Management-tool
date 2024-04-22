import { initializeApp } from "firebase/app";
import { getDatabase} from "firebase/database";
import { ref } from "firebase/database";
import { push } from "firebase/database";
import { onValue } from "firebase/database";
import { remove } from "firebase/database";
import { set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBpDCLWm8xAEwG3fKk9mqGGDLfT2fQhYzg",
    authDomain: "projectmanagementtool-8f587.firebaseapp.com",
    projectId: "projectmanagementtool-8f587",
    storageBucket: "projectmanagementtool-8f587.appspot.com",
    messagingSenderId: "1060318820370",
    appId: "1:1060318820370:web:66c49bd254eaff423400cb"
  };

// Initialize Firebase
const app=initializeApp(firebaseConfig);
const database=getDatabase(app);
export { app, database, ref, push,onValue,remove,set };
