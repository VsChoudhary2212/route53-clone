"use client";

import { CheckCircle2, XCircle, X } from "lucide-react";

interface ToastProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export default function Toast({
  type,
  message,
  onClose,
}: ToastProps) {
  const isSuccess = type === "success";

  return (
    <div
      className={`fixed right-6 top-20 z-[100] flex w-[360px] items-start gap-3 border bg-white px-4 py-3 shadow-lg ${
        isSuccess
          ? "border-green-300"
          : "border-red-300"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2
          size={20}
          className="mt-0.5 shrink-0 text-green-600"
        />
      ) : (
        <XCircle
          size={20}
          className="mt-0.5 shrink-0 text-red-600"
        />
      )}

      <div className="flex-1">
        <p
          className={`text-sm font-semibold ${
            isSuccess ? "text-gray-900" : "text-red-800"
          }`}
        >
          {isSuccess ? "Success" : "Error"}
        </p>

        <p className="mt-0.5 text-sm text-gray-600">
          {message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-900"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}