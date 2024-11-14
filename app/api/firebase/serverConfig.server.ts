import admin, { ServiceAccount } from "firebase-admin";

// const serviceAccount = {
//   projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
//   clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
//   privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
// } as ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert("app/mk-studio.json"),
    databaseURL: `https://${process.env.FIREBASE_ADMIN_PROJECT_ID}.firebaseio.com/`,
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth };
