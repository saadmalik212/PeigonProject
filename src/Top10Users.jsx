import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { getDateData } from "./utils";

export default function Top10Users({ dates, isAdmin, users, calculateTotal }) {
  // Calculate total minutes for each user
  const userTotals = users.map(user => {
    const totalMinutes = dates.reduce((sum, date) => {
      const { baseTime, times } = getDateData(user, date);
      return sum + calculateTotal(baseTime, times);
    }, 0);
    return { ...user, totalMinutes };
  });

  // Sort by total minutes descending and take top 10
  const top10Users = userTotals
    .sort((a, b) => b.totalMinutes - a.totalMinutes)
    .slice(0, 10);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-1 md:p-4">
        <div className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:mb-4 gap-2">
          <h1 className="text-lg md:text-2xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-lg">Top 10 Users by Total Hours</h1>
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
              <tr className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                <th className="p-1 md:p-3 text-center font-semibold border border-purple-800 min-w-[24px] md:min-w-[80px]">Rank</th>
                <th className="p-1 md:p-3 text-left font-semibold border border-purple-800 min-w-[40px] md:min-w-[100px]">Name</th>
                <th className="p-1 md:p-3 text-center font-semibold border border-purple-800 min-w-[45px] md:min-w-[120px]">Hrs</th>
              </tr>
            </thead>
            <tbody>
              {top10Users.map((user, index) => (
                <tr key={user.id} className="hover:shadow-md transition duration-200">
                  <td className="p-1 md:p-3 font-bold text-white border border-gray-300 text-center bg-gradient-to-br from-orange-500 to-red-600 shadow text-[10px] md:text-sm min-w-[24px] md:min-w-[80px]">
                    {index + 1}
                  </td>
                  <td className="p-1 md:p-3 font-medium text-gray-800 border border-gray-300 text-[10px] md:text-sm truncate">{user.name}</td>
                  <td className="p-1 md:p-3 font-bold text-white border border-gray-300 text-center bg-gradient-to-br from-green-500 to-emerald-600 shadow text-[10px] md:text-sm min-w-[45px] md:min-w-[120px]">
                    {(user.totalMinutes / 60).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}