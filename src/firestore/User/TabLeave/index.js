import {collection, getDocs, query, where} from 'firebase/firestore';
import {db} from '../../../config/firebaseInit';

export async function getLeavesByID(employeeKey) {
  const citiesRef = collection(db, 'leaveshistory');
  const q = query(citiesRef, where('employeeKey', '==', employeeKey));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}
