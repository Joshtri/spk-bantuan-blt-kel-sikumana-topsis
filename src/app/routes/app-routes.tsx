import { Authenticated, ErrorComponent } from "@refinedev/core";
import { CatchAllNavigate, NavigateToResource } from "@refinedev/react-router";
import { Outlet, Route, Routes } from "react-router";

import { Layout } from "../../components/layout";

import { ForgotPassword } from "../pages/forgotPassword";
import { LoginPage } from "../pages/login";
import CriteriaListPage from "@/app/pages/criterias/list";
import UsersListPage from "@/app/pages/users/list";
import UserCreatePage from "@/app/pages/users/create";
import CriteriaCreatePage from "@/app/pages/criterias/create";
import CriteriaEditPage from "../pages/criterias/edit";
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

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        element={
          <Authenticated
            key="authenticated-inner"
            fallback={<CatchAllNavigate to="/login" />}
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
        </Route>

        <Route path="*" element={<ErrorComponent />} />
      </Route>

      <Route
        element={
          <Authenticated key="authenticated-outer" fallback={<Outlet />}>
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
