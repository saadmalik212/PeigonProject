import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";
import Nav from "./Nav";
import DatePage from "./DatePage";
import TotalPage from "./TotalPage";
import Top10Users from "./Top10Users";

export default function User() {
  const { dateSlug } = useParams();

  const dates = ["24 April", "26 April", "28 April", "30 April", "2 May", "4 May", "6 May"];
  const dateSlugs = ["24-April", "26-April", "28-April", "30-April", "2-May", "4-May", "6-May"];
  const currentDate = dateSlug === 'total' ? null : dates[dateSlugs.indexOf(dateSlug)];

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = ref(db, "users/");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      setUsers(Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      })));
    });
  }, []);

  // CALCULATE TOTAL
  const calculateTotal = (base, times) => {
    if (!times || !Array.isArray(times) || !base) return 0;

    // Validate base time format
    const [bh, bm] = base.split(":").map(Number);
    if (isNaN(bh) || isNaN(bm) || bh < 0 || bh > 23 || bm < 0 || bm > 59) return 0;
    const baseMin = bh * 60 + bm;

    let total = 0;

    times.forEach((t) => {
      // Skip empty or invalid entries
      if (!t || typeof t !== "string" || !t.includes(":")) return;
      
      const parts = t.split(":");
      if (parts.length !== 2) return;
      
      const [h, m] = parts.map(Number);
      
      // Validate time format (HH:MM with valid ranges)
      if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return;
      
      const min = h * 60 + m;
      
      // Only add if time is after base time (prevents negative totals)
      if (min >= baseMin) {
        total += min - baseMin;
      }
    });

    return total;
  };

  return (
    <>
      <Nav isAdmin={false} />
      {dateSlug === 'total' ? (
        <TotalPage dates={dates} isAdmin={false} users={users} calculateTotal={calculateTotal} />
      ) : dateSlug === 'top10' ? (
        <Top10Users dates={dates} isAdmin={false} users={users} calculateTotal={calculateTotal} />
      ) : (
        <DatePage date={currentDate} isAdmin={false} users={users} calculateTotal={calculateTotal} />
      )}
    </>
  );
}