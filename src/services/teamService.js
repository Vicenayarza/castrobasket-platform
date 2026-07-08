import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { db, storage } from "@/firebase/firebase";

const teamsCollection = collection(db, "teams");

export async function getTeams() {
  const snapshot = await getDocs(teamsCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function uploadTeamLogo(file) {
  if (!file) return "";

  const fileRef = ref(
    storage,
    `team-logos/${Date.now()}-${file.name}`
  );

  await uploadBytes(fileRef, file);

  return await getDownloadURL(fileRef);
}

export async function createTeam(team) {
  return await addDoc(teamsCollection, {
    ...team,
    logo: team.logo || "",
    players: team.players || [],
    createdAt: serverTimestamp(),
  });
}

export async function updateTeam(id, team) {
  return await updateDoc(doc(db, "teams", id), team);
}

export async function updateTeamData(id, team) {
  return await updateDoc(doc(db, "teams", id), team);
}

export async function deleteTeam(id) {
  return await deleteDoc(doc(db, "teams", id));
}