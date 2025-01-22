export function handleDate(valueDate) {
  return new Date(valueDate).toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getTotalMinutes(hour, minute = 0) {
  return hour * 60 + minute;
}

export function getShift() {
  // Pagi: 07.30 - 14.00
  // Siang: 14.00 - 21.00
  // Malam: 21.00 - 07.30

  const now = new Date();

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = getTotalMinutes(currentHour, currentMinute);

  const pagiStart = getTotalMinutes(7, 30); // 07:30
  const pagiEnd = getTotalMinutes(14, 0); // 14:00
  const siangEnd = getTotalMinutes(21, 0); // 21:00

  let shift;

  if (currentTimeInMinutes >= pagiStart && currentTimeInMinutes < pagiEnd) {
    shift = 'Pagi';
  } else if (
    currentTimeInMinutes >= pagiEnd &&
    currentTimeInMinutes < siangEnd
  ) {
    shift = 'Siang';
  } else {
    shift = 'Malam';
  }
  return shift;
}
