import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { formatMinutes } from "./utils";

export default function TotalPage({ dates, isAdmin, users, calculateTotal }) {
  const dayTotals = dates.reduce((acc, d) => {
    acc[d] = users.reduce((sum, u) => {
      const times = u.dates?.[d] || [];
      return sum + calculateTotal(u.baseTime, times);
    }, 0);
    return acc;
  }, {});

  const overallTotal = Object.values(dayTotals).reduce((a, b) => a + b, 0);

  return (
    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Total Page</h1>
        {isAdmin && (
          <button
            onClick={() => signOut(auth)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300 shadow text-sm"
          >
            Logout
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg overflow-x-auto border border-gray-200">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <th className="p-3 text-left font-semibold border border-blue-800">Name</th>
              <th className="p-3 text-left font-semibold border border-blue-800 text-center">Base Time</th>
              {dates.map((d) => (
                <th key={d} className="p-3 text-center font-semibold border border-blue-800 min-w-[100px]">
                  {d}
                </th>
              ))}
              <th className="p-3 text-center font-semibold border border-blue-800 min-w-[110px] font-bold">Overall Total</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const userTotals = dates.reduce((acc, d) => {
                const times = u.dates?.[d] || [];
                acc[d] = calculateTotal(u.baseTime, times);
                return acc;
              }, {});
              const userOverall = Object.values(userTotals).reduce((a, b) => a + b, 0);
              return (
                <tr key={u.id} className="hover:bg-blue-50 transition duration-200">
                  <td className="p-3 font-medium text-gray-800 border border-gray-300">{u.name}</td>
                  <td className="p-3 text-gray-600 border border-gray-300 text-center">{u.baseTime}</td>
                  {dates.map((d) => (
                    <td key={d} className="p-3 text-blue-700 font-semibold border border-gray-300 text-center min-w-[100px] bg-blue-50">
                      {formatMinutes(userTotals[d])}
                    </td>
                  ))}
                  <td className="p-3 font-bold text-green-700 border border-gray-300 text-center min-w-[110px] bg-green-50">{formatMinutes(userOverall)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gradient-to-r from-blue-100 to-blue-50 font-bold border-t-2 border-blue-800">
              <td className="p-3 border border-gray-300" colSpan="2">
                Day Totals
              </td>
              {dates.map((d) => (
                <td key={d} className="p-3 text-green-700 border border-gray-300 text-center min-w-[100px] bg-yellow-50 font-semibold">
                  {formatMinutes(dayTotals[d])}
                </td>
              ))}
              <td className="p-3 text-green-700 font-bold border border-gray-300 text-center min-w-[110px] bg-yellow-100">{formatMinutes(overallTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}