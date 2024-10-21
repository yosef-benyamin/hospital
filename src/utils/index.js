import {
  child,
  equalTo,
  get,
  getDatabase,
  orderByChild,
  query,
  ref,
  set,
  update,
} from 'firebase/database';

export async function getEmployee(employeeId) {
  const db = getDatabase();
  // const employeeRef = ref(db, 'employees');

  const employeeRef = query(
    ref(db, 'employees'),
    orderByChild('id'),
    equalTo(employeeId),
  );

  try {
    const snapshot = await get(employeeRef);
    if (snapshot.exists()) {
      return snapshot;
    } else {
      console.log('No Data Available');
    }
  } catch (error) {
    console.error('Error mengambil karyawan:', error);
    throw error;
  }
}

export async function getLeave(employeeId) {
  const db = getDatabase();
  // const employeeRef = ref(db, 'employees');
  const leavesRef = query(ref(db, 'leaves'), orderByChild(employeeId));
  try {
    const snapshot = await get(leavesRef);
    if (snapshot.exists()) {
      return snapshot;
    } else {
      console.log('No Data Available');
    }
  } catch (error) {
    console.error('Error mengambil karyawan:', error);
    throw error;
  }
}

// Fungsi untuk menjalankan proses pembuatan jadwal dan pembaruan data karyawan
export async function generateAndUpdateSchedule(year, month, employees) {
  try {
    // Membuat jadwal bulanan
    const monthlySchedule = generateMonthlySchedule(year, month, employees);

    // Menyimpan jadwal ke Firebase
    // await saveScheduleToFirebase(monthlySchedule);
    console.log('Jadwal berhasil disimpan ke Firebase');

    // Memperbarui shifts karyawan
    // await updateEmployeeShifts(monthlySchedule, year, month);
    console.log('Data shifts karyawan berhasil diperbarui');

    return monthlySchedule;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    throw error;
  }
}
// Fungsi untuk mendapatkan jadwal bulanan karyawan
export async function getEmployeeMonthlySchedule(employeeId, year, month) {
  const db = getDatabase();
  const employeeRef = ref(db, `employees/${employeeId}/shifts`);

  try {
    const snapshot = await get(employeeRef);
    if (snapshot.exists()) {
      const allShifts = snapshot.val();
      const monthlyShifts = Object.entries(allShifts).reduce(
        (acc, [date, shift]) => {
          if (date.startsWith(`${year}-${String(month).padStart(2, '0')}`)) {
            acc[date] = shift;
          }
          return acc;
        },
        {},
      );

      return monthlyShifts;
    } else {
      console.log('Tidak ada jadwal untuk karyawan ini');
      return null;
    }
  } catch (error) {
    console.error('Error mengambil jadwal karyawan:', error);
    throw error;
  }
}

// Fungsi pendukung

function initializeDaySchedule() {
  return {
    Radiologi: {pagi: {}, siang: {}, malam: {}},
    UGD: {pagi: {}, siang: {}, malam: {}},
    ICU: {pagi: {}, siang: {}, malam: {}},
    Rehabilitasi: {pagi: {}, siang: {}, malam: {}},
  };
}

function assignShift(schedule, date, employee, shift) {
  if (shift === 'libur') {
    // Tidak perlu menambahkan ke jadwal jika libur
    return;
  }
  schedule[date][employee.department][shift][employee.id] = employee.name;
}

function determineShift(lastShift) {
  const shifts = ['pagi', 'siang', 'malam'];
  if (!lastShift || lastShift === 'libur') {
    return shifts[Math.floor(Math.random() * shifts.length)];
  }
  const currentIndex = shifts.indexOf(lastShift);
  return shifts[(currentIndex + 1) % shifts.length];
}

function canAssignToShift(schedule, date, department, shift) {
  const maxEmployeesPerShift = {
    Radiologi: 5,
    UGD: 5,
    ICU: 5,
    Rehabilitasi: 5,
  };

  return (
    Object.keys(schedule[date][department][shift]).length <
    maxEmployeesPerShift[department]
  );
}

function findAlternativeShift(schedule, date, department) {
  const shifts = ['pagi', 'siang', 'malam'];
  return shifts.find(shift =>
    canAssignToShift(schedule, date, department, shift),
  );
}

// Fungsi untuk memperbarui shifts karyawan berdasarkan jadwal bulanan (diperbaiki)
function updateEmployeeShifts(monthlySchedule, year, month) {
  const db = getDatabase();
  const updates = {};

  // Iterasi melalui setiap tanggal dalam jadwal bulanan
  Object.entries(monthlySchedule).forEach(([date, daySchedule]) => {
    // Iterasi melalui setiap departemen
    Object.entries(daySchedule).forEach(([department, departmentSchedule]) => {
      // Iterasi melalui setiap shift
      Object.entries(departmentSchedule).forEach(([shift, employees]) => {
        // Iterasi melalui setiap karyawan dalam shift
        Object.keys(employees).forEach(employeeId => {
          // Langsung update untuk tanggal spesifik
          updates[`employees/${employeeId}/shifts/${date}`] = shift;
        });
      });
    });
  });

  // Melakukan update ke database
  return update(ref(db), updates);
}

