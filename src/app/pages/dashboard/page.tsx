import { Container } from "@/components/container";
import OverviewStat from "@/features/dashboard/charts/OverviewStat";
import {
  type IOverviewStatistic,
} from "@/features/dashboard/Content";
import { type ApiResponse } from "@/interfaces/IBaseEntity";
import { useCustom } from "@refinedev/core";

export default function DashboardPage() {
  const { result: overviewData } = useCustom<ApiResponse<IOverviewStatistic>>({
    url: "statistics/overview",
    method: "get",
  });

  return (
    <Container maxWidth="full" variant="page">
      <OverviewStat data={overviewData?.data.data} />
    </Container>
  );
}
