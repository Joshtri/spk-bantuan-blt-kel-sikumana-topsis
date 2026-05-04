import { Container } from "@/components/container";
import { IAuthIdentity } from "@/interfaces/Authorize";
import { Card, Spinner } from "@heroui/react";
import { useCustom, useGetIdentity } from "@refinedev/core";
import DashboardAdmin from "../../../features/dashboard/admin/Dashboard.Admin";
import DashboardHeadOfOffice from "@/features/dashboard/head-of-office/Dashboard.HeadOfOffice";
import LoadingScreen from "@/components/loading/LoadingScreen";
import DashboardCandidate from "@/features/dashboard/candidate/Dashboard.Candidate";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import { IPeriod } from "@/features/periods/interfaces";
import { ApiResponse } from "@/interfaces/IBaseEntity";
import { formatDate } from "@/utils/date";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
};

export default function DashboardPage() {
  const { data, isLoading } = useGetIdentity<IAuthIdentity>();

  const {
    result,
    query: { isLoading: isPeriodCurrentaActiveLoading },
  } = useCustom<ApiResponse<IPeriod>>({
    url: "periods/current-active",
    method: "get",
  });
  const greeting = getGreeting();

  return (
    <Container maxWidth="full" variant="page" className="space-y-6">
      <LoadingScreen isLoading={isLoading} />
      {/* Common Welcome Section */}
      <Card variant="default" className="border backdrop-blur-sm">
        <div className="p-2">
          <div className="flex items-center gap-4">
            {/* <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-violet-800 text-lg font-bold text-white">
              {data?.username?.[0]?.toUpperCase() ?? "U"}
            </div> */}
            <div>
              <Heading
                as="h1"
                weight="bold"
                size="2xl"
                className="text-gray-800"
              >
                {greeting}, {data?.username}!
              </Heading>
              {/* <Text className="text-gray-500">
                {data?.role === "ADMIN" ? "Administrator" : "Pengguna"} • Sistem
                SPK Seleksi Penerima Bantuan TOPSIS
              </Text> */}
              {result?.data?.data && (
                <Text className="mt-2 text-sm text-violet-600">
                  Periode aktif saat ini adalah {result.data.data.name} (
                  {formatDate(result.data.data.startDate)} -{" "}
                  {formatDate(result.data.data.endDate)})
                </Text>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Role-Specific Content */}
      <div className="mt-6">
        {data?.role === "ADMIN" ? (
          <DashboardAdmin />
        ) : data?.role === "HEAD_OF_OFFICE" ? (
          <DashboardHeadOfOffice />
        ) : (
          <DashboardCandidate />
        )}
      </div>
    </Container>
  );
}
