import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCWSBMpZ2SoImKQeoH-j7u63dvVA1GKVuw",
  authDomain: "perdaycoaching.firebaseapp.com",
  projectId: "perdaycoaching",
  storageBucket: "perdaycoaching.appspot.com",
  messagingSenderId: "303500461503",
  appId: "1:303500461503:web:5765538420997fc6880d0a",
  measurementId: "G-QY7SK61FYM"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue };
