


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIehI7szL_5JAoKm3NWG4xLTvl9ZPTK28",
  authDomain: "minutes-f4bcc.firebaseapp.com",
  projectId: "minutes-f4bcc",
  storageBucket: "minutes-f4bcc.appspot.com",
  messagingSenderId: "597444707328",
  appId: "1:597444707328:web:83c7cb1a8e23d7447204e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;