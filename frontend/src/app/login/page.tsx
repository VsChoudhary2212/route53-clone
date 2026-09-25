"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const user = login(email, password);

    if (!user) {
      return;
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[#eaeded] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-[#232f3e]">
            aws
          </div>

          <div className="text-sm text-gray-600 mt-2">
            Management Console
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#e7f0fe] flex items-center justify-center">
              <LockKeyhole
                size={19}
                className="text-[#146eb4]"
              />
            </div>

            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Sign in
              </h1>

              <p className="text-xs text-gray-500">
                Route 53 Management Console
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-400 bg-white text-gray-900 placeholder:text-gray-400 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#146eb4] focus:ring-2 focus:ring-[#146eb4]/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full border border-gray-400 bg-white text-gray-900 placeholder:text-gray-400 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#146eb4] focus:ring-2 focus:ring-[#146eb4]/20"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#146eb4] hover:bg-[#125a94] text-white py-2.5 rounded font-medium text-sm"
            >
              Sign in
            </button>
          </form>

          <div className="mt-5 p-3 bg-gray-50 border rounded text-xs text-gray-500">
            <strong>Demo authentication</strong>
            <br />
            Enter any email and password to continue.
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-5">
          AWS Route 53 Clone · Campus Assignment
        </p>
      </div>
    </div>
  );
}