import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtkAWg78Ojhv2nhqZru0e0SZii_EW8L2Y",
  authDomain: "todo-next-dev.firebaseapp.com",
  projectId: "todo-next-dev",
  storageBucket: "todo-next-dev.appspot.com",
  messagingSenderId: "527443206417",
  appId: "1:527443206417:web:e583842cc15a30d0926cb0"
};

export const FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const FirebaseDB = getFirestore(FirebaseApp);
export const storage = getStorage(FirebaseApp);

