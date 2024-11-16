import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {db} from '../../config/firebaseInit';

export async function getEmployeeByID(NIP) {
  const citiesRef = collection(db, 'employess');
  const q = query(citiesRef, where('NIP', '==', NIP));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

export async function getSpvByDept(Room) {
  const citiesRef = collection(db, 'employess');
  const q = query(
    citiesRef,
    where('Room', '==', Room),
    where('Role', '==', 'Kepala Ruangan'),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

export async function addLeave(dataLeave) {
  const docRef = await addDoc(collection(db, 'leaveshistory'), dataLeave);
  return docRef;
}

export async function updateLeave(id, dataLeave) {
  const docRef = doc(db, 'leaveshistory', id);
  await updateDoc(docRef, dataLeave);
}

export async function approveLeaveEmp(employeeId, onLeave, days, approve) {
  const docRef = doc(db, 'employess', employeeId);
  const employeeSnap = await getDoc(docRef);

  let dayRemain = 0;
  if (employeeSnap.exists()) {
    dayRemain = Number(employeeSnap.data().Leaves[onLeave]);
  } else {
    console.log('No such document!');
  }
  let day = 0;

  if (approve === 'approved') {
    day = dayRemain - days;
  } else {
    day = dayRemain;
  }
  const field = `Leaves.${onLeave}`;
  await updateDoc(docRef, {[field]: day});
}
