export function handleDate(valueDate) {
  return new Date(valueDate).toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
