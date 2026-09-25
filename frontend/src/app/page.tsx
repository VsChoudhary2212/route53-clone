"use client";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Pencil,
} from "lucide-react";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import HostedZoneModal from "@/components/HostedZoneModal";
import Toast from "@/components/Toast";
import {
  deleteHostedZone,
  getHostedZones,
  HostedZone,
} from "@/lib/api";

export default function Home() {
  const [active, setActive] = useState("Hosted zones");

  const [zones, setZones] = useState<HostedZone[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingZone, setEditingZone] =
    useState<HostedZone | null>(null);

  const [menuId, setMenuId] = useState<number | null>(null);
  const [toast, setToast] = useState<{
     type: "success" | "error";
     message: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
      const user = getCurrentUser();

      if (!user) {
          router.replace("/login");
      }
  }, [router]);

  async function loadZones() {
    try {
      setLoading(true);
      const data = await getHostedZones(search);
      setZones(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadZones();
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hosted zone?"
    );

    if (!confirmed) return;

    try {
      await deleteHostedZone(id);
      await loadZones();
      setMenuId(null);
      setToast({
        type: "success",
        message: "Hosted zone deleted successfully.",
      });
    } catch (error) {
      setToast({
        type:"error",
        message:
        error instanceof Error
          ? error.message
          : "Failed to delete hosted zone"
      });
    }
  }

  function openCreate() {
    setEditingZone(null);
    setModalOpen(true);
  }

  function openEdit(zone: HostedZone) {
    setEditingZone(zone);
    setModalOpen(true);
    setMenuId(null);
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <Header />

      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar
          active={active}
          onSelect={setActive}
        />

        <main className="flex-1 min-w-0">
          <div className="border-b border-gray-200 px-8 py-5">
            <div className="text-sm text-gray-500 mb-1">
              Route 53
            </div>

            <h1 className="text-2xl font-semibold">
              Hosted zones
            </h1>
          </div>

          {active !== "Hosted zones" ? (
            <div className="p-8">
              <div className="border rounded-lg p-12 text-center">
                <h2 className="text-xl font-semibold mb-2">
                  {active}
                </h2>

                <p className="text-gray-500">
                  This section is coming soon.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    Hosted zones
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Manage the hosted zones for your domains.
                  </p>
                </div>

                <button
                  onClick={openCreate}
                  className="flex items-center gap-2 bg-[#146eb4] hover:bg-[#125a94] text-white px-4 py-2 rounded text-sm font-medium"
                >
                  <Plus size={16} />
                  Create hosted zone
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg">
                <div className="p-4 border-b bg-gray-50">
                  <div className="relative max-w-md">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      placeholder="Search hosted zones"
                      className="w-full border border-gray-300 rounded pl-10 pr-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-white">
                        <th className="text-left font-semibold px-5 py-3">
                          Name
                        </th>

                        <th className="text-left font-semibold px-5 py-3">
                          Type
                        </th>

                        <th className="text-left font-semibold px-5 py-3">
                          Records
                        </th>

                        <th className="text-left font-semibold px-5 py-3">
                          Description
                        </th>

                        <th className="w-12"></th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center py-12 text-gray-500"
                          >
                            Loading hosted zones...
                          </td>
                        </tr>
                      ) : zones.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center py-16"
                          >
                            <div className="text-lg font-medium">
                              No hosted zones found
                            </div>

                            <div className="text-sm text-gray-500 mt-1">
                              Create a hosted zone to get started.
                            </div>
                          </td>
                        </tr>
                      ) : (
                        zones.map((zone) => (
                          <tr
                            key={zone.id}
                            className="border-b last:border-b-0 hover:bg-gray-50"
                          >
                            <td className="px-5 py-4">
                              <button
                                className="text-[#146eb4] hover:underline font-medium"
                                onClick={() =>
                                  window.location.href = `/hosted-zones/${zone.id}`
                                }
                              >
                                {zone.name}
                              </button>
                            </td>

                            <td className="px-5 py-4">
                              <span className="inline-flex px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">
                                {zone.zone_type}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              {zone.record_count}
                            </td>

                            <td className="px-5 py-4 text-gray-600">
                              {zone.description || "—"}
                            </td>

                            <td className="px-5 py-4 relative">
                              <button
                                onClick={() =>
                                  setMenuId(
                                    menuId === zone.id
                                      ? null
                                      : zone.id
                                  )
                                }
                                className="p-1 hover:bg-gray-200 rounded"
                              >
                                <MoreVertical size={18} />
                              </button>

                              {menuId === zone.id && (
                                <div className="absolute right-4 top-10 z-20 w-40 bg-white border rounded shadow-lg">
                                  <button
                                    onClick={() =>
                                      openEdit(zone)
                                    }
                                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100"
                                  >
                                    <Pencil size={15} />
                                    Edit
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleDelete(zone.id)
                                    }
                                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 size={15} />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-5 py-3 border-t bg-gray-50 text-sm">
                  <span className="text-gray-500">
                    {zones.length} hosted zone
                    {zones.length !== 1 ? "s" : ""}
                  </span>

                  <div className="flex items-center gap-2">
                    <button className="p-1 border rounded bg-white disabled:opacity-40">
                      <ChevronLeft size={16} />
                    </button>

                    <span className="px-2">1</span>

                    <button className="p-1 border rounded bg-white disabled:opacity-40">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {modalOpen && (
        <HostedZoneModal
          zone={editingZone}
          onClose={() => setModalOpen(false)}
          onSaved={async (message) => {
            await loadZones();

            setToast({
              type: "success",
              message,
            });
          }}
        />
      )}
    </div>
  );
}