"use client";

import { useState } from "react";
import {
  Bell,
  HelpCircle,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { getCurrentUser, logout, CurrentUser } from "@/lib/auth";

interface HeaderProps {
  onSignOut?: () => void;
}

export default function Header({ onSignOut }: HeaderProps) {
  const [user] = useState<CurrentUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return getCurrentUser();
  });

  const [accountOpen, setAccountOpen] = useState(false);

  function handleSignOut() {
    logout();
    onSignOut?.();
    window.location.href = "/login";
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center bg-[#111827] text-white">
      {/* AWS / Management Console */}
      <div className="flex h-full w-[220px] items-center border-r border-gray-700 px-5">
        <div className="flex items-center">
          <span className="text-2xl font-bold tracking-tight">
            aws
          </span>

          <span className="ml-2 text-xs text-gray-300">
            Management Console
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="ml-auto flex h-full items-center">
        {/* Notifications */}
        <button
          type="button"
          className="flex h-full items-center px-4 text-gray-300 transition hover:bg-gray-800 hover:text-white"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        {/* Help */}
        <button
          type="button"
          className="flex h-full items-center px-4 text-gray-300 transition hover:bg-gray-800 hover:text-white"
          aria-label="Help"
        >
          <HelpCircle size={18} />
        </button>

        {/* Account */}
        <div className="relative h-full">
          <button
            type="button"
            onClick={() => setAccountOpen((open) => !open)}
            className="flex h-full items-center gap-3 px-5 transition hover:bg-gray-800"
            aria-expanded={accountOpen}
            aria-haspopup="menu"
          >
            {/* Account avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 text-xs font-semibold uppercase">
              {user?.name?.charAt(0) || "A"}
            </div>

            {/* Account information */}
            <div className="text-left">
              <div className="text-sm font-medium leading-4">
                {user?.name || "Account"}
              </div>

              <div className="mt-1 max-w-[180px] truncate text-[11px] text-gray-400">
                {user?.email || ""}
              </div>
            </div>

            <ChevronDown
              size={16}
              className={`transition-transform ${
                accountOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Account dropdown */}
          {accountOpen && (
            <div
              className="absolute right-0 top-14 w-72 border border-gray-300 bg-white text-gray-900 shadow-xl"
              role="menu"
            >
              {/* User information */}
              <div className="border-b border-gray-200 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold uppercase text-gray-700">
                    {user?.name?.charAt(0) || "A"}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {user?.name || "Account"}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {user?.email || ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account options */}
              <div className="py-1">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-100"
                  role="menuitem"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}