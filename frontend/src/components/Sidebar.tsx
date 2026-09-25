"use client";

import {
  Activity,
  Boxes,
  CircleGauge,
  Globe,
  HeartPulse,
  Network,
  Route,
  ShieldCheck,
} from "lucide-react";

interface SidebarProps {
  active: string;
  onSelect: (item: string) => void;
}

const items = [
  {
    name: "Dashboard",
    icon: CircleGauge,
  },
  {
    name: "Hosted zones",
    icon: Globe,
  },
  {
    name: "Traffic policies",
    icon: Route,
  },
  {
    name: "Health checks",
    icon: HeartPulse,
  },
  {
    name: "Resolver",
    icon: Network,
  },
  {
    name: "Profiles",
    icon: Boxes,
  },
];

export default function Sidebar({
  active,
  onSelect,
}: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 bg-[#f7f7f7] border-r border-gray-200">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck size={18} />
          <span className="font-semibold text-gray-800">
            Route 53
          </span>
        </div>

        <div className="text-[11px] uppercase tracking-wide font-semibold text-gray-500 mb-2">
          Route 53
        </div>

        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const selected = active === item.name;

            return (
              <button
                key={item.name}
                onClick={() => onSelect(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition ${
                  selected
                    ? "bg-[#e7f0fe] text-[#0969da] font-semibold"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon size={16} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}