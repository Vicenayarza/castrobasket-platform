import { useEffect, useState } from "react";

import { doc, getDoc } from "firebase/firestore";

import { db } from "@/firebase/firebase";

export default function TeamName({ teamId }) {

  const [name, setName] = useState("...");

  useEffect(() => {

    async function load() {

      if (!teamId) return;

      const snap = await getDoc(doc(db, "teams", teamId));

      if (snap.exists()) {

        setName(snap.data().name);

      }

    }

    load();

  }, [teamId]);

  return name;

}