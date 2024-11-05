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

export async function getEmployeeByDept(department) {
  const citiesRef = collection(db, 'employees');
  const q = query(citiesRef, where('department', '==', department));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

export async function changeShiftByID(
  emp,
  department,
  field,
  yearMonth,
  shiftChange,
) {
  const {name, id} = emp;
  const {day, shift} = field;
  const dayIndex = day - 1;
  const scheduleRef = doc(db, 'schedules', department);
  await setDoc(
    scheduleRef,
    {
      [yearMonth]: {[dayIndex]: {shift: {[shiftChange]: {[id]: name}}}},
    },
    {merge: true},
  );
  await updateDoc(scheduleRef, {
    [`${yearMonth}.${dayIndex}.shift.${shift}.${id}`]: deleteField(),
  });
}

export async function getChangeShift(department) {
  const citiesRef = collection(db, 'changeShift');
  const q = query(citiesRef, where('department', '==', department));
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
