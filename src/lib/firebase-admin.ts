import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const webApiKey = process.env.FIREBASE_WEB_API_KEY;

export const hasFirebaseAdminConfig = Boolean(projectId && clientEmail && privateKey);
export const hasFirebaseRuntimeConfig = Boolean(
  (projectId && clientEmail && privateKey) || (projectId && webApiKey),
);

export const getAdminDb = () => {
  if (!hasFirebaseAdminConfig) {
    return null;
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  return getFirestore();
};
