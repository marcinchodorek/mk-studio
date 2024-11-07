import admin, { ServiceAccount } from "firebase-admin";

console.log(
  "process.env.FIREBASE_ADMIN_PRIVATE_KEY",
  process.env.FIREBASE_ADMIN_PRIVATE_KEY,
);

const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
} as ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth };
