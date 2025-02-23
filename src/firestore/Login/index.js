import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
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

export async function getCountLeave(room) {
  const leavesRef = collection(db, 'leaveshistory');
  const q = query(
    leavesRef,
    where('approval', '==', 'waiting'),
    where('Room', '==', room),
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
}

export async function updateLeaveNewEmp(employeeId, Leaves) {
  const docRef = doc(db, 'employess', employeeId);
  // Melakukan update ke database
  await updateDoc(docRef, {Leaves});
}
