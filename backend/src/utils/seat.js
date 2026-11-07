export const generateSeatNumber = (packageId, totalSeats, bookedSeats) => {
  const row = Math.floor((bookedSeats % totalSeats) / 4);
  const letter = 'ABCD'[Math.floor(Math.random() * 4)];
  return `${packageId.slice(-3).toUpperCase()}-${String(row + 1).padStart(2, '0')}${letter}`;
};
