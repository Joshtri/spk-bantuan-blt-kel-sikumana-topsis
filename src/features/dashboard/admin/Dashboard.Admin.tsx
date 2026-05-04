import { ApiResponse } from "@/interfaces/IBaseEntity";
import { useCustom } from "@refinedev/core";
import React from "react";
import { Container } from "@/components/container";
import OverviewStat from "./charts/OverviewStat";
import { IOverviewStatistic } from "./charts/interfaces";
import AssessmentChartPerPeriod from "./statistics/AssessmentChartPerPeriod";
// import { IOverviewStatistic } from "../interfaces";

//this component is used for admin dashboard.
export default function DashboardAdmin() {
  const { result: overviewData } = useCustom<ApiResponse<IOverviewStatistic>>({
    url: "statistics/overview",
    method: "get",
  });

  // const { result: assessmentData } = useCustom<ApiResponse<any>>({
  //   url: "statistics/charts/per-period",
  //   method: "get",
  // });

  return (
    <>
      <OverviewStat data={overviewData?.data.data} />

      {/* <AssessmentChartPerPeriod data={assessmentData?.data.data} /> */}
    </>
  );
}
