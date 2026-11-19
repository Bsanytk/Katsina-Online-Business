import admin from 'firebase-admin';

let app;

function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.apps[0];
  }

  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountString) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set.');
    }

    const serviceAccount = JSON.parse(serviceAccountString);

    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://katsina-online-business.firebaseio.com`,
    });

    return app;
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    return null;
  }
}

app = initializeFirebaseAdmin();

export const adminApp = app;
export const db = app ? admin.firestore() : null;