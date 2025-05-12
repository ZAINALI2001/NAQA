import { collection, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/includes/FirebaseConfig';

// const db = getFirestore(app);
const todosCollection = collection(firestore, 'todos');

export async function updateTodoItem(docId: string, isCompleted: boolean) {
  const docRef = doc(todosCollection, docId);
  return await updateDoc(docRef, { isCompleted });
}
