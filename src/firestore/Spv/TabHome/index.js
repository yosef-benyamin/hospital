import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import {db} from '../../../config/firebaseInit';

export async function generateMonthlySchedule(RoomId, month, year) {
  // Ambil data karyawan dari Firestore berdasarkan Room
  const employeesRef = collection(db, 'employess');
  const q = query(employeesRef, where('Room', '==', RoomId));
  const employeesSnapshot = await getDocs(q);
  const employees = employeesSnapshot.docs.map(emp => ({
    id: emp.id,
    ...emp.data(),
  }));

  // Fungsi untuk mengambil karyawan secara acak
  const takeEmployeesRandomly = emp => {
    const selectedEmployees = [];
    const availableEmployees = [...emp]; // Salin array untuk dimodifikasi

    while (availableEmployees.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableEmployees.length);
      const employee = availableEmployees[randomIndex];

      selectedEmployees.push(employee);
      availableEmployees.splice(randomIndex, 1); // Hapus karyawan dari daftar yang tersedia
    }

    return selectedEmployees;
  };

  const schedule = {};
  const shifts = [
    'pagi',
    'pagi',
    'siang',
    'siang',
    'malam',
    'malam',
    'libur',
    'libur',
  ];

  // Hitung jumlah hari dalam bulan yang ditentukan
  const totalDays = new Date(year, month, 0).getDate();
  const randomEmployees = takeEmployeesRandomly(employees); // Ambil karyawan secara acak

  // Atur penjadwalan
  for (let day = 0; day < totalDays; day++) {
    let daySchedule = {
      shift: {
        pagi: {},
        siang: {},
        malam: {},
        libur: {},
      },
    };

    randomEmployees.forEach((employee, index) => {
      // Ganti shift setiap 2 hari
      const shiftIndex = (day + Math.floor(index / 2)) % shifts.length;
      const shift = shifts[shiftIndex];

      // Tambahkan employee.NIP ke dalam shift yang sesuai
      daySchedule.shift[shift][employee.NIP] = employee.Name;
    });

    schedule[day] = {day: day + 1, shift: daySchedule.shift};
  }
  // Simpan jadwal ke Firestore
  return schedule;
}

export async function saveScheduleToDB(schedule, RoomId, month, year) {
  const scheduleRef = doc(db, 'schedules', RoomId);
  const date = `${year}-${month}`;
  await setDoc(scheduleRef, {[date]: schedule}, {merge: true});
}

export async function getSchedules(Room, date) {
  try {
    const docRef = doc(db, 'schedules', Room);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // Mengambil data spesifik untuk 2024-11
      const data = docSnap.data()[date];
      return data;
    } else {
      console.log('No such document!');
    }
  } catch (error) {
    console.error('Error getting document:', error);
  }
}
