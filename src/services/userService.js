import {
  collection,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { httpsCallable } from "firebase/functions";

import { db } from "@/firebase/firebase";
import { functions } from "@/firebase/firebase";

const usersCollection = collection(db, "users");

/*
|--------------------------------------------------------------------------
| Obtener todos los usuarios
|--------------------------------------------------------------------------
*/

export async function getUsers() {
  const snapshot = await getDocs(usersCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/*
|--------------------------------------------------------------------------
| Obtener árbitros
|--------------------------------------------------------------------------
*/

export async function getReferees() {
  const q = query(
    usersCollection,
    where("role", "==", "referee"),
    where("active", "==", true)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/*
|--------------------------------------------------------------------------
| Obtener administradores
|--------------------------------------------------------------------------
*/

export async function getAdmins() {
  const q = query(
    usersCollection,
    where("role", "==", "admin")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/*
|--------------------------------------------------------------------------
| Obtener usuario
|--------------------------------------------------------------------------
*/

export async function getUser(id) {
  const snapshot = await getDoc(doc(db, "users", id));

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

/*
|--------------------------------------------------------------------------
| Crear usuario
|--------------------------------------------------------------------------
*/

export async function createUser(user) {

  const createUserFunction = httpsCallable(functions, "createUser");

  return await createUserFunction(user);

}

/*
|--------------------------------------------------------------------------
| Actualizar usuario
|--------------------------------------------------------------------------
*/

export async function updateUser(id, user) {
  return await updateDoc(
    doc(db, "users", id),
    user
  );
}

/*
|--------------------------------------------------------------------------
| Eliminar usuario
|--------------------------------------------------------------------------
*/

export async function deleteUser(id) {
  return await deleteDoc(
    doc(db, "users", id)
  );
}

/*
|--------------------------------------------------------------------------
| Activar / Desactivar
|--------------------------------------------------------------------------
*/

export async function toggleUser(id, active) {
  return await updateDoc(
    doc(db, "users", id),
    {
      active,
    }
  );
}