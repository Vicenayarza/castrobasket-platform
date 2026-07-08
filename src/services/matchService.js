import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

const matchesCollection = collection(db, "matches");

/*
|--------------------------------------------------------------------------
| Obtener partidos
|--------------------------------------------------------------------------
*/

export async function getMatches() {
  const snapshot = await getDocs(matchesCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/*
|--------------------------------------------------------------------------
| Crear partido
|--------------------------------------------------------------------------
*/

export async function createMatch(match) {

  return await addDoc(matchesCollection, {

  category: match.category,
  group: match.group,
 phase: match.phase || "groups",

  homeTeamId: match.homeTeamId,
  homeTeamName: match.homeTeamName,

  awayTeamId: match.awayTeamId,
  awayTeamName: match.awayTeamName,

  refereeId: match.refereeId,
  refereeName: match.refereeName,

  courtId: match.courtId,
  courtName: match.courtName,

  time: match.time,

  homeScore: 0,
  awayScore: 0,
  homeFouls: 0,
awayFouls: 0,

  status: "pending",

  createdAt: serverTimestamp(),

});

}

/*
|--------------------------------------------------------------------------
| Editar partido
|--------------------------------------------------------------------------
*/

export async function updateMatch(id, match) {

  return await updateDoc(
    doc(db, "matches", id),
    match
  );

}

/*
|--------------------------------------------------------------------------
| Cambiar estado
|--------------------------------------------------------------------------
*/

export async function updateMatchStatus(id, status) {

  await updateDoc(

    doc(db, "matches", id),

    {
      status,
    }

  );

}

export async function updateMatchScore(id, homeScore, awayScore) {

  await updateDoc(

    doc(db, "matches", id),

    {
      homeScore,
      awayScore,
    }

  );

}
export async function updateMatchStats(
  id,
  homeScore,
  awayScore,
  homeFouls,
  awayFouls
) {
  return await updateDoc(
    doc(db, "matches", id),
    {
      homeScore,
      awayScore,
      homeFouls,
      awayFouls,
    }
  );
}



/*
|--------------------------------------------------------------------------
| Eliminar partido
|--------------------------------------------------------------------------
*/

export async function deleteMatch(id) {

  return await deleteDoc(
    doc(db, "matches", id)
  );

}
export function subscribeMatches(callback) {

  const q = query(
    collection(db, "matches"),
    orderBy("time")
  );

  return onSnapshot(q, (snapshot) => {

    const matches = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(matches);

  });

}
export async function getFinishedMatches() {

  const matches = await getMatches();

  return matches.filter(
    (match) => match.status === "finished"
  );

}
export async function startMatchWithCoinWinner(id, coinWinner) {
  return await updateDoc(
    doc(db, "matches", id),
    {
      status: "live",
      coinWinner,
    }
  );
}