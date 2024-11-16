import {collection, getDocs, query, where} from 'firebase/firestore';
import {db} from '../../config/firebaseInit';

export async function getEmployeeByIDPass(id, pass) {
  const citiesRef = collection(db, 'employees');
  const q = query(
    citiesRef,
    where('id', '==', id),
    where('Password', '==', pass),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}
