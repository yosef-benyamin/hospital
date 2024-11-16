import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {db} from '../../config/firebaseInit';

export async function getEmployeeByID(NIP) {
  const citiesRef = collection(db, 'employees');
  const q = query(citiesRef, where('NIP', '==', NIP));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

export async function addLeave(dataLeave) {
  const docRef = await addDoc(collection(db, 'leaves'), dataLeave);
  return docRef;
}

export async function updateLeave(id, dataLeave) {
  const docRef = doc(db, 'leaves', id);
  await updateDoc(docRef, dataLeave);
}

export async function approveLeaveEmp(
  employeeId,
  onLeave,
  days,
  dayRemain,
  approve,
) {
  let day = 0;

  if (approve === 'approved') {
    day = dayRemain - days;
  } else {
    day = dayRemain;
  }
  const docRef = doc(db, 'employees', employeeId);
  const field = `Leaves.${onLeave}`;
  await updateDoc(docRef, {[field]: day});
}

export async function updatePassword(employeeId, Password) {
  const docRef = doc(db, 'employees', employeeId);
  // Melakukan update ke database
  await updateDoc(docRef, {Password});
}
