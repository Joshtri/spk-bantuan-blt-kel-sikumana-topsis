import StatCard from "@/components/stat-card";
import {
  ClipboardDocumentListIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { IOverviewStatistic } from "./interfaces";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
// import { type IOverviewStatistic } from "@/features/dashboard/Content";

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

  {
    title: "Total Kriteria",
    value: data?.totalCriteria ?? 0,
    href: "/kriteria",
    icon: <ClipboardDocumentListIcon className="h-5 w-5 text-white" />,
    bgColor: "bg-gradient-to-br from-green-500 to-green-700",
  },
];

export default function OverviewStat({ data }: OverviewStatProps) {
  return (
    <div className="space-y-6">
      {/* <div>
        <Heading size="2xl" as="h1" weight="bold" className="text-gray-800">
          Statistik Ringkasan
        </Heading>
        <Text size="sm" className="mt-1 text-gray-500">
          Ringkasan data sistem secara real-time
        </Text>
      </div> */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
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
    </div>
  );
}
