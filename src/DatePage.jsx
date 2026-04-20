import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { formatMinutes } from "./utils";

export default function DatePage({ 
  date, 
  isAdmin, 
  users, 
  openCellModal, 
  deleteUser, 
  calculateTotal, 
  setShowModal 
}) {
  // Safety checks - agar props missing hain toh default values
  const safeUsers = users || [];
  const safeDate = date || "";
  const safeCalculateTotal = calculateTotal || (() => 0);
  const safeOpenCellModal = openCellModal || (() => {});
  const safeDeleteUser = deleteUser || (() => {});
  const safeSetShowModal = setShowModal || (() => {});

  // Calculate day total with safety
  const dayTotal = safeUsers.reduce((sum, u) => {
    if (!u || !u.dates) return sum;
    const times = Array.isArray(u.dates[safeDate]) ? u.dates[safeDate] : [];
    return sum + safeCalculateTotal(u.baseTime, times);
  }, 0);

  // Agar date missing hai toh error show karo
  if (!safeDate) {
    return (
      <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen w-full">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> Date not found. Please check the URL.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">{safeDate}</h1>
        {isAdmin && (
          <button
            onClick={() => signOut(auth)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300 shadow text-sm"
          >
            Logout
          </button>
        )}
      </div>

      {isAdmin && (
        <button
          onClick={() => safeSetShowModal(true)}
          className="bg-blue-600 text-white px-3 py-1 rounded mb-4 hover:bg-blue-700 transition duration-300 shadow text-sm"
        >
          + Add User
        </button>
      )}

      <div className="bg-white p-4 rounded-lg shadow-lg overflow-x-auto border border-gray-200">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <th className="p-3 text-left font-semibold border border-blue-800">Name</th>
              <th className="p-3 text-left font-semibold border border-blue-800">Base Time</th>
              {Array.from({ length: 9 }, (_, i) => (
                <th key={i} className="p-3 text-center font-semibold border border-blue-800 min-w-[80px]">T{i + 1}</th>
              ))}
              <th className="p-3 text-center font-semibold border border-blue-800 min-w-[100px]">Total</th>
              {isAdmin && <th className="p-3 text-center font-semibold border border-blue-800 min-w-[80px]">Action</th>}
            </tr>
          </thead>
          <tbody>
            {safeUsers.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 13 : 12} className="p-4 text-center text-gray-500">
                  No users found. {isAdmin && "Click 'Add User' to create one."}
                </td>
              </tr>
            ) : (
              safeUsers.map((u) => {
                // Skip invalid user objects
                if (!u || !u.id) return null;
                
                const times = Array.isArray(u.dates?.[safeDate]) ? u.dates[safeDate] : [];
                const userTotal = safeCalculateTotal(u.baseTime, times);
                
                return (
                  <tr key={u.id} className="hover:bg-blue-50 transition duration-200">
                    <td className="p-3 font-medium text-gray-800 border border-gray-300">{u.name || "Unknown"}</td>
                    <td className="p-3 text-gray-600 border border-gray-300 text-center">{u.baseTime || "--:--"}</td>
                    {Array.from({ length: 9 }, (_, i) => (
                      <td
                        key={i}
                        className={`p-3 border border-gray-300 text-center min-w-[80px] ${
                          isAdmin ? 'cursor-pointer hover:bg-blue-100' : ''
                        } transition duration-200 overflow-hidden`}
                        onClick={isAdmin ? () => safeOpenCellModal(u, safeDate, i) : undefined}
                      >
                        {times && times[i] ? (
                          <span className="text-blue-600 font-semibold block truncate">{times[i]}</span>
                        ) : (
                          <span className="text-gray-400 text-lg">--</span>
                        )}
                      </td>
                    ))}
                    <td className="p-3 font-bold text-green-700 border border-gray-300 text-center min-w-[100px] bg-green-50">{formatMinutes(userTotal)}</td>
                    {isAdmin && (
                      <td className="p-3 border border-gray-300 text-center min-w-[80px]">
                        <button
                          onClick={() => safeDeleteUser(u.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300 shadow text-xs font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <h2 className="text-xl font-bold text-white bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-lg shadow-lg inline-block">
          Total for {safeDate}: {formatMinutes(dayTotal)}
        </h2>
      </div>
    </div>
  );
}