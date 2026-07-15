import React from "react";
import { Refine, Authenticated } from "@refinedev/core";
import { useNotificationProvider } from "@refinedev/antd";
import { RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider, App as AntdApp, Result } from "antd";
import viVN from "antd/locale/vi_VN";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { authProvider } from "./providers/auth/auth-provider";
import { dataProvider } from "./providers/data/data-provider";
import { accessControlProvider } from "./providers/access-control/access-control-provider";
import { adminResources } from "./resources";
import { AdminLayout } from "./app-shell/AdminLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";

import { PropertiesList } from "./pages/properties/list";
import { PropertiesCreate } from "./pages/properties/create";
import { PropertiesEdit } from "./pages/properties/edit";
import { PropertiesShow } from "./pages/properties/show";

import { RentRequestsList } from "./pages/rent-requests/list";
import { RentRequestsCreate } from "./pages/rent-requests/create";
import { RentRequestsEdit } from "./pages/rent-requests/edit";
import { RentRequestsShow } from "./pages/rent-requests/show";

import { LeadsPropertyList } from "./pages/leads/property-list";
import { LeadsRentRequestList } from "./pages/leads/rent-request-list";
import { LeadsShow } from "./pages/leads/show";

import { MatchesList } from "./pages/matches/list";
import { MatchesShow } from "./pages/matches/show";

import { UsersList } from "./pages/users/list";
import { UsersShow } from "./pages/users/show";
import { UsersEdit } from "./pages/users/edit";

import { NewsList } from "./pages/news/list";
import { NewsCreate } from "./pages/news/create";
import { NewsEdit } from "./pages/news/edit";
import { NewsShow } from "./pages/news/show";

import { ProjectsList } from "./pages/projects/list";
import { ProjectsCreate } from "./pages/projects/create";
import { ProjectsEdit } from "./pages/projects/edit";
import { ProjectsShow } from "./pages/projects/show";

import { CategoriesList } from "./pages/categories/list";
import { CategoriesCreate } from "./pages/categories/create";
import { CategoriesEdit } from "./pages/categories/edit";

import { BannersList } from "./pages/banners/list";
import { BannersCreate } from "./pages/banners/create";
import { BannersEdit } from "./pages/banners/edit";

import { FaqsList } from "./pages/faqs/list";
import { FaqsCreate } from "./pages/faqs/create";
import { FaqsEdit } from "./pages/faqs/edit";

import { StaticPagesList } from "./pages/static-pages/list";
import { StaticPagesCreate } from "./pages/static-pages/create";
import { StaticPagesEdit } from "./pages/static-pages/edit";

import { SeoContentsList } from "./pages/seo/list";
import { SeoContentsCreate } from "./pages/seo/create";
import { SeoContentsEdit } from "./pages/seo/edit";

import { LocationsList } from "./pages/locations/list";

import { PaymentsList } from "./pages/payments/list";
import { PackageOrdersList } from "./pages/orders/package-list";
import { BoostOrdersList } from "./pages/orders/boost-list";
import { ExpressOrdersList } from "./pages/orders/express-list";

import { antdTheme } from "./styles/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function RefineInner() {
  const notifProvider = useNotificationProvider();

  return (
    <Refine
      authProvider={authProvider}
      dataProvider={dataProvider}
      accessControlProvider={accessControlProvider}
      notificationProvider={notifProvider}
      routerProvider={routerProvider}
      resources={adminResources}
      options={{ syncWithLocation: false, warnWhenUnsavedChanges: false }}
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <Authenticated key="guard" fallback={<Navigate to="/login" />}>
              <AdminLayout />
            </Authenticated>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="/properties" element={<PropertiesList />} />
          <Route path="/properties/create" element={<PropertiesCreate />} />
          <Route path="/properties/edit/:id" element={<PropertiesEdit />} />
          <Route path="/properties/show/:id" element={<PropertiesShow />} />
          <Route path="/rent-requests" element={<RentRequestsList />} />
          <Route
            path="/rent-requests/create"
            element={<RentRequestsCreate />}
          />
          <Route
            path="/rent-requests/edit/:id"
            element={<RentRequestsEdit />}
          />
          <Route
            path="/rent-requests/show/:id"
            element={<RentRequestsShow />}
          />
          <Route path="/leads/property" element={<LeadsPropertyList />} />
          <Route path="/leads/property/show/:id" element={<LeadsShow />} />
          <Route
            path="/leads/rent-request"
            element={<LeadsRentRequestList />}
          />
          <Route path="/leads/rent-request/show/:id" element={<LeadsShow />} />
          <Route path="/matches" element={<MatchesList />} />
          <Route path="/matches/show/:id" element={<MatchesShow />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/show/:id" element={<UsersShow />} />
          <Route path="/users/edit/:id" element={<UsersEdit />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/news/create" element={<NewsCreate />} />
          <Route path="/news/edit/:id" element={<NewsEdit />} />
          <Route path="/news/show/:id" element={<NewsShow />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/projects/create" element={<ProjectsCreate />} />
          <Route path="/projects/edit/:id" element={<ProjectsEdit />} />
          <Route path="/projects/show/:id" element={<ProjectsShow />} />
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/categories/create" element={<CategoriesCreate />} />
          <Route path="/categories/edit/:id" element={<CategoriesEdit />} />
          <Route path="/banners" element={<BannersList />} />
          <Route path="/banners/create" element={<BannersCreate />} />
          <Route path="/banners/edit/:id" element={<BannersEdit />} />
          <Route path="/faqs" element={<FaqsList />} />
          <Route path="/faqs/create" element={<FaqsCreate />} />
          <Route path="/faqs/edit/:id" element={<FaqsEdit />} />
          <Route path="/static-pages" element={<StaticPagesList />} />
          <Route path="/static-pages/create" element={<StaticPagesCreate />} />
          <Route path="/static-pages/edit/:id" element={<StaticPagesEdit />} />
          <Route path="/seo-contents" element={<SeoContentsList />} />
          <Route path="/seo-contents/create" element={<SeoContentsCreate />} />
          <Route path="/seo-contents/edit/:id" element={<SeoContentsEdit />} />
          <Route path="/locations" element={<LocationsList />} />
          <Route path="/payments" element={<PaymentsList />} />
          <Route path="/orders/packages" element={<PackageOrdersList />} />
          <Route path="/orders/boosts" element={<BoostOrdersList />} />
          <Route path="/orders/express" element={<ExpressOrdersList />} />
          <Route
            path="*"
            element={
              <Result
                status="404"
                subTitle="Route này không tồn tại hoặc bạn không có quyền truy cập."
                title="Không tìm thấy trang"
              />
            }
          />
        </Route>
      </Routes>
    </Refine>
  );
}

const App: React.FC = () => {
  return (
    <div className="admin-app-shell" data-theme="admin">
      <BrowserRouter>
        <ConfigProvider theme={antdTheme} locale={viVN}>
          <AntdApp>
            <QueryClientProvider client={queryClient}>
              <RefineKbarProvider>
                <RefineInner />
              </RefineKbarProvider>
            </QueryClientProvider>
          </AntdApp>
        </ConfigProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
