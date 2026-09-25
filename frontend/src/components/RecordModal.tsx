"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  createRecord,
  DNSRecord,
  updateRecord,
} from "@/lib/api";

interface Props {
  zoneId: number;
  record?: DNSRecord | null;
  onClose: () => void;
  onSaved: () => void;
}

const RECORD_TYPES = [
  "A",
  "AAAA",
  "CNAME",
  "TXT",
  "MX",
  "NS",
  "PTR",
  "SRV",
  "CAA",
];

export default function RecordModal({
  zoneId,
  record,
  onClose,
  onSaved,
}: Props) {
  const [name, setName] = useState(record?.name ?? "");
  const [recordType, setRecordType] = useState(
    record?.record_type ?? "A"
  );
  const [ttl, setTtl] = useState(
    record ? String(record.ttl) : "300"
  );
  const [value, setValue] = useState(record?.value ?? "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(record);

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Record name is required.");
      return;
    }

    if (!value.trim()) {
      setError("Record value is required.");
      return;
    }

    const ttlNumber = Number(ttl);

    if (
      !Number.isInteger(ttlNumber) ||
      ttlNumber < 0
    ) {
      setError("TTL must be a valid positive number.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (record) {
        await updateRecord(zoneId, record.id, {
          name: name.trim(),
          record_type: recordType,
          ttl: ttlNumber,
          value: value.trim(),
        });
      } else {
        await createRecord(zoneId, {
          name: name.trim(),
          record_type: recordType,
          ttl: ttlNumber,
          value: value.trim(),
        });
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit record" : "Create record"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            {error && (
              <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Record name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="www.example.com"
                className="w-full border border-gray-400 bg-white text-gray-900 placeholder:text-gray-400 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#146eb4] focus:ring-2 focus:ring-[#146eb4]/20"
              />

              <p className="text-xs text-gray-500 mt-1">
                Enter the full record name.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Record type
              </label>

              <select
                value={recordType}
                onChange={(e) =>
                  setRecordType(e.target.value)
                }
                className="w-full border border-gray-400 bg-white text-gray-900 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#146eb4] focus:ring-2 focus:ring-[#146eb4]/20"
              >
                {RECORD_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                TTL
              </label>

              <input
                type="number"
                min="0"
                value={ttl}
                onChange={(e) => setTtl(e.target.value)}
                className="w-full border border-gray-400 bg-white text-gray-900 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#146eb4] focus:ring-2 focus:ring-[#146eb4]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Value
              </label>

              <textarea
                value={value}
                onChange={(e) =>
                  setValue(e.target.value)
                }
                rows={4}
                placeholder="192.168.1.10"
                className="w-full border border-gray-400 bg-white text-gray-900 placeholder:text-gray-400 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#146eb4] focus:ring-2 focus:ring-[#146eb4]/20"
              />

              <p className="text-xs text-gray-500 mt-1">
                Enter the value for this DNS record.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#146eb4] text-white rounded text-sm hover:bg-[#125a94] disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEdit
                ? "Save changes"
                : "Create record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}