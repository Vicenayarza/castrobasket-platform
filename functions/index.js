const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

exports.createUser = onCall(
  {
    region: "us-central1",
    cors: true,
  },
  async (request) => {
    const data = request.data;

    if (
      !data.name ||
      !data.username ||
      !data.email ||
      !data.password ||
      !data.role
    ) {
      throw new HttpsError(
        "invalid-argument",
        "Faltan datos del usuario."
      );
    }

    try {
      const userRecord = await admin.auth().createUser({
        email: data.email,
        password: data.password,
        displayName: data.name,
      });

      await db.collection("users").doc(userRecord.uid).set({
        uid: userRecord.uid,
        name: data.name,
        username: data.username,
        email: data.email,
        role: data.role,
        active: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        uid: userRecord.uid,
      };
    } catch (error) {
      throw new HttpsError(
        "internal",
        error.message
      );
    }
  }
);