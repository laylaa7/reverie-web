"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Radio,
  Stethoscope,
  Users,
  ClipboardList,
  Film,
  Calendar,
  CreditCard,
  BarChart2,
  Server,
  Settings,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number | null;
  badgeColor?: string;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

interface SidebarProps {
  pendingCount?: number;
  liveCount?: number;
}

export function Sidebar({ pendingCount = 0, liveCount = 0 }: SidebarProps) {
  const pathname = usePathname();

  const nav: NavSection[] = [
    {
      section: "Overview",
      items: [
        {
          label: "Dashboard",
          href: "/admin",
          icon: <LayoutDashboard size={16} />,
        },
        {
          label: "Live sessions",
          href: "/admin/sessions",
          icon: <Radio size={16} />,
          badge: liveCount > 0 ? liveCount : null,
          badgeColor: "bg-[#2B4FD4] text-white",
        },
      ],
    },
    {
      section: "People",
      items: [
        {
          label: "Doctors",
          href: "/admin/doctors",
          icon: <Stethoscope size={16} />,
        },
        {
          label: "Patients",
          href: "/admin/users",
          icon: <Users size={16} />,
        },
        {
          label: "Applications",
          href: "/admin/applications",
          icon: <ClipboardList size={16} />,
          badge: pendingCount > 0 ? pendingCount : null,
          badgeColor: "bg-orange-500 text-white",
        },
      ],
    },
    {
      section: "Platform",
      items: [
        {
          label: "VR scenes",
          href: "/admin/scenes",
          icon: <Film size={16} />,
        },
        {
          label: "Sessions",
          href: "/admin/sessions",
          icon: <Calendar size={16} />,
        },
        {
          label: "Payments",
          href: "/admin/payments",
          icon: <CreditCard size={16} />,
        },
        {
          label: "Analytics",
          href: "/admin/analytics",
          icon: <BarChart2 size={16} />,
        },
      ],
    },
    {
      section: "System",
      items: [
        {
          label: "AI pipeline",
          href: "/admin/ai-pipeline",
          icon: <Server size={16} />,
        },
        {
          label: "Settings",
          href: "/admin/settings",
          icon: <Settings size={16} />,
        },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 min-h-screen bg-[#0A0F1E] border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2.5">
          <SidebarIcon />
          <div className="flex flex-col">
            <span className="text-white font-semibold text-base leading-tight">
              Re<span className="text-[#6B8AFF]">V</span>erie
            </span>
            <span className="text-white/40 text-xs">Admin panel</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {nav.map((section) => (
          <div key={section.section} className="mb-6">
            <p className="text-white/30 text-xs font-semibold uppercase tracking-widest px-3 mb-2">
              {section.section}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive(item.href)
                      ? "bg-white/[0.07] text-white border-l-2 border-[#2B4FD4]"
                      : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                  }`}
                  style={isActive(item.href) ? { paddingLeft: "10px" } : {}}
                >
                  <span className={isActive(item.href) ? "text-[#6B8AFF]" : ""}>{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge != null && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

function SidebarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
      <rect x="4" y="11" width="28" height="16" rx="5" fill="#2B4FD4" opacity="0.8" />
      <rect x="7" y="14" width="9" height="10" rx="3" fill="#0A0F1E" />
      <rect x="20" y="14" width="9" height="10" rx="3" fill="#0A0F1E" />
      <path d="M8 21 L11 18.5 L13 20 L15 18 L15 23 L8 23Z" fill="#6B8AFF" opacity="0.7" />
      <path d="M21 21 L24 18.5 L26 20 L28 18 L28 23 L21 23Z" fill="#6B8AFF" opacity="0.7" />
    </svg>
  );
}
