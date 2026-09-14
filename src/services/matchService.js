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
| Obtener todos los partidos
|--------------------------------------------------------------------------
*/

export async function getMatches() {
  const snapshot = await getDocs(matchesCollection);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
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

    group: match.group || "",
    phase: match.phase || "groups",
    playoffOrder: match.playoffOrder ?? null,

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

    coinWinner: null,

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
| Cambiar estado del partido
|--------------------------------------------------------------------------
*/

export async function updateMatchStatus(id, status) {
  return await updateDoc(
    doc(db, "matches", id),
    {
      status,
    }
  );
}

/*
|--------------------------------------------------------------------------
| Actualizar marcador
|--------------------------------------------------------------------------
*/

export async function updateMatchScore(
  id,
  homeScore,
  awayScore
) {
  return await updateDoc(
    doc(db, "matches", id),
    {
      homeScore: Number(homeScore) || 0,
      awayScore: Number(awayScore) || 0,
    }
  );
}

/*
|--------------------------------------------------------------------------
| Actualizar marcador y faltas
|--------------------------------------------------------------------------
*/

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
      homeScore: Number(homeScore) || 0,
      awayScore: Number(awayScore) || 0,

      homeFouls: Number(homeFouls) || 0,
      awayFouls: Number(awayFouls) || 0,
    }
  );
}

/*
|--------------------------------------------------------------------------
| Iniciar partido guardando el ganador del sorteo
|--------------------------------------------------------------------------
*/

export async function startMatchWithCoinWinner(
  id,
  coinWinner
) {
  return await updateDoc(
    doc(db, "matches", id),
    {
      status: "live",
      coinWinner,
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

/*
|--------------------------------------------------------------------------
| Escuchar partidos en tiempo real
|--------------------------------------------------------------------------
*/

export function subscribeMatches(callback, onError) {
  const matchesQuery = query(
    matchesCollection,
    orderBy("time")
  );

  return onSnapshot(
    matchesQuery,
    (snapshot) => {
      const matches = snapshot.docs.map(
        (document) => ({
          id: document.id,
          ...document.data(),
        })
      );

      callback(matches);
    },
    (error) => {
      console.error(
        "Error escuchando partidos en tiempo real:",
        error
      );

      if (onError) {
        onError(error);
      }
    }
  );
}

/*
|--------------------------------------------------------------------------
| Obtener partidos finalizados
|--------------------------------------------------------------------------
*/

export async function getFinishedMatches() {
  const matches = await getMatches();

  return matches.filter(
    (match) => match.status === "finished"
  );
}