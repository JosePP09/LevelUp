import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCzRZxZWREqvUp9_snuvgs33DaUnU6ry6Q",
  authDomain: "tiendalevelup-f5867.firebaseapp.com",
  projectId: "tiendalevelup-f5867",
  storageBucket: "tiendalevelup-f5867.firebasestorage.app",
  messagingSenderId: "49561303717",
  appId: "1:49561303717:web:711b2ab36f8100a134eb4c",
  measurementId: "G-V7732K0H9Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);