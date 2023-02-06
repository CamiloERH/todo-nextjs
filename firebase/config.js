import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCrmoApMdf4Uc0BMoPmnG4jyH5C6YJkJVk",
    authDomain: "todo-next-119d8.firebaseapp.com",
    projectId: "todo-next-119d8",
    storageBucket: "todo-next-119d8.appspot.com",
    messagingSenderId: "787118285524",
    appId: "1:787118285524:web:4b7caeed1ae1e0a7c09141"
  };

export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseDB = getFirestore( FirebaseApp );