// Fungsi untuk memperbarui cuti karyawan berdasarkan jadwal bulanan
export function updateEmployeeLeave(employeeId, date, shift) {
  const db = getDatabase();
  const updates = {};

  // Update shift karyawan untuk tanggal tertentu
  updates[`employees/${employeeId}/shifts/${date}`] = shift;

  // Melakukan update ke database
  return update(ref(db), updates);
}

// Fungsi untuk memperbarui cuti karyawan berdasarkan jadwal bulanan
export function updateLeaveDB(employeeId, date, dataLeave) {
  const db = getDatabase();
  const scheduleRef = ref(db, `leaves/${date}/${employeeId}`);

  // Melakukan update ke database
  return set(scheduleRef, dataLeave);
}

// Fungsi untuk memperbarui cuti karyawan berdasarkan jadwal bulanan
export function approveLeaveEmp(employeeId, onLeave, days, dayRemain, approve) {
  const db = getDatabase();
  let day = 0;

  if (approve === 'approved') {
    day = dayRemain - days;
  } else {
    day = dayRemain;
  }
  const scheduleRef = ref(db, `employees/${employeeId}/leave/${onLeave}`);

  // Melakukan update ke database
  return set(scheduleRef, day);
}

export function resetLeave(employee) {
  const db = getDatabase();
  const updates = {};

  const data = {
    annual: 12,
    sick: 30,
    urgent: 1,
    holiday: 3,
    maternity: 2,
    unpaid: 1,
  };

  Object.entries(employee).map(([employeeId, value]) => {
    // Update shift karyawan untuk tanggal tertentu
    updates[`employees/${employeeId}/leave/`] = data;
  });

  // Melakukan update ke database
  return update(ref(db), updates);
}

// Fungsi untuk menghasilkan hash dari string
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}

function initializeEmployeeShiftCounts(employees) {
  const counts = {};
  employees.forEach(emp => {
    counts[emp.id] = {
      pagi: 0,
      siang: 0,
      malam: 0,
      libur: 0,
    };
  });
  return counts;
}

function groupEmployeesByDepartment(employees) {
  return employees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = [];
    }
    acc[emp.department].push(emp);
    return acc;
  }, {});
}

function getTotalShifts(counts) {
  return counts.pagi + counts.siang + counts.malam;
}

function canWorkOnDate(employee, shiftCounts, date) {
  const consecutiveWorkDays = getConsecutiveWorkDays(employee, shiftCounts);
  return consecutiveWorkDays < 5;
}

function getNextShiftForEmployee(employee, shiftCounts, shifts, seed) {
  const counts = shiftCounts[employee.id];

  // Urutkan shift berdasarkan jumlah dan seed
  return shifts.sort((a, b) => {
    if (counts[a] !== counts[b]) {
      return counts[a] - counts[b];
    }
    // Gunakan seed untuk variasi
    const seedA = hashCode(a + seed);
    const seedB = hashCode(b + seed);
    return seedA - seedB;
  })[0];
}

function getConsecutiveWorkDays(employee, shiftCounts) {
  return 0; // Implementasi sederhana
}

// Fungsi untuk menyimpan jadwal ke Firebase
export function saveScheduleToFirebase(schedule) {
  const db = getDatabase();
  const scheduleRef = ref(db, 'schedules');
  return set(scheduleRef, schedule);
}

