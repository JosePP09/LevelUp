import {db} from "../config/firebase";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query, where } from "firebase/firestore";

export async function addUser(user) {
    return await addDoc(collection(db, "usuario"), user);
    
}

export async function getProduct() {
    const snap = await getDocs(collection(db, "producto"));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}