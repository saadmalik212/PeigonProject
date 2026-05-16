import { Link } from "react-router-dom";

const dates = [
  { slug: "24-April", label: "24 April" },
  { slug: "26-April", label: "26 April" },
  { slug: "28-April", label: "28 April" },
  { slug: "30-April", label: "30 April" },
  { slug: "2-May", label: "2 May" },
  { slug: "4-May", label: "4 May" },
  { slug: "6-May", label: "6 May" },
];

export default function Nav({ isAdmin }) {
  const base = isAdmin ? "/admin" : "/user";

  return (
    <nav className="w-full bg-gradient-to-r from-yellow-300 to-yellow-900 text-white shadow-lg">
      <div className="flex flex-wrap justify-center gap-2 px-2 py-4 md:px-4 md:py-5">
        {dates.map((d) => (
          <Link
            key={d.slug}
            to={`${base}/${d.slug}`}
            className="px-3 md:px-4 py-2 md:py-2 rounded-lg  bg-gradient-to-br from-black text-extrabold to-red-600 text-white font-black border border-gray-300 text-[10px] md:text-sm truncate shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] [text-shadow:1px_1px_0px_#000  hover:from-blue-400 hover:to-green-600 transition duration-300 font-medium text-xs md:text-sm shadow-md hover:shadow-lg transform hover:scale-105"
          >
            {d.label}
          </Link>
        ))}
        <Link
          to={`${base}/top10`}
          className="px-3 md:px-4 py-2 md:py-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 transition duration-300 font-bold text-xs md:text-sm shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Top 10 Users
        </Link>
        <Link
          to={`${base}/total`}
          className="px-3 md:px-4 py-2 md:py-2 rounded-lg bg-gradient-to-br from-pink-500 to-pink-700 hover:from-pink-400 hover:to-pink-600 transition duration-300 font-bold text-xs md:text-sm shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Total Page
        </Link>
      </div>
    </nav>
  );
}