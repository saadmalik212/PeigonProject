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
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 shadow-lg">
      <div className="container mx-auto flex flex-wrap justify-center space-x-4">
        {dates.map((d) => (
          <Link
            key={d.slug}
            to={`${base}/${d.slug}`}
            className="hover:text-yellow-300 transition duration-300 font-medium text-sm"
          >
            {d.label}
          </Link>
        ))}
        <Link
          to={`${base}/total`}
          className="hover:text-yellow-300 transition duration-300 font-bold text-sm"
        >
          Total Page
        </Link>
      </div>
    </nav>
  );
}