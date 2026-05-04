import { useCustom } from "@refinedev/core";
import React from "react";
// import {}

export default function AssessmentChartPerPeriod() {
  const { result } = useCustom({
    url: "statistics/charts/per-period",
    method: "get",
  });
  return <div>AssessmentChartPerPeriod</div>;
}
