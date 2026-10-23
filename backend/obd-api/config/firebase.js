import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

const firebaseApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: applicationDefault(),
        databaseURL: process.env.FIREBASE_DATABASE_URL || "https://mechaniq-3a0f2-default-rtdb.firebaseio.com",
        projectId: process.env.GOOGLE_CLOUD_PROJECT || "mechaniq-3a0f2",
      });

export const firebaseDb = getDatabase(firebaseApp);
export default firebaseApp;
