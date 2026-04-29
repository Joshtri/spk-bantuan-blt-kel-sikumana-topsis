import { Container } from "@/components/container";
import StatCard from "@/components/stat-card";
import {
  UserPlusIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

export interface IOverviewStatistic {
  totalCandidates: number;
  totalAssessments: number;
  totalActivePeriods: number;
  totalEligible: number;
  totalNotEligible: number;
}

interface MainContentDashboardProps {
  stats?: IOverviewStatistic;
}

export default function MainContentDashboard({ stats }: MainContentDashboardProps) {
  return (
    <Container maxWidth="full" variant="page">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Calon Penerima"
          value={stats?.totalCandidates?.toString() ?? "-"}
          change="terdaftar"
          icon={<UserPlusIcon className="h-5 w-5" />}
          bgColor="bg-gradient-to-br from-violet-600 to-violet-800"
          textColor="text-white"
          delay={0}
        />
        <StatCard
          title="Penilaian"
          value={stats?.totalAssessments?.toString() ?? "-"}
          change="dilakukan"
          icon={<ClipboardDocumentListIcon className="h-5 w-5" />}
          bgColor="bg-gradient-to-br from-sky-500 to-sky-700"
          textColor="text-white"
          delay={0.08}
        />
        <StatCard
          title="Periode Aktif"
          value={stats?.totalActivePeriods?.toString() ?? "-"}
          change="berjalan"
          icon={<CalendarIcon className="h-5 w-5" />}
          bgColor="bg-gradient-to-br from-amber-500 to-amber-700"
          textColor="text-white"
          delay={0.16}
        />
        <StatCard
          title="Layak Menerima"
          value={stats?.totalEligible?.toString() ?? "-"}
          change="kandidat"
          icon={<CheckCircleIcon className="h-5 w-5" />}
          bgColor="bg-gradient-to-br from-emerald-500 to-emerald-700"
          textColor="text-white"
          delay={0.24}
        />
        <StatCard
          title="Tidak Layak"
          value={stats?.totalNotEligible?.toString() ?? "-"}
          change="kandidat"
          icon={<XCircleIcon className="h-5 w-5" />}
          bgColor="bg-gradient-to-br from-rose-500 to-rose-700"
          textColor="text-white"
          delay={0.32}
        />
      </div>
    </Container>
  );
}
