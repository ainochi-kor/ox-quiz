import { Outlet, Route, Routes } from "react-router";
import "./App.css";
import { lazy } from "react";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const AuthGuard = lazy(() => import("./components/router/AuthGuard"));
const Layout = lazy(() => import("./components/layout/Layout"));
const HomePage = lazy(() => import("./pages/HomePage"));
const QuizListPage = lazy(() => import("./pages/quiz/QuizListPage"));
const QuizDetailPage = lazy(() => import("./pages/quiz/QuizDetailPage"));
const QuizCreatePage = lazy(() => import("./pages/quiz/QuizCreatePage"));
const QuizStartPage = lazy(() => import("./pages/quiz/QuizStartPage"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route
          element={
            <AuthGuard>
              <Layout>
                <Outlet />
              </Layout>
            </AuthGuard>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="quiz">
            <Route index element={<QuizListPage />} />
            <Route path=":id" element={<QuizDetailPage />} />
            <Route path="create" element={<QuizCreatePage />} />
            <Route path="start" element={<QuizStartPage />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
