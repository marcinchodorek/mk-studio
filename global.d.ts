export {};

declare global {
  interface Window {
    ENV: {
      FIREBASE_API_KEY: string;
      FIREBASE_APP_ID: string;
      FIREBASE_APP_AUTH_DOMAIN: string;
      FIREBASE_APP_PROJECT_ID: string;
      FIREBASE_APP_STORAGE_BUCKET: string;
      FIREBASE_APP_SENDER_ID: string;
    };
  }
}
