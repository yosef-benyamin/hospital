import {collection, getDocs, query, where} from 'firebase/firestore';
import {db} from '../../../config/firebaseInit';

export async function getLeavesByRoom(Room) {
  const citiesRef = collection(db, 'leaveshistory');
  const q = query(citiesRef, where('Room', '==', Room));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}
