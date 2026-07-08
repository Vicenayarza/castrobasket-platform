import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

const courtsCollection = collection(db, "courts");

export async function getCourts() {
  const snapshot = await getDocs(courtsCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function createCourt(court) {
  return await addDoc(courtsCollection, {
    ...court,
    createdAt: serverTimestamp(),
  });
}

export async function updateCourt(id, court) {
  return await updateDoc(doc(db, "courts", id), court);
}

export async function deleteCourt(id) {
  return await deleteDoc(doc(db, "courts", id));
}