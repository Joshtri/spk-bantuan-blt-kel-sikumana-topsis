import StatCard from "@/components/stat-card";
import {
  UsersIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { type IOverviewStatistic } from "@/features/dashboard/Content";

interface OverviewStatProps {
  data?: IOverviewStatistic;
}

const statCards = (data?: IOverviewStatistic) => [
  {
    title: "Total Calon Penerima Bantuan",
    value: data?.totalCandidates ?? 0,
    icon: <UsersIcon className="h-5 w-5 text-white" />,
    href: "/calon-penerima",
    bgColor: "bg-gradient-to-br from-violet-600 to-violet-800",
  },
  {
    title: "Total Penilaian",
    value: data?.totalAssessments ?? 0,
    href: "/penilaian",
    icon: <ClipboardDocumentListIcon className="h-5 w-5 text-white" />,
    bgColor: "bg-gradient-to-br from-sky-500 to-sky-700",
  },
  // {
  //   title: "Active Periods",
  //   value: data?.totalActivePeriods ?? 0,
  //   icon: <CalendarDaysIcon className="h-5 w-5 text-white" />,
  //   bgColor: "bg-gradient-to-br from-amber-500 to-amber-700",
  // },
  {
    title: "Eligible",
    value: data?.totalEligible ?? 0,
    icon: <CheckCircleIcon className="h-5 w-5 text-white" />,
    bgColor: "bg-gradient-to-br from-emerald-500 to-emerald-700",
  },
  {
    title: "Not Eligible",
    value: data?.totalNotEligible ?? 0,
    icon: <XCircleIcon className="h-5 w-5 text-white" />,
    bgColor: "bg-gradient-to-br from-rose-500 to-rose-700",
  },
];

export default function OverviewStat({ data }: OverviewStatProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {statCards(data).map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value.toLocaleString()}
          icon={stat.icon}
          href={stat.href}
          bgColor={stat.bgColor}
          textColor="text-white"
        />
      ))}
    </div>
  );
}
