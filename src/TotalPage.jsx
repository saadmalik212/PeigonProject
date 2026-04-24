import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { formatMinutes, getDateData, convertTo12Hour } from "./utils";

export default function TotalPage({ dates, isAdmin, users, calculateTotal }) {
  const dayTotals = dates.reduce((acc, d) => {
    acc[d] = users.reduce((sum, u) => {
      const { baseTime, times } = getDateData(u, d);
      return sum + calculateTotal(baseTime, times);
    }, 0);
    return acc;
  }, {});

  const overallTotal = Object.values(dayTotals).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-1 md:p-4">
        <div className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:mb-4 gap-2">
          <h1 className="text-lg md:text-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-lg">Total Page</h1>
          {isAdmin && (
            <button
              onClick={() => signOut(auth)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300 shadow text-xs md:text-sm font-medium"
            >
              Logout
            </button>
          )}
        </div>

        <div className="bg-white p-0 md:p-4 rounded-lg shadow-lg overflow-x-auto border border-gray-200">
          <table className="w-full border-collapse text-[10px] md:text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <th className="p-1 md:p-3 text-left font-semibold border border-blue-800 min-w-[40px] md:min-w-[80px]">Name</th>
                {dates.map((d) => (
                  <th key={d} className="p-1 md:p-3 text-center font-semibold border border-blue-800 min-w-[35px] md:min-w-[100px]">
                    {d.split(' ')[0]}
                  </th>
                ))}
                <th className="p-1 md:p-3 text-center font-semibold border border-blue-800 min-w-[40px] md:min-w-[110px] font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const userTotals = dates.reduce((acc, d) => {
                  const { baseTime, times } = getDateData(u, d);
                  acc[d] = calculateTotal(baseTime, times);
                  return acc;
                }, {});
                const userOverall = Object.values(userTotals).reduce((a, b) => a + b, 0);
                return (
                  <tr key={u.id} className="hover:bg-blue-50 transition duration-200">
                    <td className="p-1 md:p-3 font-medium text-gray-800 border border-gray-300 text-[10px] md:text-sm truncate">{u.name}</td>
                    {dates.map((d) => (
                      <td key={d} className="p-1 md:p-3 text-white font-semibold border border-gray-300 text-center min-w-[35px] md:min-w-[100px] bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md text-[10px] md:text-sm">
                        {formatMinutes(userTotals[d])}
                      </td>
                    ))}
                    <td className="p-1 md:p-3 font-bold text-white border border-gray-300 text-center min-w-[40px] md:min-w-[110px] bg-gradient-to-br from-green-500 to-green-600 shadow-md text-[10px] md:text-sm">{formatMinutes(userOverall)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gradient-to-r from-purple-600 to-purple-700 font-bold border-t-2 border-blue-800 text-white">
                <td className="p-1 md:p-3 border border-gray-300 text-[10px] md:text-sm">
                  Total
                </td>
                {dates.map((d) => (
                  <td key={d} className="p-1 md:p-3 text-white border border-gray-300 text-center min-w-[35px] md:min-w-[100px] bg-gradient-to-br from-orange-500 to-yellow-600 font-semibold shadow-md text-[10px] md:text-sm">
                    {formatMinutes(dayTotals[d])}
                  </td>
                ))}
                <td className="p-1 md:p-3 text-white font-bold border border-gray-300 text-center min-w-[40px] md:min-w-[110px] bg-gradient-to-br from-pink-600 to-rose-700 shadow-md text-[10px] md:text-sm">{formatMinutes(overallTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}