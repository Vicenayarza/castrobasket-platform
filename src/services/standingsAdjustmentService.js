import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

const adjustmentsCollection = collection(
  db,
  "standingsAdjustments"
);

function normalizeGroup(group) {
  if (!group) return "Único";

  const value = String(group).trim();

  return value.toLowerCase() === "unico"
    ? "Único"
    : value;
}

function createAdjustmentId(teamId, category, group) {
  const safeCategory = String(category)
    .replaceAll("/", "-")
    .replaceAll(" ", "_");

  const safeGroup = normalizeGroup(group)
    .replaceAll("/", "-")
    .replaceAll(" ", "_");

  return `${teamId}_${safeCategory}_${safeGroup}`;
}

export async function getStandingsAdjustments() {
  const snapshot = await getDocs(adjustmentsCollection);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}

export async function saveStandingsAdjustment({
  teamId,
  teamName,
  category,
  group,
  playedAdjustment = 0,
  winsAdjustment = 0,
  lossesAdjustment = 0,
  pointsForAdjustment = 0,
  pointsAgainstAdjustment = 0,
  pointsAdjustment = 0,
  note = "",
}) {
  const normalizedGroup = normalizeGroup(group);

  const id = createAdjustmentId(
    teamId,
    category,
    normalizedGroup
  );

  await setDoc(
    doc(db, "standingsAdjustments", id),
    {
      teamId,
      teamName,
      category,
      group: normalizedGroup,

      playedAdjustment:
        Number(playedAdjustment) || 0,

      winsAdjustment:
        Number(winsAdjustment) || 0,

      lossesAdjustment:
        Number(lossesAdjustment) || 0,

      pointsForAdjustment:
        Number(pointsForAdjustment) || 0,

      pointsAgainstAdjustment:
        Number(pointsAgainstAdjustment) || 0,

      pointsAdjustment:
        Number(pointsAdjustment) || 0,

      note: String(note || "").trim(),

      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}

export async function deleteStandingsAdjustment(
  teamId,
  category,
  group
) {
  const id = createAdjustmentId(
    teamId,
    category,
    group
  );

  await deleteDoc(
    doc(db, "standingsAdjustments", id)
  );
}