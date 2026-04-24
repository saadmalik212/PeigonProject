import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { formatMinutes, getDateData, convertTo12Hour } from "./utils";

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
    const { baseTime, times } = getDateData(u, safeDate);
    return sum + safeCalculateTotal(baseTime, times);
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
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-1 md:p-4">
        <div className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:mb-3 gap-2">
          <h1 className="text-lg md:text-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-lg">{safeDate}</h1>
          {isAdmin && (
            <button
              onClick={() => signOut(auth)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300 shadow text-xs md:text-sm font-medium"
            >
              Logout
            </button>
          )}
        </div>

        {isAdmin && (
          <button
            onClick={() => safeSetShowModal(true)}
            className="bg-blue-600 text-white px-2 md:px-3 py-1 rounded mb-2 md:mb-4 hover:bg-blue-700 transition duration-300 shadow text-xs md:text-sm font-medium"
          >
            + Add User
          </button>
        )}

        <div className="bg-white p-0 md:p-4 rounded-lg shadow-lg overflow-x-auto border border-gray-200">
          <table className="w-full border-collapse text-[10px] md:text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <th className="p-1 md:p-3 text-left font-semibold border border-blue-800 min-w-[40px] md:min-w-[80px]">Name</th>
                <th className="p-1 md:p-3 text-left font-semibold border border-blue-800 min-w-[35px] md:min-w-[80px]">Time</th>
                {Array.from({ length: 9 }, (_, i) => (
                  <th key={i} className="p-1 md:p-3 text-center font-semibold border border-blue-800 min-w-[24px] md:min-w-[80px]">T{i + 1}</th>
                ))}
                <th className="p-1 md:p-3 text-center font-semibold border border-blue-800 min-w-[32px] md:min-w-[100px]">Tot</th>
                {isAdmin && <th className="p-1 md:p-3 text-center font-semibold border border-blue-800 min-w-[40px] md:min-w-[80px]">Act</th>}
              </tr>
            </thead>
            <tbody>
              {safeUsers.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 13 : 12} className="p-2 md:p-4 text-center text-gray-500 text-[10px] md:text-sm">
                    No users found. {isAdmin && "Click 'Add User' to create one."}
                  </td>
                </tr>
              ) : (
                safeUsers.map((u) => {
                  if (!u || !u.id) return null;
                  
                  const { baseTime, times } = getDateData(u, safeDate);
                  const userTotal = safeCalculateTotal(baseTime, times);
                  
                  return (
                    <tr key={u.id} className="hover:bg-blue-50 transition duration-200">
                      <td className="p-1 md:p-3 font-medium text-gray-800 border border-gray-300 text-[10px] md:text-sm truncate">{u.name || "Unknown"}</td>
                      <td
                        className={`p-1 md:p-3 text-gray-600 border border-gray-300 text-center text-[10px] md:text-sm ${isAdmin ? 'cursor-pointer hover:bg-blue-100' : ''}`}
                        onClick={isAdmin ? () => safeOpenCellModal(u, safeDate, -1) : undefined}
                        title={isAdmin ? 'Click to edit base time' : undefined}
                      >
                        {baseTime ? convertTo12Hour(baseTime) : "--:--"}
                      </td>
                      {Array.from({ length: 9 }, (_, i) => (
                        <td
                          key={i}
                          className={`p-1 md:p-3 border border-gray-300 text-center min-w-[24px] md:min-w-[80px] ${
                            isAdmin ? 'cursor-pointer hover:shadow-md' : ''
                          } transition duration-200 overflow-hidden bg-gradient-to-br from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100`}
                          onClick={isAdmin ? () => safeOpenCellModal(u, safeDate, i) : undefined}
                        >
                          {times && times[i] ? (
                            <span className="text-blue-700 font-semibold block truncate text-[10px] md:text-sm">{convertTo12Hour(times[i])}</span>
                          ) : (
                            <span className="text-gray-300">--</span>
                          )}
                        </td>
                      ))}
                      <td className="p-1 md:p-3 font-bold text-white border border-gray-300 text-center min-w-[32px] md:min-w-[100px] bg-gradient-to-br from-green-500 to-green-600 shadow-md text-[10px] md:text-sm">{formatMinutes(userTotal)}</td>
                      {isAdmin && (
                        <td className="p-1 md:p-3 border border-gray-300 text-center min-w-[40px] md:min-w-[80px]">
                          <button
                            onClick={() => safeDeleteUser(u.id)}
                            className="bg-red-500 text-white px-1 md:px-3 py-0.5 md:py-1 rounded hover:bg-red-600 transition duration-300 shadow text-[9px] md:text-xs font-medium"
                          >
                            Del
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

        <div className="hidden md:block mt-4 md:mt-6 text-center">
          <h2 className="text-lg md:text-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 p-3 md:p-4 rounded-lg shadow-lg inline-block">
            Total for {safeDate}: {formatMinutes(dayTotal)}
          </h2>
        </div>
      </div>
    </div>
  );
}