import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "./firebase";
import { ref, push, onValue, update, remove } from "firebase/database";
import { signOut } from "firebase/auth";
import Nav from "./Nav";
import DatePage from "./DatePage";
import TotalPage from "./TotalPage";

// 🆕 HELPER FUNCTION: Format minutes to hours and minutes
export const formatTime = (minutes) => {
  if (minutes === 0) return "0 min";

  const isNegative = minutes < 0;
  const absMinutes = Math.abs(minutes);

  const hours = Math.floor(absMinutes / 60);
  const mins = absMinutes % 60;

  let result = "";

  if (hours > 0) {
    result += `${hours} hr`;
    if (mins > 0) {
      result += ` ${mins} min`;
    }
  } else {
    result = `${mins} min`;
  }

  return isNegative ? `-${result}` : result;
};

export default function Admin() {
  const { dateSlug } = useParams();

  const dates = ["24 April", "26 April", "28 April", "30 April", "2 May", "4 May", "6 May"];
  const dateSlugs = ["24-April", "26-April", "28-April", "30-April", "2-May", "4-May", "6-May"];

  const dateIndex = dateSlugs.indexOf(dateSlug);
  const currentDate = dateSlug === 'total' ? null : (dateIndex !== -1 ? dates[dateIndex] : null);
  const currentDateSlug = dateSlug === 'total' ? null : dateSlug;

  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [baseTime, setBaseTime] = useState("");

  const [cellModal, setCellModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    const usersRef = ref(db, "users/");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setUsers(list);
    });

    return () => unsubscribe();
  }, []);

  const addUser = () => {
    if (!name || !baseTime) return alert("Fill all fields");

    push(ref(db, "users/"), {
      name,
      baseTime,
      dates: {},
    });

    setShowModal(false);
    setName("");
    setBaseTime("");
  };

  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      remove(ref(db, "users/" + id));
    }
  };

  const openCellModal = (user, date, index) => {
    setSelectedUser(user);
    setSelectedDate(date);
    setSelectedIndex(index);
    setSelectedTime(user.dates?.[date]?.[index] || "");
    setCellModal(true);
  };

  const saveCellTime = () => {
    let times = [...(selectedUser.dates?.[selectedDate] || new Array(9).fill(""))];
    times[selectedIndex] = selectedTime;
    let dates = { ...selectedUser.dates };
    dates[selectedDate] = times;

    update(ref(db, "users/" + selectedUser.id), { dates });
    setCellModal(false);
  };

  const deleteCellTime = () => {
    let times = [...(selectedUser.dates?.[selectedDate] || new Array(9).fill(""))];
    times[selectedIndex] = "";
    let dates = { ...selectedUser.dates };
    dates[selectedDate] = times;

    update(ref(db, "users/" + selectedUser.id), { dates });
    setCellModal(false);
  };

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

  if (dateSlug !== 'total' && dateIndex === -1) {
    return (
      <>
        <Nav isAdmin={true} />
        <div className="p-8 text-center">
          <h1 className="text-2xl text-red-600">Invalid Date</h1>
          <p>Date not found: {dateSlug}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav isAdmin={true} />
      {dateSlug === 'total' ? (
        <TotalPage 
          dates={dates} 
          isAdmin={true} 
          users={users} 
          calculateTotal={calculateTotal} 
          formatTime={formatTime}  // 🆕 Pass formatTime
        />
      ) : (
        <DatePage 
          date={currentDate} 
          dateSlug={currentDateSlug}
          isAdmin={true} 
          users={users} 
          openCellModal={openCellModal} 
          deleteUser={deleteUser} 
          calculateTotal={calculateTotal}
          formatTime={formatTime}  // 🆕 Pass formatTime
          setShowModal={setShowModal} 
        />
      )}

      {/* ADD USER MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-xl">
            <h2 className="text-xl mb-4 font-bold">Add User</h2>
            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="User Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="time"
              className="border p-2 w-full mb-4 rounded"
              value={baseTime}
              onChange={(e) => setBaseTime(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                onClick={addUser}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CELL MODAL */}
      {cellModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-xl">
            <h2 className="text-xl mb-4 font-bold">Edit Time for {selectedDate} T{selectedIndex + 1}</h2>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="border p-2 w-full mb-4 rounded"
            />
            <div className="flex justify-between gap-2">
              <button
                onClick={saveCellTime}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Save
              </button>
              <button
                onClick={deleteCellTime}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setCellModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}