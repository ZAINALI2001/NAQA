import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import {doc, firestore, getDoc} from '@/includes/FirebaseConfig';
import { useState, useEffect } from 'react';

// // const db = getFirestore(app);
// const todosCollection = collection(firestore, 'todos');
//
// const mediaCollection = collection(firestore, 'media');

// export async function fetchOnlyMyTodoList(uid: string) {
//   const myTodosQuery = query(todosCollection, where('ownerId', '==', uid));
//   return await getDocs(myTodosQuery);
// }
//
// export async function fetchItemsBasedOnType(
//   uid: string,
//   fileType: 'image' | 'video'
// ) {
//   const myMediaQuery = query(
//     mediaCollection,
//     where('ownerId', '==', uid),
//     where('fileType', '==', fileType)
//   );
//   return await getDocs(myMediaQuery);
// }

const fetchEmissionFactor = async (indicatorName: string | null): Promise<number> => {
  if (!indicatorName) {
    return 0;
  }
  try {
    const docRef = doc(firestore, 'Indecator', indicatorName); // Use "NAGA" collection
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data?.Emission_factor_value || 0; // Use "Emission_factor_value" field
    } else {
      console.log(`No emission factor found for ${indicatorName}`);
      return 0;
    }
  } catch (error) {
    console.error('Error fetching emission factor:', error);
    return 0;
  }
};




export function useEmissionFactors(category: string) {
  const [factors, setFactors] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFactors = async () => {
      try {
        const q = query(collection(db, 'Emission_Factors'), where('Category', '==', category));
        const querySnapshot = await getDocs(q);

        const fetchedFactors: { [key: string]: number } = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedFactors[data.Indicator_Name] = parseFloat(data.Emission_factor_value);
        });

        setFactors(fetchedFactors);
      } catch (error) {
        console.error('Error fetching emission factors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFactors();
  }, [category]);

  return { factors, loading };
}