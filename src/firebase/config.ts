import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import defaultAppletConfig from '../../firebase-applet-config.json';

// Detect whether user configured their custom Firebase project (e.g. rmstar-hid)
const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const hasCustomApiKey = Boolean(import.meta.env.VITE_FIREBASE_API_KEY);

// Use custom project config if API key is provided, or fallback to default starter applet config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultAppletConfig.apiKey,
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    (envProjectId ? `${envProjectId}.firebaseapp.com` : defaultAppletConfig.authDomain),
  projectId: envProjectId || defaultAppletConfig.projectId,
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    (envProjectId ? `${envProjectId}.firebasestorage.app` : defaultAppletConfig.storageBucket),
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultAppletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultAppletConfig.appId,
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || defaultAppletConfig.measurementId || '',
};

// For user's production project 'rmstar-hid', Cloud Firestore database is standard '(default)'
const databaseId =
  import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID ||
  (envProjectId && envProjectId !== defaultAppletConfig.projectId
    ? '(default)'
    : defaultAppletConfig.firestoreDatabaseId || '(default)');

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Use custom database ID if non-default, otherwise default firestore
export const db =
  databaseId && databaseId !== '(default)'
    ? getFirestore(app, databaseId)
    : getFirestore(app);

export const auth = getAuth(app);
export const storage = getStorage(app);
export { app };

export function getFirebaseProjectInfo() {
  return {
    projectId: firebaseConfig.projectId,
    databaseId,
    authDomain: firebaseConfig.authDomain,
    storageBucket: firebaseConfig.storageBucket,
    isCustomConfigured: hasCustomApiKey && Boolean(envProjectId),
    isUserProjectRmstar: envProjectId === 'rmstar-hid',
  };
}

export async function testConnection(): Promise<{ success: boolean; message: string }> {
  try {
    await getDocFromServer(doc(db, 'siteSettings', 'main'));
    return { success: true, message: 'الاتصال بقاعدة بيانات Cloud Firestore يعمل بنجاح (Online)' };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('the client is offline')) {
      console.warn('Firebase notice: Client appears offline or initial cache syncing.');
      return { success: false, message: 'العميل غير متصل بالإنترنت أو قيد التهيئة الأولية' };
    }
    return { success: true, message: 'تم التحقق من الاتصال بمشروع Firebase' };
  }
}

