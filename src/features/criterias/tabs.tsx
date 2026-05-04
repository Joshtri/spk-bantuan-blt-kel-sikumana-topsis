import CriteriaScale from "./CriteriaScale";
import DetailCriteria from "./form/Detail";

export const tabsCriteria = (isShow: boolean = false) => {
  const tabs = [
    {
      label: "Details",
      content: <DetailCriteria />,
    },
  ];

  if (isShow) {
    tabs.push({
      label: "Skala Kriteria",
      content: <CriteriaScale />,
    });
  }

  return tabs;
};
