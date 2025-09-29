import{db} from "../config/firebase"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";

export async function addUser(user) {
    return await addDoc(collection(db,"usuario")),{...user,createAt: new Date()};
}
export async function getProduct() {
    const snap = await getDocs(collection(db,"productos"));
    return snap.docs.map(d =>({id:d.id,...d.data()}));
}