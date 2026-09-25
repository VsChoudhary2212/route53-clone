"use client";
import { getCurrentUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
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
import {
  DNSRecord,
  HostedZone,
  getHostedZones,
  getRecords,
  deleteRecord,
} from "@/lib/api";
import RecordModal from "@/components/RecordModal";

export default function HostedZonePage() {
  const params = useParams();
  const router = useRouter();

  const zoneId = Number(params.id);

  const [zone, setZone] = useState<HostedZone | null>(null);
  const [records, setRecords] = useState<DNSRecord[]>([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<DNSRecord | null>(null);

  const [menuId, setMenuId] = useState<number | null>(null);

  async function loadData() {
    try {
      setLoading(true);

      const [zones, recordData] = await Promise.all([
        getHostedZones(),
        getRecords(zoneId, search, typeFilter),
      ]);

      const currentZone = zones.find(
        (item) => item.id === zoneId
      );

      setZone(currentZone || null);
      setRecords(recordData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
       const user = getCurrentUser();

       if (!user) {
          router.replace("/login");
        }
    }, [router]);
  useEffect(() => {
    if (!zoneId) return;

    const timer = setTimeout(() => {
      loadData();
    }, 250);

    return () => clearTimeout(timer);
  }, [zoneId, search, typeFilter]);

  async function handleDelete(recordId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this record?"
    );

    if (!confirmed) return;

    try {
      await deleteRecord(zoneId, recordId);
      setMenuId(null);
      await loadData();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete record"
      );
    }
  }

  function openCreate() {
    setEditingRecord(null);
    setModalOpen(true);
  }

  function openEdit(record: DNSRecord) {
    setEditingRecord(record);
    setMenuId(null);
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar
          active="Hosted zones"
          onSelect={(item) => {
            if (item === "Hosted zones") {
              router.push("/");
            }
          }}
        />

        <main className="flex-1 min-w-0">
          <div className="border-b border-gray-200 px-8 py-5">
            <div className="text-sm text-gray-500 mb-2">
              Route 53 / Hosted zones
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                className="p-1 rounded hover:bg-gray-100"
              >
                <ArrowLeft size={20} />
              </button>

              <div>
                <h1 className="text-2xl font-semibold">
                  {zone?.name || "Hosted zone"}
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Hosted zone details and DNS records
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {!zone && !loading ? (
              <div className="border rounded-lg p-12 text-center">
                <h2 className="text-xl font-semibold">
                  Hosted zone not found
                </h2>

                <button
                  onClick={() => router.push("/")}
                  className="mt-4 text-[#146eb4] hover:underline"
                >
                  Return to hosted zones
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">
                    Records
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Manage DNS records for this hosted zone.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg">
                  <div className="p-4 border-b bg-gray-50 flex items-center justify-between gap-4">
                    <div className="relative max-w-md flex-1">
                      <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        value={search}
                        onChange={(e) =>
                          setSearch(e.target.value)
                        }
                        placeholder="Search records"
                        className="w-full border border-gray-300 rounded pl-10 pr-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="relative">
                      <select
                        value={typeFilter}
                        onChange={(e) =>
                          setTypeFilter(e.target.value)
                        }
                        className="appearance-none border border-gray-300 rounded bg-white pl-3 pr-9 py-2 text-sm"
                      >
                        <option value="">All types</option>
                        <option value="A">A</option>
                        <option value="AAAA">AAAA</option>
                        <option value="CNAME">CNAME</option>
                        <option value="TXT">TXT</option>
                        <option value="MX">MX</option>
                        <option value="NS">NS</option>
                        <option value="PTR">PTR</option>
                        <option value="SRV">SRV</option>
                        <option value="CAA">CAA</option>
                      </select>

                      <ChevronDown
                        size={15}
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                      />
                    </div>

                    <button
                      onClick={openCreate}
                      className="flex items-center gap-2 bg-[#146eb4] hover:bg-[#125a94] text-white px-4 py-2 rounded text-sm font-medium whitespace-nowrap"
                    >
                      <Plus size={16} />
                      Create record
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left font-semibold px-5 py-3">
                            Name
                          </th>

                          <th className="text-left font-semibold px-5 py-3">
                            Type
                          </th>

                          <th className="text-left font-semibold px-5 py-3">
                            TTL
                          </th>

                          <th className="text-left font-semibold px-5 py-3">
                            Value
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
                              Loading records...
                            </td>
                          </tr>
                        ) : records.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="text-center py-16"
                            >
                              <div className="text-lg font-medium">
                                No records found
                              </div>

                              <div className="text-sm text-gray-500 mt-1">
                                Create a DNS record to get started.
                              </div>
                            </td>
                          </tr>
                        ) : (
                          records.map((record) => (
                            <tr
                              key={record.id}
                              className="border-b last:border-b-0 hover:bg-gray-50"
                            >
                              <td className="px-5 py-4 font-medium">
                                {record.name}
                              </td>

                              <td className="px-5 py-4">
                                <span className="inline-flex px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">
                                  {record.record_type}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                {record.ttl}
                              </td>

                              <td className="px-5 py-4 max-w-lg">
                                <div
                                  className="truncate text-gray-700"
                                  title={record.value}
                                >
                                  {record.value}
                                </div>
                              </td>

                              <td className="px-5 py-4 relative">
                                <button
                                  onClick={() =>
                                    setMenuId(
                                      menuId === record.id
                                        ? null
                                        : record.id
                                    )
                                  }
                                  className="p-1 hover:bg-gray-200 rounded"
                                >
                                  <MoreVertical size={18} />
                                </button>

                                {menuId === record.id && (
                                  <div className="absolute right-4 top-10 z-20 w-40 bg-white border rounded shadow-lg">
                                    <button
                                      onClick={() =>
                                        openEdit(record)
                                      }
                                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100"
                                    >
                                      <Pencil size={15} />
                                      Edit
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleDelete(record.id)
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
                      {records.length} record
                      {records.length !== 1 ? "s" : ""}
                    </span>

                    <div className="flex items-center gap-2">
                      <button className="p-1 border rounded bg-white">
                        <ChevronLeft size={16} />
                      </button>

                      <span className="px-2">1</span>

                      <button className="p-1 border rounded bg-white">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {modalOpen && (
        <RecordModal
          zoneId={zoneId}
          record={editingRecord}
          onClose={() => setModalOpen(false)}
          onSaved={loadData}
        />
      )}
    </div>
  );
}