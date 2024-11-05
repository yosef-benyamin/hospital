import {collection, getDocs, query, where} from 'firebase/firestore';
import {db} from '../../../config/firebaseInit';

export async function getLeavesByRoom(department) {
  const citiesRef = collection(db, 'leaves');
  const q = query(citiesRef, where('department', '==', department));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}
