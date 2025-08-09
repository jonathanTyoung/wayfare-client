import { Link } from "react-router-dom";

export const Sidebar = () => {
  return (
    <aside className="hidden lg:block w-64 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Wayfare</h2>
      <ul className="space-y-3 text-gray-700 dark:text-gray-300">
        <li><Link to="/" className="hover:underline">Home</Link></li>
        <li><Link to="/profile" className="hover:underline">Profile</Link></li>
        <li><Link to="/explore" className="hover:underline">Explore</Link></li>
        <li><Link to="/explore" className="hover:underline">Search</Link></li>
      </ul>
    </aside>
  );
};
