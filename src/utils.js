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

export const getDateEntry = (user, date) => {
  if (!user || !date || !user.dates) {
    return { baseTime: "", times: [] };
  }

  const entry = user.dates[date];

  if (Array.isArray(entry)) {
    return { baseTime: user.baseTime || "", times: entry };
  }

  if (entry && typeof entry === "object") {
    return {
      baseTime: typeof entry.baseTime === "string" ? entry.baseTime : (user.baseTime || ""),
      times: Array.isArray(entry.times) ? entry.times : [],
    };
  }

  return { baseTime: "", times: [] };
};

export const getBaseTimeForDate = (user, date) => {
  const entry = user?.dates?.[date];
  if (entry && !Array.isArray(entry) && typeof entry.baseTime === "string") {
    return entry.baseTime;
  }
  return user?.baseTime || "";
};

export const getTimesForDate = (user, date) => {
  return getDateEntry(user, date).times;
};

export const convertTo12Hour = (time24) => {
  if (!time24 || typeof time24 !== "string") return "";
  
  const [hours, minutes] = time24.split(":");
  if (!hours || !minutes) return "";
  
  const h = parseInt(hours, 10);
  const m = minutes;
  
  if (h === 0) return `12:${m} AM`;
  if (h < 12) return `${h}:${m} AM`;
  if (h === 12) return `12:${m} PM`;
  return `${h - 12}:${m} PM`;
};

export const getDateData = (user, date) => {
  const record = user?.dates?.[date];

  if (Array.isArray(record)) {
    return {
      baseTime: user.baseTime || "",
      times: record,
    };
  }

  if (record && typeof record === "object") {
    return {
      baseTime: typeof record.baseTime === "string" ? record.baseTime : (user.baseTime || ""),
      times: Array.isArray(record.times) ? record.times : [],
    };
  }

  return {
    baseTime: "",
    times: [],
  };
};
