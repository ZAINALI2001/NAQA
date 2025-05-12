import {
  addDoc,
  collection,
} from 'firebase/firestore';
import { firestore } from '@/includes/FirebaseConfig';
// import {util} from "protobufjs";
// import float = util.float;

interface AddFootprintInterface {
  Calculated_value: string;
  User_ID: string;
}

// const db = getFirestore(app);
const Carbon_footprintCollection = collection(firestore, 'Carbon_footprint');

export async function addFootprint(data: AddFootprintInterface) {
  const dbData = {
    ...data,
  };
  return await addDoc(Carbon_footprintCollection, dbData);
}
