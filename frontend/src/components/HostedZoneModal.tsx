"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  createHostedZone,
  updateHostedZone,
  HostedZone,
} from "@/lib/api";

interface Props {
  zone?: HostedZone | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function HostedZoneModal({
  zone,
  onClose,
  onSaved,
}: Props) {
  const [name, setName] = useState(zone?.name || "");
  const [zoneType, setZoneType] = useState(
    zone?.zone_type || "Public"
  );
  const [description, setDescription] = useState(
    zone?.description || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(zone);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setError("Domain name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (zone) {
        await updateHostedZone(zone.id, {
          name,
          zone_type: zoneType,
          description,
        });
      } else {
        await createHostedZone({
          name,
          zone_type: zoneType,
          description,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {isEdit
              ? "Edit hosted zone"
              : "Create hosted zone"}
          </h2>

          <button onClick={onClose}>
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
              <label className="block text-sm font-medium mb-1">
                Domain name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="example.com"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <p className="text-xs text-gray-500 mt-1">
                Enter the domain name for this hosted zone.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Type
              </label>

              <select
                value={zoneType}
                onChange={(e) => setZoneType(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option>Public</option>
                <option>Private</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={3}
                placeholder="Optional description"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
              />
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
              disabled={loading}
              className="px-4 py-2 bg-[#146eb4] text-white rounded text-sm hover:bg-[#125a94] disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEdit
                ? "Save changes"
                : "Create hosted zone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}