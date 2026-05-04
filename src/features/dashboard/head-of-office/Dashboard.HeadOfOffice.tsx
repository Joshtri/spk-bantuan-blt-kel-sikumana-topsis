import { useCustom } from "@refinedev/core";
import { Card, Link } from "@heroui/react";
import {
  UsersIcon,
  ClipboardDocumentListIcon,
  DocumentChartBarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import StatCard from "@/components/stat-card";
import { ApiResponse } from "@/interfaces/IBaseEntity";
import { IOverviewStatistic } from "@/features/dashboard/admin/charts/interfaces";

const quickLinks = [
  {
    key: "candidates",
    title: "Calon Penerima",
    description: "Kelola data calon penerima bantuan yang terdaftar.",
    href: "/calon-penerima",
    icon: <UsersIcon className="h-6 w-6 text-violet-600" />,
    bg: "bg-violet-100",
    color: "text-violet-600 hover:text-violet-700",
  },
  {
    key: "assessments",
    title: "Penilaian",
    description: "Buat dan kelola penilaian calon penerima bantuan.",
    href: "/penilaian",
    icon: <ClipboardDocumentListIcon className="h-6 w-6 text-sky-600" />,
    bg: "bg-sky-100",
    color: "text-sky-600 hover:text-sky-700",
  },
  {
    key: "topsis",
    title: "Perhitungan TOPSIS",
    description: "Lihat proses dan hasil perhitungan metode TOPSIS.",
    href: "/perhitungan-topsis",
    icon: <ChartBarIcon className="h-6 w-6 text-amber-600" />,
    bg: "bg-amber-100",
    color: "text-amber-600 hover:text-amber-700",
  },
  {
    key: "reports",
    title: "Laporan",
    description: "Unduh dan cetak laporan hasil seleksi penerima bantuan.",
    href: "/laporan",
    icon: <DocumentChartBarIcon className="h-6 w-6 text-green-600" />,
    bg: "bg-green-100",
    color: "text-green-600 hover:text-green-700",
  },
];

export default function DashboardHeadOfOffice() {
  const { result: overviewData } = useCustom<ApiResponse<IOverviewStatistic>>({
    url: "statistics/overview",
    method: "get",
  });

  const data = overviewData?.data?.data;

  const statCards = [
    {
      title: "Total Calon Penerima",
      value: data?.totalCandidates ?? 0,
      icon: <UsersIcon className="h-5 w-5 text-white" />,
      href: "/calon-penerima",
      bgColor: "bg-gradient-to-br from-violet-600 to-violet-800",
    },
    {
      title: "Total Penilaian",
      value: data?.totalAssessments ?? 0,
      icon: <ClipboardDocumentListIcon className="h-5 w-5 text-white" />,
      href: "/penilaian",
      bgColor: "bg-gradient-to-br from-sky-500 to-sky-700",
    },
    {
      title: "Layak Menerima",
      value: data?.totalEligible ?? 0,
      icon: <ClipboardDocumentListIcon className="h-5 w-5 text-white" />,
      href: "/laporan",
      bgColor: "bg-gradient-to-br from-green-500 to-green-700",
    },
    {
      title: "Tidak Layak",
      value: data?.totalNotEligible ?? 0,
      icon: <ClipboardDocumentListIcon className="h-5 w-5 text-white" />,
      href: "/laporan",
      bgColor: "bg-gradient-to-br from-red-500 to-red-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={s.value.toLocaleString()}
            icon={s.icon}
            href={s.href}
            bgColor={s.bgColor}
            textColor="text-white"
          />
        ))}
      </div>

      {/* Quick links */}
      <div>
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Menu Cepat
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((item) => (
            <Card
              key={item.key}
              className="border border-default-100 shadow-sm transition-shadow hover:shadow-md"
            >
              <Card.Content className="p-5">
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${item.bg}`}
                >
                  {item.icon}
                </div>
                <p className="mb-1 font-semibold text-gray-800">{item.title}</p>
                <p className="mb-4 text-sm text-gray-500">{item.description}</p>
                <Link href={item.href} className={`text-sm font-medium ${item.color}`}>
                  Buka →
                </Link>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
