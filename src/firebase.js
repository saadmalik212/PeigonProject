import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
 apiKey: "AIzaSyAyc1To0tYHxZvLjZQbrnZ4msz1lDnzmBY",
  authDomain: "peigon-d8bdb.firebaseapp.com",
  databaseURL: "https://peigon-d8bdb-default-rtdb.firebaseio.com",
  projectId: "peigon-d8bdb",
  storageBucket: "peigon-d8bdb.firebasestorage.app",
  messagingSenderId: "147201713448",
  appId: "1:147201713448:web:8a2a75d5e21ae14f759c1d"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);