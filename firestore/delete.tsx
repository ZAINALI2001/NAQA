import { collection, doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/includes/FirebaseConfig';

// const db = getFirestore(app);
const todosCollection = collection(firestore, 'todos');

export async function deleteMyTodoItem(docId: string) {
  const docRef = doc(todosCollection, docId);
  return await deleteDoc(docRef);
}
