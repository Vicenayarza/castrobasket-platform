import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

const matchesCollection = collection(db, "matches");

export async function getRefereeMatches(refereeId) {

  const q = query(

    matchesCollection,

    where("referee", "==", refereeId)

  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({

    id: doc.id,

    ...doc.data(),

  }));

}

export async function startMatch(matchId) {

  return updateDoc(

    doc(db, "matches", matchId),

    {

      status: "live",

    }

  );

}

export async function finishMatch(matchId) {

  return updateDoc(

    doc(db, "matches", matchId),

    {

      status: "finished",

    }

  );

}

export async function addHomePoint(matchId) {

  return updateDoc(

    doc(db, "matches", matchId),

    {

      homeScore: increment(1),

    }

  );

}

export async function removeHomePoint(matchId) {

  return updateDoc(

    doc(db, "matches", matchId),

    {

      homeScore: increment(-1),

    }

  );

}

export async function addAwayPoint(matchId) {

  return updateDoc(

    doc(db, "matches", matchId),

    {

      awayScore: increment(1),

    }

  );

}

export async function removeAwayPoint(matchId) {

  return updateDoc(

    doc(db, "matches", matchId),

    {

      awayScore: increment(-1),

    }

  );

}