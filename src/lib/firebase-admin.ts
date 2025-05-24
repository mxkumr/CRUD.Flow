
import admin from 'firebase-admin';

// Ensure this file is NOT imported on the client side.
// It's intended for use in Server Actions or API routes.

let firestore: admin.firestore.Firestore;
// let auth: admin.auth.Auth; // Uncomment if you need admin auth operations
// let storage: admin.storage.Storage; // Uncomment if you need admin storage operations

if (!admin.apps.length) {
  try {
    const serviceAccountKeyJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON;
    if (!serviceAccountKeyJson) {
      // This error is critical and should prevent further initialization steps.
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY_JSON environment variable is not set.');
    }
    // Attempt to parse the JSON. This can throw if the content is malformed.
    const serviceAccount = JSON.parse(serviceAccountKeyJson);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount), // This can throw if the cert object is invalid.
      // Add your databaseURL if you are using Realtime Database
      // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('CRITICAL: Firebase Admin SDK initialization failed. See details below.');
    console.error(error.message); // Log the specific error message
    // Re-throwing the error here will stop the application if Firebase setup is incorrect.
    // This provides a clearer root cause than the "default app does not exist" error.
    throw new Error(`Firebase Admin SDK initialization failed: ${error.message}. Please check your FIREBASE_SERVICE_ACCOUNT_KEY_JSON environment variable and ensure it's a valid JSON service account key.`);
  }
}

// If we've reached here, it means either:
// 1. admin.apps.length was already > 0 (already initialized)
// 2. The if block above executed and successfully initialized the app (no error was thrown)
// So, it should be safe to get the services.
firestore = admin.app().firestore(); // Using admin.app() to get the default initialized app.
// auth = admin.auth();
// storage = admin.storage();

export { firestore, admin as firebaseAdmin };
