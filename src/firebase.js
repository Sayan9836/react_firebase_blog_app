import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
import {getAuth, indexedDBLocalPersistence} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyDGZZuDWHJZsDvOE_RWWCz7ZECwObokBFs",
  authDomain: "react-blogs-app-3fa88.firebaseapp.com",
  projectId: "react-blogs-app-3fa88",
  storageBucket: "react-blogs-app-3fa88.appspot.com",
  messagingSenderId: "982414047434",
  appId: "1:982414047434:web:202c09faf915a03faa9c33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db=getFirestore(app);
const auth=getAuth(app,{ persistence : indexedDBLocalPersistence });
const storage=getStorage(app);

export {auth,db,storage}