// Fungsi utama untuk menghasilkan jadwal bulanan
function generateMonthlySchedule(year, month, employees) {
  const timestamp = Date.now();

  // Sort employees dengan mempertimbangkan timestamp
  const sortedEmployees = [...Object.values(employees)].sort((a, b) => {
    const seedA = hashCode(a.id + timestamp);
    const seedB = hashCode(b.id + timestamp);
    return seedA - seedB;
  });

  const daysInMonth = new Date(year, month, 0).getDate();
  const schedule = {};
  const employeeShiftCounts = initializeEmployeeShiftCounts(sortedEmployees);

  // Inisialisasi jadwal kosong untuk setiap hari dalam bulan
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(
      day,
    ).padStart(2, '0')}`;
    schedule[date] = initializeDaySchedule();
  }

  // Mengatur jadwal berdasarkan departemen
  const departmentEmployees = groupEmployeesByDepartment(sortedEmployees);
  const sortedDepartments = Object.keys(departmentEmployees).sort();

  // Distribusi awal untuk hari pertama dan kedua
  const firstDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const secondDate = `${year}-${String(month).padStart(2, '0')}-02`;

  sortedDepartments.forEach(department => {
    const deptEmployees = departmentEmployees[department];
    distributeInitialShifts(
      schedule,
      deptEmployees,
      department,
      firstDate,
      secondDate,
      employeeShiftCounts,
      timestamp,
    );
  });

  // Lanjutkan dengan sisa hari dalam bulan
  sortedDepartments.forEach(department => {
    assignDepartmentSchedule(
      schedule,
      departmentEmployees[department],
      department,
      year,
      month,
      employeeShiftCounts,
      timestamp,
    );
  });

  return schedule;
}

function distributeInitialShifts(
  schedule,
  employees,
  department,
  firstDate,
  secondDate,
  shiftCounts,
  timestamp,
) {
  const shifts = ['pagi', 'siang', 'malam'];
  const minEmployeesPerShift = Math.max(
    1,
    Math.floor(employees.length / shifts.length),
  );

  // Bagi karyawan menjadi tiga grup untuk tiga shift
  const shuffledEmployees = [...employees].sort((a, b) => {
    const seedA = hashCode(a.id + timestamp);
    const seedB = hashCode(b.id + timestamp);
    return seedA - seedB;
  });

  // Distribusi untuk hari pertama
  shifts.forEach((shift, index) => {
    const startIdx = index * minEmployeesPerShift;
    const endIdx = Math.min(
      startIdx + minEmployeesPerShift,
      shuffledEmployees.length,
    );

    for (let i = startIdx; i < endIdx; i++) {
      if (canAssignToShift(schedule, firstDate, department, shift)) {
        assignShift(schedule, firstDate, shuffledEmployees[i], shift);
        shiftCounts[shuffledEmployees[i].id][shift]++;
      }
    }
  });

  // Distribusi untuk hari kedua dengan rotasi
  shifts.forEach((shift, index) => {
    const startIdx = ((index + 1) % shifts.length) * minEmployeesPerShift;
    const endIdx = Math.min(
      startIdx + minEmployeesPerShift,
      shuffledEmployees.length,
    );

    for (let i = startIdx; i < endIdx; i++) {
      if (canAssignToShift(schedule, secondDate, department, shift)) {
        assignShift(schedule, secondDate, shuffledEmployees[i], shift);
        shiftCounts[shuffledEmployees[i].id][shift]++;
      }
    }
  });
}

function assignDepartmentSchedule(
  schedule,
  employees,
  department,
  year,
  month,
  shiftCounts,
  timestamp,
) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const shifts = ['pagi', 'siang', 'malam'];

  // Mulai dari hari ketiga karena dua hari pertama sudah diatur
  for (let day = 3; day <= daysInMonth; day++) {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(
      day,
    ).padStart(2, '0')}`;

    const sortedEmployees = [...employees].sort((a, b) => {
      const aTotal = getTotalShifts(shiftCounts[a.id]);
      const bTotal = getTotalShifts(shiftCounts[b.id]);
      if (aTotal !== bTotal) {
        return aTotal - bTotal;
      }
      const seedA = hashCode(a.id + timestamp + day);
      const seedB = hashCode(b.id + timestamp + day);
      return seedA - seedB;
    });

    // Pastikan setiap shift memiliki minimal satu karyawan
    shifts.forEach(shift => {
      let assigned = false;
      for (const employee of sortedEmployees) {
        if (
          !assigned &&
          canWorkOnDate(employee, shiftCounts, date) &&
          canAssignToShift(schedule, date, department, shift) &&
          !isEmployeeAssignedToday(schedule, date, employee)
        ) {
          assignShift(schedule, date, employee, shift);
          shiftCounts[employee.id][shift]++;
          assigned = true;
        }
      }
    });

    // Isi sisa slot yang tersedia
    sortedEmployees.forEach(employee => {
      if (
        !isEmployeeAssignedToday(schedule, date, employee) &&
        canWorkOnDate(employee, shiftCounts, date)
      ) {
        const shift = getNextShiftForEmployee(
          employee,
          shiftCounts,
          shifts,
          timestamp + day,
        );
        if (shift && canAssignToShift(schedule, date, department, shift)) {
          assignShift(schedule, date, employee, shift);
          shiftCounts[employee.id][shift]++;
        } else {
          shiftCounts[employee.id].libur++;
        }
      }
    });
  }
}

function isEmployeeAssignedToday(schedule, date, employee) {
  const shifts = ['pagi', 'siang', 'malam'];
  return shifts.some(
    shift => schedule[date][employee.department][shift][employee.id],
  );
}
