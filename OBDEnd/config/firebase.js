import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

const firebaseApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: applicationDefault(),
        databaseURL:
          "https://mechaniq-3a0f2-default-rtdb.firebaseio.com",
        projectId: "mechaniq-3a0f2",
      });

export const firebaseDb = getDatabase(firebaseApp);
export default firebaseApp;