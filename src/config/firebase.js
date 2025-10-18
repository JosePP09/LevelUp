import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth"; //Importar auth


const firebaseConfig = {
  apiKey: "AIzaSyCzRZxZWREqvUp9_snuvgs33DaUnU6ry6Q",
  authDomain: "tiendalevelup-f5867.firebaseapp.com",
  projectId: "tiendalevelup-f5867",
  storageBucket: "tiendalevelup-f5867.appspot.com",
  messagingSenderId: "49561303717",
  appId: "1:49561303717:web:711b2ab36f8100a134eb4c",
  measurementId: "G-V7732K0H9Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

export const auth = getAuth(app); //Se exporta auth 

