import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

const categoriesCollection = collection(db, "categories");

export async function getCategories() {

  const snapshot = await getDocs(categoriesCollection);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

}

export async function createCategory(category) {

  return await addDoc(categoriesCollection, category);

}

export async function updateCategory(id, data) {

  return await updateDoc(
    doc(db, "categories", id),
    data
  );

}

export async function deleteCategory(id) {

  return await deleteDoc(
    doc(db, "categories", id)
  );

}