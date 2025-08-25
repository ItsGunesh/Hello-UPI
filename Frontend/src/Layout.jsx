import React from "react";
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">StudyZone</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/" className="hover:text-blue-400">🏠 Home</Link>
          <Link to="/budget" className="hover:text-blue-400">💰 Budget Analyzer</Link>
          <Link to="/tasks" className="hover:text-blue-400">✅ Tasks</Link>
          <Link to="/notes" className="hover:text-blue-400">📝 Notes</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        {children}
      </div>
    </div>
  );
}
