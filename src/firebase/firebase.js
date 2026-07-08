import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";

import { getStorage } from "firebase/storage";

import { getFunctions } from "firebase/functions";


const firebaseConfig = {
  apiKey: "AIzaSyAgKzaVbXIq2nKXx4mLRpycBG6HDwVpnL4",
  authDomain: "castrobasket-platform.firebaseapp.com",
  projectId: "castrobasket-platform",
  storageBucket: "castrobasket-platform.firebasestorage.app",
  messagingSenderId: "10399080560",
  appId: "1:10399080560:web:105c808c2b7000bacd94b5",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth(app);

export const storage = getStorage(app);
export const functions = getFunctions(app, "us-central1");

export default app;