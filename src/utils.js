// Format minutes to hours and minutes display
export const formatMinutes = (minutes) => {
  // Handle edge cases
  if (minutes === null || minutes === undefined || minutes === 0) return "0 min";
  
  // Handle negative values (shouldn't happen, but just in case)
  const absMinutes = Math.abs(minutes);
  const isNegative = minutes < 0;
  
  const hours = Math.floor(absMinutes / 60);
  const mins = absMinutes % 60;
  
  let result = "";
  if (hours === 0) {
    result = `${mins} min`;
  } else if (mins === 0) {
    result = `${hours} h`;
  } else {
    result = `${hours} h ${mins} min`;
  }
  
  return isNegative ? `-${result}` : result;
};
