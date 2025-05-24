
import admin from 'firebase-admin';

// Ensure this file is NOT imported on the client side.
// It's intended for use in Server Actions or API routes.

if (!admin.apps.length) {
  try {
    const serviceAccountKeyJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON;
    if (!serviceAccountKeyJson) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY_JSON environment variable is not set.');
    }
    const serviceAccount = JSON.parse(serviceAccountKeyJson);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // Add your databaseURL if you are using Realtime Database
      // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    // Depending on your error handling strategy, you might want to:
    // - Throw the error to stop the process if Firebase is critical.
    // - Log the error and continue if Firebase is optional or has fallbacks.
    // For this example, we'll log and potentially let operations fail gracefully.
  }
}

const firestore = admin.firestore();
// const auth = admin.auth(); // If you need admin auth operations
// const storage = admin.storage(); // If you need admin storage operations

export { firestore, admin as firebaseAdmin };
