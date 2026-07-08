import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { auth, db } from "@/firebase/firebase";

export async function login(username, password) {
  const q = query(
    collection(db, "users"),
    where("username", "==", username)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("Usuario no encontrado");
  }

  const document = snapshot.docs[0];
  const user = document.data();

  if (user.active === false) {
    throw new Error("Usuario desactivado");
  }

  await signInWithEmailAndPassword(
    auth,
    user.email,
    password
  );

  const loggedUser = {
    id: document.id,
    uid: user.uid || document.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    active: user.active,
  };

  localStorage.setItem("user", JSON.stringify(loggedUser));

  return loggedUser;
}

export async function logout() {
  localStorage.removeItem("user");
  await signOut(auth);
}