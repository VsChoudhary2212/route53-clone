"use client";

import { useState } from "react";
import {
  Bell,
  ChevronDown,
  HelpCircle,
  LogOut,
  Menu,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

export default function Header() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    router.push("/login");
  }

  return (
    <header className="h-16 bg-[#232f3e] text-white flex items-center px-5">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <Menu
          size={20}
          className="text-gray-300"
        />

        <div className="text-2xl font-bold tracking-tight">
          aws
        </div>

        <div className="h-6 w-px bg-gray-500 mx-2" />

        <span className="text-sm text-gray-300">
          Management Console
        </span>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-5 text-sm">
        <button
          className="text-gray-300 hover:text-white"
          title="Notifications"
        >
          <Bell size={17} />
        </button>

        <button
          className="text-gray-300 hover:text-white"
          title="Help"
        >
          <HelpCircle size={17} />
        </button>

        {/* Account menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#314158] transition"
          >
            <span>Vishnu</span>

            <ChevronDown
              size={15}
              className={`transition-transform ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuOpen && (
            <>
              {/* Invisible backdrop */}
              <button
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              />

              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 z-50 w-52 bg-white text-gray-800 border border-gray-200 rounded-md shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b bg-gray-50">
                  <p className="text-sm font-semibold">
                    Vishnu Choudhary
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Route 53 user
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-gray-100"
                >
                  <LogOut size={16} />

                  <span>Sign out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}