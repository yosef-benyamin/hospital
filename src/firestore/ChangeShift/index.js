import {
  addDoc,
  collection,
  deleteField,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {db} from '../../config/firebaseInit';

export async function getEmployeeByDept(Room) {
  const citiesRef = collection(db, 'employess');
  const q = query(citiesRef, where('Room', '==', Room));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

export async function changeShiftByID(
  emp,
  Room,
  field,
  yearMonth,
  shiftChange,
) {
  const {Name, NIP} = emp;
  const {day, shift} = field;
  const dayIndex = day - 1;
  const scheduleRef = doc(db, 'schedules', Room);
  await setDoc(
    scheduleRef,
    {
      [yearMonth]: {[dayIndex]: {shift: {[shiftChange]: {[NIP]: Name}}}},
    },
    {merge: true},
  );
  await updateDoc(scheduleRef, {
    [`${yearMonth}.${dayIndex}.shift.${shift}.${NIP}`]: deleteField(),
  });
}

export async function getChangeShift(Room) {
  const citiesRef = collection(db, 'changeShift');
  const q = query(citiesRef, where('Room', '==', Room));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

export async function addChangeShift(dataLeave) {
  const docRef = await addDoc(collection(db, 'changeShift'), dataLeave);
  return docRef;
}

export async function updateChangeShift(id, dataLeave) {
  const docRef = doc(db, 'changeShift', id);
  await updateDoc(docRef, dataLeave);
}
