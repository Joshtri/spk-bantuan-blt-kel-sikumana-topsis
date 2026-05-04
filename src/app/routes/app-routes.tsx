import { Authenticated, ErrorComponent } from "@refinedev/core";
import { CatchAllNavigate, NavigateToResource } from "@refinedev/react-router";
import { Outlet, Route, Routes } from "react-router";
import { Spinner } from "@heroui/react";

import { Layout } from "../../components/layout";

import { ForgotPassword } from "../pages/forgotPassword";
import { LoginPage } from "../pages/login";
import CriteriaListPage from "@/app/pages/criterias/list";
import UsersListPage from "@/app/pages/users/list";
import UserCreatePage from "@/app/pages/users/create";
import CriteriaCreatePage from "@/app/pages/criterias/create";
import CriteriaEditPage from "@/app/pages/criterias/edit";
import CandidateRecipientEditPage from "../pages/candidate-recipients/edit";
import CandidateRecipientCreatePage from "../pages/candidate-recipients/create";
import CandidateRecipientListPage from "../pages/candidate-recipients/list";
import UserEditPage from "../pages/users/edit";
import PeriodListPage from "../pages/periods/list";
import PeriodCreatePage from "../pages/periods/create";
import PeriodEditPage from "../pages/periods/edit";
import CriteriaScaleListPage from "../pages/criteria-scales/list";
import CriteriaScaleCreatePage from "../pages/criteria-scales/create";
import CriteriaScaleEditPage from "../pages/criteria-scales/edit";
import AssessmentListPage from "../pages/assessments/list";
import AssessmentCreatePage from "../pages/assessments/create";
import AssessmentEditPage from "../pages/assessments/edit";
import DashboardPage from "../pages/dashboard/page";
import CriteriaShowPage from "../pages/criterias/show";
import QuestionListPreview from "../pages/list-question/page";
import TopsisCalculatesPage from "../pages/topsis-calculates/page";
import AssessmentShowPage from "../pages/assessments/show";
import CandidateHistoryAssessmentPage from "../pages/candidate-recipients/history";
import AssessmentCandidateHistoryShowPage from "../pages/candidate-recipients/show";
import ReportsPage from "../pages/reports/page";
import IdentityCandidatePage from "../pages/candidate-recipients/identity";
import MyAssessmentsHistoryPage from "../pages/candidates/my-assessments-history/page";
import AssessmentHistoryShowPage from "../pages/candidates/my-assessments-history/show";
import MyProfilePage from "../pages/my-profile/page";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        element={
          <Authenticated
            key="authenticated-inner"
            fallback={<CatchAllNavigate to="/login" />}
            loading={null}
          >
            <Layout>
              <Outlet />
            </Layout>
          </Authenticated>
        }
      >
        <Route index element={<DashboardPage />} />

        <Route path="/kriteria">
          <Route index element={<CriteriaListPage />} />
          <Route path="create" element={<CriteriaCreatePage />} />
          <Route path="edit/:id" element={<CriteriaEditPage />} />
          <Route path="show/:id" element={<CriteriaShowPage />} />
        </Route>

        <Route path="/users">
          <Route index element={<UsersListPage />} />
          <Route path="create" element={<UserCreatePage />} />
          <Route path="edit/:id" element={<UserEditPage />} />
        </Route>

        <Route path="/calon-penerima">
          <Route index element={<CandidateRecipientListPage />} />
          <Route path="create" element={<CandidateRecipientCreatePage />} />
          <Route path="edit/:id" element={<CandidateRecipientEditPage />} />
          <Route
            path="riwayat-penilaian/:id"
            element={<CandidateHistoryAssessmentPage />}
          />
          <Route
            path="jawaban/:id"
            element={<AssessmentCandidateHistoryShowPage />}
          />

          <Route path="identitas/:id" element={<IdentityCandidatePage />} />
        </Route>

        <Route path="/history-penilaian">
          <Route index element={<MyAssessmentsHistoryPage />} />
          <Route path="show/:id" element={<AssessmentHistoryShowPage />} />
        </Route>

        <Route path="/periode">
          <Route index element={<PeriodListPage />} />
          <Route path="create" element={<PeriodCreatePage />} />
          <Route path="edit/:id" element={<PeriodEditPage />} />
        </Route>

        <Route path="/skala-kriteria">
          <Route index element={<CriteriaScaleListPage />} />
          <Route path="create" element={<CriteriaScaleCreatePage />} />
          <Route path="edit/:id" element={<CriteriaScaleEditPage />} />
        </Route>

        <Route path="/penilaian">
          <Route index element={<AssessmentListPage />} />
          <Route path="create" element={<AssessmentCreatePage />} />
          <Route path="edit/:id" element={<AssessmentEditPage />} />
          <Route path="beri-penilaian/:id" element={<AssessmentCreatePage />} />
          <Route path="show/:id" element={<AssessmentShowPage />} />
        </Route>

        <Route path="/my-profile">
          <Route index element={<MyProfilePage />} />
        </Route>

        <Route path="/laporan">
          <Route index element={<ReportsPage />} />
        </Route>

        <Route path="/daftar-pertanyaan">
          <Route index element={<QuestionListPreview />} />
        </Route>

        <Route path="/perhitungan-topsis">
          <Route index element={<TopsisCalculatesPage />} />
        </Route>

        <Route path="*" element={<ErrorComponent />} />
      </Route>

      <Route
        element={
          <Authenticated
            key="authenticated-outer"
            fallback={<Outlet />}
            loading={
              <div className="flex h-screen items-center justify-center">
                <Spinner size="lg" />
              </div>
            }
          >
            <NavigateToResource resource="dashboard" />
          </Authenticated>
        }
      >
        <Route path="/login" element={<LoginPage />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/*
        <Route path="/register" element={<Register />} />
         */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
