import {collection, getDocs, query, where} from 'firebase/firestore';
import {db} from '../../config/firebaseInit';

export async function getEmployeeByIDPass(NIP, pass) {
  const citiesRef = collection(db, 'employess');
  const q = query(
    citiesRef,
    where('NIP', '==', NIP),
    where('Password', '==', pass),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}
