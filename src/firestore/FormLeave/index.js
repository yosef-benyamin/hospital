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

export async function getEmployeeByID(id) {
  const citiesRef = collection(db, 'employees');
  const q = query(citiesRef, where('id', '==', id));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

export async function getSpvByDept(Room) {
  const citiesRef = collection(db, 'employees');
  const q = query(
    citiesRef,
    where('Room', '==', Room),
    where('role', '==', 'spv'),
  );
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

export async function approveLeaveEmp(employeeId, onLeave, days, approve) {
  const docRef = doc(db, 'employees', employeeId);
  const employeeSnap = await getDoc(docRef);

  let dayRemain = 0;
  if (employeeSnap.exists()) {
    dayRemain = Number(employeeSnap.data().leave[onLeave]);
  } else {
    console.log('No such document!');
  }
  let day = 0;

  if (approve === 'approved') {
    day = dayRemain - days;
  } else {
    day = dayRemain;
  }
  const field = `leave.${onLeave}`;
  await updateDoc(docRef, {[field]: day});
}
